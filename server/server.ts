// server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createWorker, types as mediasoupTypes } from "mediasoup";

const app = express();
app.use(cors());

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
      transports: mediasoupTypes.WebRtcTransport[];
      producers: Map<string, mediasoupTypes.Producer>;
      consumers: mediasoupTypes.Consumer[];
      socketId: string;
    }
  >
>();

const socketToRoom = new Map<string, string>();

const mediaCodecs: mediasoupTypes.RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
  },
];

const createWebRtcTransport = async (): Promise<mediasoupTypes.WebRtcTransport> => {
  const transport = await router.createWebRtcTransport({
    listenIps: [{ ip: "127.0.0.1", announcedIp: undefined }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });
  return transport;
};

const initMediasoup = async () => {
  worker = await createWorker();
  router = await worker.createRouter({ mediaCodecs });
  console.log("[Mediasoup] Worker & Router initialized");
};

io.on("connection", (socket) => {
  console.log("[Socket] Connected:", socket.id);

  socket.on("joinRoom", (roomId: string, cb) => {
    console.log(`[JoinRoom] ${socket.id} joined ${roomId}`);
    if (!peers.has(roomId)) peers.set(roomId, new Map());

    peers.get(roomId)!.set(socket.id, {
      transports: [],
      producers: new Map(),
      consumers: [],
      socketId: socket.id,
    });

    socket.join(roomId);
    socketToRoom.set(socket.id, roomId);

    // 기존 Producer 정보 전송
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
    cb(router.rtpCapabilities); // 클라이언트에 RTP Capabilities 전달
  });

  socket.on("getRouterRtpCapabilities", (_, cb) => {
    console.log("[Router] RtpCapabilities 요청");
    cb(router.rtpCapabilities);
  });

  socket.on("create-transport", async (_, cb) => {
    const transport = await createWebRtcTransport();
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;

    peers.get(roomId)?.get(socket.id)?.transports.push(transport);
    cb({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    });
  });

  socket.on("transport-connect", async ({ dtlsParameters }) => {
    const roomId = socketToRoom.get(socket.id);
    const transport = peers.get(roomId!)?.get(socket.id)?.transports.at(-1);

    await transport?.connect({ dtlsParameters });
    console.log("[Transport] 연결됨");
  });

  socket.on("transport-produce", async ({ kind, rtpParameters, appData }, cb) => {
    const roomId = socketToRoom.get(socket.id);
    const transport = peers.get(roomId!)?.get(socket.id)?.transports.at(-1);
    const producer = await transport?.produce({ kind, rtpParameters, appData });
    if (!producer) return;

    peers.get(roomId!)?.get(socket.id)?.producers.set(producer.id, producer);

    socket.to(roomId!).emit("new-producer", {
      producerId: producer.id,
      kind: producer.kind,
      appData: producer.appData,
      socketId: socket.id,
    });

    console.log(`[Producer] ${producer.id} 생성, kind: ${kind}, type: ${appData.type}`);
    cb({ id: producer.id });
  });

  socket.on("create-recv-transport", async (_, cb) => {
    const transport = await createWebRtcTransport();
    const roomId = socketToRoom.get(socket.id);
    peers.get(roomId!)?.get(socket.id)?.transports.push(transport);
    cb({
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    });

    console.log("[Transport] create-recv-transport 응답 완료");
  });

  socket.on("recv-transport-connect", async ({ dtlsParameters }, cb) => {
    const roomId = socketToRoom.get(socket.id);
    const transport = peers.get(roomId!)?.get(socket.id)?.transports.at(-1);
    await transport?.connect({ dtlsParameters });
    console.log("[Server] 수신 transport 연결됨");

    if (cb) {
      console.log("[Server] recv-transport-connect callback 호출");
      cb(); // ✅ 클라이언트에 응답
    }
  });


  socket.on("consume", async ({ producerId, rtpCapabilities }, cb) => {
    const roomId = socketToRoom.get(socket.id);
    const peer = peers.get(roomId!)?.get(socket.id);
    const transport = peer?.transports.at(-1);
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

    cb({
      id: consumer.id,
      producerId: producer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      appData: producer.appData,
    });

    consumer.on("producerclose", () => {
      consumer.close();
      peer.consumers = peer.consumers.filter((c) => c.id !== consumer.id);
      socket.emit("consumer-closed", { consumerId: consumer.id });
    });

    console.log(`[Consumer] 소비 시작: ${consumer.id} from ${producerId}`);
  });

  socket.on("close-producer", (producerId: string) => {
    const roomId = socketToRoom.get(socket.id);
    const peer = peers.get(roomId!)?.get(socket.id);
    const producer = peer?.producers.get(producerId);

    if (producer) {
      producer.close();
      peer?.producers.delete(producerId);
      socket.to(roomId!).emit("producer-closed", producerId);
      console.log(`[Producer] 종료됨: ${producerId}`);
    }
  });

  socket.on("disconnect", () => {
    const roomId = socketToRoom.get(socket.id);
    if (roomId) {
      const peer = peers.get(roomId)?.get(socket.id);
      peer?.transports.forEach((t) => t.close());
      peer?.producers.forEach((p) => p.close());
      peer?.consumers.forEach((c) => c.close());
      peers.get(roomId)?.delete(socket.id);
      if (peers.get(roomId)?.size === 0) peers.delete(roomId);
    }
    socketToRoom.delete(socket.id);
    console.log(`[Disconnect] ${socket.id}`);
  });
});

server.listen(PORT, async () => {
  await initMediasoup();
  console.log(`🚀 Mediasoup server running on http://localhost:${PORT}`);
});
