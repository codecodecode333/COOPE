"use client"

import { SetStateAction, useState } from "react";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitleChange = (e: { target: { value: SetStateAction<string>; }; }) => setTitle(e.target.value);
  const handleContentChange = (e: { target: { value: SetStateAction<string>; }; }) => setContent(e.target.value);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // 여기서 API 요청을 보내서 새 게시물을 생성하지만 일단 convex랑 연결이니까 손봐야하는 부분
    //습.. 이거 convex랑 어케 연결하지
    // 예: await axios.post('/api/posts', { title, content });
    console.log("Title:", title);
    console.log("Content:", content);
  };

  //dark일때 색깔들이 애매함 이것도 나중에 조정
  return (
    <div>
      <div className="heading text-center font-bold text-2xl m-5">공지사항</div>
      <style jsx>{`
        body { background: white !important; }
      `}</style>
      <div className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
        <input
          className="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
          spellCheck="false"
          placeholder="제목"
          type="text"
          value={title}
          onChange={handleTitleChange}
        />
        <textarea
          className="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none"
          spellCheck="false"
          placeholder="내용을 입력하세요."
          value={content}
          onChange={handleContentChange}
        ></textarea>
        
        {/* icons */}
        <div className="icons flex text-gray-500 m-2">
          <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <div className="count ml-auto text-gray-400 text-xs font-semibold">0/300</div>
        </div>

        {/* buttons */}
        <div className="buttons flex">
          <button className="btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer text-gray-500 ml-auto rounded-md">취소</button>
          <button className="btn border  p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-black rounded-md" onClick={handleSubmit}>게시</button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;




/*const NoticeWrite = () => {
    return ( 
        <div className="min-h-full flex flex-col">
         <div className="flex flex-col items-center justify-center
              md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
            <h1 className="text-4xl font-bold">공지사항 쓰기</h1>
            <form action="/api/post/new" method="POST">
                제목 <input type="text" name="title"  />
                내용 <input type="text" name="content" />
                    <button type="submit" className="bg-black text-white font-bold py-2 px-4 rounded right-0">입력</button>
            </form>
         </div>
        </div>

    );
}
export default NoticeWrite; */