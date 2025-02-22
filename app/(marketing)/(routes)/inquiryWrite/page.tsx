"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { generateUploadUrl } from "@/convex/notices";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";



const InquiryWrite = () => {
    const [title, setTitle] = useState("");
    const router = useRouter();
    const [content, setContent] = useState("");
    const { user } = useUser();
    const fileInput = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createInquiry = useMutation(api.inquiries.createInquiry);
    const redirectCS = () => {
        router.push('/customerService');
      };
    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
    }

    const handleContnetChange = (e: any) => {
        setContent(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!user) {
          alert('로그인이 필요합니다.');
          return;
        }
        if (!user.username) {
          alert('유저가 존재하지 않습니다.')
          return;
        } //user.usename이 null인 경우를 처리해 주지 않으면 오류남
    
        /*file storage 기능은 convex 공식문서를 참고, 이 기능이 베타 버전이라 공식 문서와 convex에서 제공하는 ai 밖에 참고할 게 없음
        file 저장방식 http action으로 변경이 필요할 수 있음 => 우선 업로드 url을 통한 방식으로 만들었지만 
        기존 파일 이름 등 유지를 위해 변경이 필요
        */
        try {
          let fileFormat;
          let fileName;
          const uploadPromises = selectedFiles.map(async (file) => {
            const postUrl = await generateUploadUrl();

            const result = await fetch(postUrl, {
              method: "POST",
              headers: { "Content-Type": file.type },
              body: file,
            });
            const { storageId } = await result.json();
            fileFormat = file.type;
            fileName = file.name;
          });
          await createInquiry({
            title,
            content,
            userId: user.id,
            userName: user.username
          });
          setTitle('');
          setContent('');
          setSelectedFiles([]);
          if (fileInput.current) {
            fileInput.current.value = '';
          }
          router.push('/customerService');
        } catch (error) {
          console.error('문의 작성 중 오류 발생:', error);
          alert("문의 작성에 실패했습니다.");
        }
      }
    return (
         <div>
              <div className="heading text-center font-bold text-2xl m-5">문의</div>
              <form onSubmit={handleSubmit} className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl rounded-lg">
                <input
                  className="title  border border-gray-300 p-2 mb-4 outline-none"
                  placeholder="제목"
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
                <textarea
                  className="description  sec p-3 h-60 border border-gray-300 outline-none resize-none"
                  placeholder="문의 내용을 입력하세요."
                  name="content"
                  value={content}
                  onChange={handleContnetChange}
                  required
                  maxLength={500}
                />
        
                {/* icons */}
                <div className="icons flex text-gray-500 m-2">
                  <input
                    type="file"
                    ref={fileInput}
                    multiple
                    className="hidden"
                    onChange={(event) => setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files || [])])}
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer">
                    <svg className="mr-2 hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </label>
                  <div className="count ml-auto text-gray-400 text-xs font-semibold">최대 입력 가능 500자</div>
        
                </div>
        
        
                {/* buttons */}
                <div className="buttons flex">
                  <Button variant="secondary" className="btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer ml-auto rounded-md" onClick={redirectCS}>취소</Button>
                  <Button type="submit" className="btn border  p-1 px-4 font-semibold cursor-pointer rounded-md">게시</Button>
                </div>
              </form>
            </div>
    );
}

export default InquiryWrite;