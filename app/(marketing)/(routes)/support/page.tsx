"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Modal from "../../_components/modal";
import { useState } from "react"
import { MailOpen } from "lucide-react";
import FaqContent from "../../_components/faq";

const Support = () => {
  const [isQnaModalOpen, setIsQnaModalOpen] = useState(false);

  const openQnaModal = () => setIsQnaModalOpen(true);
  const closeQnasModal = () => setIsQnaModalOpen(false);
  return (
    <div className="min-h-full flex flex-col relative">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <h1 className="text-4xl font-bold">고객지원</h1>
        <div className="tracking-in-expand">
          <h3 className="mb-4">Coope의 기능들을 함께 알아보고, 의문을 해결하세요. </h3>
          <Button onClick={openQnaModal}>
            <MailOpen /> 자주 묻는 질문
          </Button>
          <div className="flex items-center">
            <div className="relative w-[600px] h-[600px] sm:w-[350px] sm:h-[350px] md:h-[600px] md:w-[600px]">
              {/* 이미지 dark 모드일때거 필요함 */}
              <Image
                src="/support1.png"
                fill
                className="object-contain"
                alt="자주묻는질문"
              />      
            </div>
          </div>
        </div>
      </div>
      {isQnaModalOpen && (
        <Modal isOpen={isQnaModalOpen} onClose={closeQnasModal} title="자주 묻는 질문">
            <FaqContent />
        </Modal>
      )}
    </div>
  );
}

export default Support;
