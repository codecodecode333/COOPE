"use client"

import { useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
/* 
  글쓰기 UI 좀 더 고민해보기
*/


const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useUser();
  const [open, setOpen] = useState(false); //emoji picker 
  const createNotice = useMutation(api.notices.createNotice);
  const router = useRouter(); //route 사용용

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!user){
      alert('로그인이 필요합니다.');
      return;
    }
    if(!user.fullName){
      alert('유저가 존재하지 않습니다.')
      return;
    } //user.fullName이 null인 경우를 처리해 주지 않으면 오류남


    try {
      await createNotice({
        title,
        content,
        author: user.fullName,
      });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('공지사항 작성 중 오류 발생:', error);
      alert("공지사항 작성에 실패했습니다.");
    }
  }

  const handleEmojiPicker = () => {
    setOpen(!open);
  }
  
  //취소 클릭시 공지사항 페이지로 돌아갈 수 있도록
  const redirectNotices =  () => {
    router.push('/notice');
  };


  /*const [errors, setErrors] = useState({
    title: "",
    content: "",
  });*/



  

  return (
    <div>
      <div className="heading text-center font-bold text-2xl m-5">공지사항</div>
      <form onSubmit={handleSubmit} className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl rounded-lg">
        <input
          className="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
          placeholder="제목"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none"
          placeholder="내용을 입력하세요."
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        
        {/* icons */}
        <div className="icons flex text-gray-500 m-2">
          <svg onClick={handleEmojiPicker} className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />         
          </svg>
          <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        <div className="count ml-auto text-gray-400 text-xs font-semibold">0/300</div>
            
        </div>
        <EmojiPicker open={open}/>


        {/* buttons */}
        <div className="buttons flex">
          <Button variant="secondary" className="btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer ml-auto rounded-md" onClick={redirectNotices}>취소</Button>
          <Button type="submit" className="btn border  p-1 px-4 font-semibold cursor-pointer rounded-md">게시</Button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;