import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import WebRTCComponent from "./WebRtcComponent"; // WebRTC 추가
import { Minus, Square, SquareX, X } from "lucide-react";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}


const CallModal: React.FC<ModalProps> = ({ isOpen, onClose, roomId }) => {
  const [minimized, setMinimized] = useState(false);

  if (!isOpen && !minimized) return null;

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-neutral-900 text-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-3">
        <span className="text-sm">통화 중</span>
        <Button size="icon" variant="ghost" onClick={() => setMinimized(false)}>🔼</Button>
        <Button size="icon" variant="destructive" onClick={() => setMinimized(false)}>❌</Button>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="rounded-lg p-6 w-5/12 h-auto border bg-white dark:bg-neutral-900">
        <h2 className="text-xl font-bold">통화</h2>
        <WebRTCComponent roomId={roomId} />
        <Button variant="ghost" className="mt-4 ml-2 mr-1 px-2 py-2 rounded" onClick={() => setMinimized(true)}><Minus /></Button>
        <Button variant="outline" className="mt-4 px-2 py-2 rounded" onClick={onClose}><X /></Button>
      </div>
    </div>
  );
};

export default CallModal;
