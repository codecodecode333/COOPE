"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  RtpCapabilities,
  TransportOptions,
  MediaKind,
  RtpParameters,
  AppData,
  Transport
} from "mediasoup-client/types";
import { Device as MediaDevice } from "mediasoup-client";
import "webrtc-adapter";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, ScreenShare, ScreenShareOff } from "lucide-react";

interface WebRtcProps {
  roomId: string;
}

type StreamType = "camera" | "screen";

type ProducerInfo = {
  producerId: string;
  kind: MediaKind;
  appData: AppData & { type: StreamType };
  socketId: string;
};

export default function WebRtcComponent({ roomId }: WebRtcProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null); // 내 비디오
  const remoteContainerRef = useRef<HTMLDivElement>(null); // 수신되는 비디오

  const socketRef = useRef<ReturnType<typeof io> | null>(null); // useState를 통해 socket을 뿌렸더니 비동기적으로 업데이트 돼서 이전값이라 socket connected가 계속 false로 바뀌는 현상때문에 uesRef로 바꿈
  const [device, setDevice] = useState<MediaDevice | null>(null); // device
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null); //카메라
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null); //화면
  const [micEnabled, setMicEnabled] = useState(true); //마이크
  const [camEnabled, setCamEnabled] = useState(false);
  const [myProducerId, setMyProducerId] = useState<{ camera?: string; screen?: string }>({});
  const deviceRef = useRef<MediaDevice | null>(null); //device도 useState로할시 같은 현상이 나타나서 create해줄때랑 그리고 device를 쓰는 상황에 이걸씀
  const [hasRemoteScreenShare, setHasRemoteScreenShare] = useState(false); //상대방이 공유하고 있는 화면이 있을때 내 비디오 css를 바꿔주기 위해 추가한 것
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);

  //디바이스 생성
  const createDevice = async (rtpCapabilities: RtpCapabilities) => {
    const dev = new MediaDevice();
    await dev.load({ routerRtpCapabilities: rtpCapabilities });
    setDevice(dev);
    deviceRef.current = dev;
    console.log("[Device] Device created and loaded");
    return dev;
  };

  const getRtpCapabilities = async (): Promise<RtpCapabilities> => {
    console.log("[Socket] getRtpCapabilities 요청");
    return await new Promise((res) => {
      socketRef.current?.emit("getRouterRtpCapabilities", {}, res);
    });
  };

  const createRecvTransport = async () => {
    if (recvTransportRef.current) {
      console.log("[Transport] 기존 수신 transport 사용");
      return recvTransportRef.current;
    }
    console.log("[Transport] createRecvTransport 요청");
    const transportInfo = await new Promise<TransportOptions>((res, rej) => {
      const socket = socketRef.current;
      if (!socket) return rej("소켓 없음");
      socket.emit("create-recv-transport", {}, (response: TransportOptions | PromiseLike<TransportOptions>) => {
        console.log("[Transport] create-recv-transport 응답:", response);
        res(response);
      });
    });

    const dev = device ?? (await createDevice(await getRtpCapabilities()));
    const transport = dev.createRecvTransport(transportInfo);

    transport.on("connect", ({ dtlsParameters }, callback) => {
      console.log("[Transport] recv-transport 연결 시작");
      socketRef.current?.emit("recv-transport-connect", { dtlsParameters }, () => {
        console.log("[Transport] recv-transport 연결 완료");
        callback();
      });
    });

    transport.on("connectionstatechange", (state) => {
      console.log("[Transport] 수신 트랜스포트 상태:", state);
    });

    recvTransportRef.current = transport;
    return transport;
  };

  const handleNewProducer = useCallback(async (info: ProducerInfo) => {
    console.log("[Consumer] new producer 수신:", info);

    const socket = socketRef.current;
    const device = deviceRef.current;
    if (!device || !socket) {
      console.warn("[Consumer] Device 또는 Socket이 없음");
      return;
    }

    const rtpCapabilities = device.rtpCapabilities;
    const transport = await createRecvTransport();

    const { id, producerId, kind, rtpParameters, appData } = await new Promise<{
      id: string;
      producerId: string;
      kind: MediaKind;
      rtpParameters: RtpParameters;
      appData: AppData & { type: StreamType };
    }>((res) => {
      socket.emit("consume", { producerId: info.producerId, rtpCapabilities }, res);
    });

    const consumer = await transport.consume({ id, producerId, kind, rtpParameters });
    const stream = new MediaStream([consumer.track]);
    console.log(" new stream: ", stream);
    console.log(" Video track settings:", consumer.track.getSettings?.());

    const videoEl = document.createElement("video");
    videoEl.srcObject = stream;
    videoEl.autoplay = true;
    videoEl.playsInline = true;
    videoEl.addEventListener("loadedmetadata", () => console.log("✅ metadata loaded"));
    videoEl.addEventListener("canplay", () => console.log("✅ can play"));
    videoEl.addEventListener("play", () => console.log("▶️ playing"));
    videoEl.addEventListener("error", (e) => console.error("❌ video error", e));
    videoEl.setAttribute("data-producer-id", producerId);
    videoEl.setAttribute("data-type", appData.type);
    videoEl.className = "w-full h-full object-cover border border-white";

    setHasRemoteScreenShare(true);
    const container = remoteContainerRef.current;
    if (container) {
      const existing = container.querySelector(`[data-producer-id="${producerId}"]`);
      if (existing) {
        container.replaceChild(videoEl, existing);
        console.log("[DOM] 기존 video 엘리먼트 교체");
      } else {
        container.appendChild(videoEl);
        console.log("[DOM] 새로운 video 엘리먼트 추가");
      }
    }
  }, []);

  const setupSocket = useCallback(() => {
    const sock = io("http://localhost:4000");
    socketRef.current = sock;

    sock.on("connect", async () => {
      console.log("[Socket] 연결됨:", sock.id);
      const rtpCapabilities = await new Promise<RtpCapabilities>((res) => {
        sock.emit("joinRoom", roomId, res);
      });
      await createDevice(rtpCapabilities);
    });

    sock.on("existingProducers", (producers: ProducerInfo[]) => {
      console.log("[Socket] 기존 producers 수신:", producers);
      producers.forEach(handleNewProducer);
    });

    sock.on("new-producer", (info: ProducerInfo) => {
      console.log("[Socket] 새로운 producer 수신:", info);
      handleNewProducer(info);
    });

    sock.on("producer-closed", (producerId: string) => {
      console.log("[Socket] producer 종료됨:", producerId);
      const container = remoteContainerRef.current;
      const el = container?.querySelector(`[data-producer-id="${producerId}"]`);
      if (el) container?.removeChild(el);
    });

    return sock;
  }, [roomId, handleNewProducer]);

  useEffect(() => {
    const sock = setupSocket();
    return () => {
      console.log("[Socket] 클린업: 연결 해제");
      sock.disconnect();
      sendTransportRef.current?.close();
      recvTransportRef.current?.close();
      sendTransportRef.current = null;
      recvTransportRef.current = null;
    };
  }, [setupSocket]);

  const createSendTransport = async () => {
    if (sendTransportRef.current) {
      console.log("[Transport] 기존 송신 transport 제거");
      sendTransportRef.current.close();
      sendTransportRef.current = null;
    }
    console.log("[Transport] createSendTransport 요청");
    const transportInfo = await new Promise<TransportOptions>((res) => {
      socketRef.current?.emit("create-transport", {}, res);
    });
    const dev = device ?? (await createDevice(await getRtpCapabilities()));
    const transport = dev.createSendTransport(transportInfo);

    transport.on("connect", ({ dtlsParameters }, callback) => {
      console.log("[Transport] 송신 연결 요청");
      socketRef.current?.emit("transport-connect", { dtlsParameters });
      callback(); //여기서 중복 호출되면 안됨
    });

    transport.on("produce", ({ kind, rtpParameters, appData }, callback) => {
      console.log("[Transport] produce 요청:", kind, appData);
      socketRef.current?.emit("transport-produce", { kind, rtpParameters, appData }, ({ id }: { id: string }) => {
        const typedAppData = appData as { type: StreamType };
        setMyProducerId((prev) => ({ ...prev, [typedAppData.type]: id }));
        callback({ id });
      });
    });
    sendTransportRef.current = transport;
    return transport;
  };

  const startMedia = async (type: StreamType) => {
    console.log(`[Media] ${type} 시작`);
    const stream =
      type === "camera"
        ? await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        : await navigator.mediaDevices.getDisplayMedia({ video: true });

    const transport = await createSendTransport();
    for (const track of stream.getTracks()) {
      console.log("🎥 track 상태:", {
        kind: track.kind,
        enabled: track.enabled,
        muted: track.muted,
        readyState: track.readyState,
      });
      await transport.produce({ track, appData: { type } });
    }

    if (type === "camera") {
      setCameraStream(stream);
      setCamEnabled(true);
    } else {
      setScreenStream(stream);
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    if (type === "screen") {
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        console.log("[Media] 화면 공유 종료됨");
        stopMedia("screen");
      });
    }
  };

  const stopMedia = (type: StreamType) => {
    console.log(`[Media] ${type} 종료`);
    const stream = type === "camera" ? cameraStream : screenStream;
    stream?.getTracks().forEach((t) => t.stop());

    const socket = socketRef.current;
    if (socket && myProducerId[type]) {
      socket.emit("close-producer", myProducerId[type]);
      setMyProducerId((prev) => ({ ...prev, [type]: undefined }));
    }

    if (type === "camera") {
      setCameraStream(null);
      setCamEnabled(false);
    } else {
      setScreenStream(null);
    }

    if (!cameraStream && !screenStream && localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    console.log("[UI] 카메라 토글");
    cameraStream ? stopMedia("camera") : startMedia("camera");
  };

  const toggleScreen = () => {
    console.log("[UI] 화면공유 토글");
    screenStream ? stopMedia("screen") : startMedia("screen");
  };

  const toggleMic = () => {
    console.log("[UI] 마이크 토글");
    const stream = cameraStream ?? screenStream;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !micEnabled));
    setMicEnabled((prev) => !prev);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
        <div
          ref={remoteContainerRef}
          className="absolute top-0 left-0 w-full h-full flex flex-wrap justify-center items-center gap-2"
        />
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className={`absolute ${hasRemoteScreenShare ? "w-1/4 bottom-4 right-4" : "w-full h-full"} object-cover border border-white rounded`}
        />

      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={toggleCamera}>{camEnabled ? <VideoOff /> : <Video />}</Button>
        <Button onClick={toggleScreen}>{screenStream ? <ScreenShareOff /> : <ScreenShare />}</Button>
        <Button onClick={toggleMic}>{micEnabled ? <Mic /> : <MicOff />}</Button>
      </div>
    </div>
  );
}
