
// Refactored mediasoup server with separated send/recv transport tracking

import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createWorker, types as mediasoupTypes } from "mediasoup";
import { SpeechClient, protos } from '@google-cloud/speech';


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // STT용 바디파서 확장

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = 4000;

let worker: mediasoupTypes.Worker;
let router: mediasoupTypes.Router;

const peers = new Map<
  string,
  Map<
    string,
    {
      sendTransport?: mediasoupTypes.WebRtcTransport;
      recvTransport?: mediasoupTypes.WebRtcTransport;
      producers: Map<string, mediasoupTypes.Producer>;
      consumers: mediasoupTypes.Consumer[];
      socketId: string;
    }
  >
>();

const socketToRoom = new Map<string, string>();

const mediaCodecs: mediasoupTypes.RtpCodecCapability[] = [
  { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
  { kind: "video", mimeType: "video/VP8", clockRate: 90000 },
];

const createWebRtcTransport = async (): Promise<mediasoupTypes.WebRtcTransport> => {
  return await router.createWebRtcTransport({
    listenIps: [{ ip: "127.0.0.1" }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });
};

const initMediasoup = async () => {
  worker = await createWorker();
  router = await worker.createRouter({ mediaCodecs });
  console.log("[Mediasoup] Worker & Router initialized");
};

const speechClient = new SpeechClient();


app.post('/api/stt', async (req: Request, res: Response): Promise<void> => {
  try {
    const { audioContent, roomId, senderId } = req.body;
    if (!audioContent || !roomId || !senderId) {
      res.status(400).json({ error: 'audioContent, roomId, senderId 누락' });
      return;
    }

    const audio = { content: audioContent };
    const config = {
      encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
      sampleRateHertz: 48000,
      languageCode: 'ko-KR',
    };
    const request = { audio, config };
    const [response] = await speechClient.recognize(request);
    const results = response.results as protos.google.cloud.speech.v1.SpeechRecognitionResult[];
    const transcript = results
      .map((r) => r.alternatives && r.alternatives[0] ? r.alternatives[0].transcript : '')
      .join('\n');

    res.json({ transcript });

    if (transcript.trim() !== "") {
      await fetch(`https://${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/api/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CONVEX_DEPLOY_KEY}`,
        },
        body: JSON.stringify({ roomId, senderId, text: transcript }),
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'STT 변환 실패' });
  }
});


io.on("connection", (socket) => {
  console.log("[Socket] Connected:", socket.id);

  socket.on("joinRoom", (roomId: string, cb) => {
    if (!peers.has(roomId)) peers.set(roomId, new Map());

    peers.get(roomId)!.set(socket.id, {
      producers: new Map(),
      consumers: [],
      socketId: socket.id,
    });

    socket.join(roomId);
    socketToRoom.set(socket.id, roomId);

    const existingProducers = [...(peers.get(roomId)?.values() || [])]
      .flatMap((peer) =>
        [...peer.producers.values()].map((producer) => ({
          producerId: producer.id,
          kind: producer.kind,
          appData: producer.appData,
          socketId: peer.socketId,
        }))
      );

    socket.emit("existingProducers", existingProducers);
    cb(router.rtpCapabilities);
  });

  socket.on("getRouterRtpCapabilities", (_, cb) => {
    cb(router.rtpCapabilities);
  });

  socket.on("create-transport", async (_, cb) => {
    const transport = await createWebRtcTransport();
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;
    const peer = peers.get(roomId)?.get(socket.id);
    if (peer) peer.sendTransport = transport;

    cb({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    });
  });

  socket.on("create-recv-transport", async (_, cb) => {
    const transport = await createWebRtcTransport();
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;
    const peer = peers.get(roomId)?.get(socket.id);
    if (peer) peer.recvTransport = transport;

    cb({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    });
  });

  socket.on("transport-connect", async ({ dtlsParameters }) => {
    const roomId = socketToRoom.get(socket.id);
    const transport = peers.get(roomId!)?.get(socket.id)?.sendTransport;
    await transport?.connect({ dtlsParameters });
  });

  socket.on("recv-transport-connect", async ({ dtlsParameters }, cb) => {
    const roomId = socketToRoom.get(socket.id);
    const transport = peers.get(roomId!)?.get(socket.id)?.recvTransport;
    await transport?.connect({ dtlsParameters });
    cb?.();
  });

  socket.on("transport-produce", async ({ kind, rtpParameters, appData }, cb) => {
    const roomId = socketToRoom.get(socket.id);
    const transport = peers.get(roomId!)?.get(socket.id)?.sendTransport;
    const producer = await transport?.produce({ kind, rtpParameters, appData });
    if (!producer) return;

    const peer = peers.get(roomId!)?.get(socket.id);
    peer?.producers.set(producer.id, producer);

    producer.on("transportclose", () => {
      peer?.producers.delete(producer.id);
      socket.to(roomId!).emit("producer-closed", producer.id);
    });

    socket.to(roomId!).emit("new-producer", {
      producerId: producer.id,
      kind: producer.kind,
      appData: producer.appData,
      socketId: socket.id,
    });

    cb({ id: producer.id });
  });

  socket.on("consume", async ({ producerId, rtpCapabilities }, cb) => {
    const roomId = socketToRoom.get(socket.id);
    const peer = peers.get(roomId!)?.get(socket.id);
    const transport = peer?.recvTransport;
    const producer = [...(peers.get(roomId!)?.values() || [])]
      .flatMap((p) => [...p.producers.values()])
      .find((p) => p.id === producerId);

    if (!producer || !transport || !peer) return;

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: false,
    });

    peer.consumers.push(consumer);

    consumer.on("producerclose", () => {
      consumer.close();
      peer.consumers = peer.consumers.filter((c) => c.id !== consumer.id);
      socket.emit("consumer-closed", { consumerId: consumer.id });
    });

    cb({
      id: consumer.id,
      producerId: producer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      appData: producer.appData,
    });
  });

  socket.on("close-producer", (producerId: string) => {
    const roomId = socketToRoom.get(socket.id);
    const peer = peers.get(roomId!)?.get(socket.id);
    const producer = peer?.producers.get(producerId);
    if (producer) {
      producer.close();
      peer?.producers.delete(producerId);
      socket.to(roomId!).emit("producer-closed", producerId);
    }
  });

  socket.on("disconnect", () => {
    const roomId = socketToRoom.get(socket.id);
    const peer = peers.get(roomId!)?.get(socket.id);
    if (peer) {
      peer.sendTransport?.close();
      peer.recvTransport?.close();
      peer.producers.forEach((p) => p.close());
      peer.consumers.forEach((c) => c.close());
      peers.get(roomId!)?.delete(socket.id);
    }
    if (peers.get(roomId!)?.size === 0) peers.delete(roomId!);
    socketToRoom.delete(socket.id);
  });
});

server.listen(PORT, async () => {
  await initMediasoup();
  console.log(`🚀 Mediasoup server running on http://localhost:${PORT}`);
});
