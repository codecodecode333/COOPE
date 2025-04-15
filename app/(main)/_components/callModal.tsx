import { Button } from "@/components/ui/button";
import React from "react";
import WebRTCComponent from "./WebRtcComponent"; // WebRTC 추가

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

const CallModal: React.FC<ModalProps> = ({ isOpen, onClose, roomId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="rounded-lg p-6 w-5/12 h-auto border bg-white dark:bg-neutral-900">
        <h2 className="text-xl font-bold">통화 시작하기</h2>
        <WebRTCComponent roomId={roomId}/>
        <Button className="mt-4 px-4 py-2 rounded" onClick={onClose}>
          닫기
        </Button>
      </div>
    </div>
  );
};

export default CallModal;
