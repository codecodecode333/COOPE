"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";



const InquiryWrite = () => {
    const [title, setTitle] = useState("");
    const router = useRouter();
    const [content, setContent] = useState("");

    const redirectCS = () => {
        router.push('/customerService');
      };
    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
    }

    const handleContnetChange = (e: any) => {
        setContent(e.target.value);
    }
    return (
         <div>
              <div className="heading text-center font-bold text-2xl m-5">문의</div>
              <form className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl rounded-lg">
                <input
                  className="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
                  placeholder="제목"
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
                <textarea
                  className="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none resize-none"
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
                    multiple
                    className="hidden"
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