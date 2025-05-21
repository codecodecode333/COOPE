// MiniCallPopup.tsx
export default function MiniCallPopup({ onExpand }: { onExpand: () => void }) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-lg shadow-lg flex gap-2 z-50">
        {/* 최소화된 UI: 아이콘들 + 복구 버튼 */}
        <button title="마이크"><img src="/mic.png" alt="mic" /></button>
        <button title="카메라"><img src="/cam.png" alt="cam" /></button>
        <button title="화면공유"><img src="/screen.png" alt="screen" /></button>
        <button title="확장" onClick={onExpand}>🔼</button>
      </div>
    );
  }
  