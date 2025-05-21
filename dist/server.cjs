"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Refactored mediasoup server with separated send/recv transport tracking
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mediasoup_1 = require("mediasoup");
const speech_1 = require("@google-cloud/speech");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' })); // STT용 바디파서 확장
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const PORT = 4000;
let worker;
let router;
const peers = new Map();
const socketToRoom = new Map();
const mediaCodecs = [
    { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
    { kind: "video", mimeType: "video/VP8", clockRate: 90000 },
];
const createWebRtcTransport = async () => {
    return await router.createWebRtcTransport({
        listenIps: [{ ip: "127.0.0.1" }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
    });
};
const initMediasoup = async () => {
    worker = await (0, mediasoup_1.createWorker)();
    router = await worker.createRouter({ mediaCodecs });
    console.log("[Mediasoup] Worker & Router initialized");
};
const speechClient = new speech_1.SpeechClient();
app.post('/api/stt', async (req, res) => {
    try {
        const { audioContent } = req.body; // base64 string
        if (!audioContent) {
            res.status(400).json({ error: 'audioContent 누락' });
            return;
        }
        const audio = { content: audioContent };
        const config = {
            encoding: speech_1.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
            sampleRateHertz: 16000,
            languageCode: 'ko-KR',
        };
        const request = { audio, config };
        const [response] = await speechClient.recognize(request);
        const results = response.results;
        const transcript = results
            .map((r) => r.alternatives && r.alternatives[0] ? r.alternatives[0].transcript : '')
            .join('\n');
        res.json({ transcript });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'STT 변환 실패' });
        return;
    }
});
io.on("connection", (socket) => {
    console.log("[Socket] Connected:", socket.id);
    socket.on("joinRoom", (roomId, cb) => {
        if (!peers.has(roomId))
            peers.set(roomId, new Map());
        peers.get(roomId).set(socket.id, {
            producers: new Map(),
            consumers: [],
            socketId: socket.id,
        });
        socket.join(roomId);
        socketToRoom.set(socket.id, roomId);
        const existingProducers = [...(peers.get(roomId)?.values() || [])]
            .flatMap((peer) => [...peer.producers.values()].map((producer) => ({
            producerId: producer.id,
            kind: producer.kind,
            appData: producer.appData,
            socketId: peer.socketId,
        })));
        socket.emit("existingProducers", existingProducers);
        cb(router.rtpCapabilities);
    });
    socket.on("getRouterRtpCapabilities", (_, cb) => {
        cb(router.rtpCapabilities);
    });
    socket.on("create-transport", async (_, cb) => {
        const transport = await createWebRtcTransport();
        const roomId = socketToRoom.get(socket.id);
        if (!roomId)
            return;
        const peer = peers.get(roomId)?.get(socket.id);
        if (peer)
            peer.sendTransport = transport;
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
        if (!roomId)
            return;
        const peer = peers.get(roomId)?.get(socket.id);
        if (peer)
            peer.recvTransport = transport;
        cb({
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
        });
    });
    socket.on("transport-connect", async ({ dtlsParameters }) => {
        const roomId = socketToRoom.get(socket.id);
        const transport = peers.get(roomId)?.get(socket.id)?.sendTransport;
        await transport?.connect({ dtlsParameters });
    });
    socket.on("recv-transport-connect", async ({ dtlsParameters }, cb) => {
        const roomId = socketToRoom.get(socket.id);
        const transport = peers.get(roomId)?.get(socket.id)?.recvTransport;
        await transport?.connect({ dtlsParameters });
        cb?.();
    });
    socket.on("transport-produce", async ({ kind, rtpParameters, appData }, cb) => {
        const roomId = socketToRoom.get(socket.id);
        const transport = peers.get(roomId)?.get(socket.id)?.sendTransport;
        const producer = await transport?.produce({ kind, rtpParameters, appData });
        if (!producer)
            return;
        const peer = peers.get(roomId)?.get(socket.id);
        peer?.producers.set(producer.id, producer);
        producer.on("transportclose", () => {
            peer?.producers.delete(producer.id);
            socket.to(roomId).emit("producer-closed", producer.id);
        });
        socket.to(roomId).emit("new-producer", {
            producerId: producer.id,
            kind: producer.kind,
            appData: producer.appData,
            socketId: socket.id,
        });
        cb({ id: producer.id });
    });
    socket.on("consume", async ({ producerId, rtpCapabilities }, cb) => {
        const roomId = socketToRoom.get(socket.id);
        const peer = peers.get(roomId)?.get(socket.id);
        const transport = peer?.recvTransport;
        const producer = [...(peers.get(roomId)?.values() || [])]
            .flatMap((p) => [...p.producers.values()])
            .find((p) => p.id === producerId);
        if (!producer || !transport || !peer)
            return;
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
    socket.on("close-producer", (producerId) => {
        const roomId = socketToRoom.get(socket.id);
        const peer = peers.get(roomId)?.get(socket.id);
        const producer = peer?.producers.get(producerId);
        if (producer) {
            producer.close();
            peer?.producers.delete(producerId);
            socket.to(roomId).emit("producer-closed", producerId);
        }
    });
    socket.on("disconnect", () => {
        const roomId = socketToRoom.get(socket.id);
        const peer = peers.get(roomId)?.get(socket.id);
        if (peer) {
            peer.sendTransport?.close();
            peer.recvTransport?.close();
            peer.producers.forEach((p) => p.close());
            peer.consumers.forEach((c) => c.close());
            peers.get(roomId)?.delete(socket.id);
        }
        if (peers.get(roomId)?.size === 0)
            peers.delete(roomId);
        socketToRoom.delete(socket.id);
    });
});
server.listen(PORT, async () => {
    await initMediasoup();
    console.log(`🚀 Mediasoup server running on http://localhost:${PORT}`);
});
