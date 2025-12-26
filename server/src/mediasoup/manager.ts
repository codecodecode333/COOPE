import { createWorker, types as mediasoupTypes } from "mediasoup";
import { mediaCodecs } from "../config/mediasoupConfig";

let worker: mediasoupTypes.Worker;

export const initWorker = async () => {
    worker = await createWorker({ rtcMinPort: 10000, rtcMaxPort: 10100 });
    worker.on('died', () => process.exit(1));
    return worker;
};

export const createRoomRouter = async () => {
    return await worker.createRouter({ mediaCodecs });
};

export const createWebRtcTransport = async (router: mediasoupTypes.Router) => {
    const transport = await router.createWebRtcTransport({
        listenIps: [{ ip: "127.0.0.1" }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
    });
    return transport;
};