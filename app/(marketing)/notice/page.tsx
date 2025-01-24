"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

const Notice = () => {
    // notices 테이블에서 데이터 가져옴옴.
    const notices = useQuery(api.notices.getNotices);

    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center
              md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-4xl font-bold">공지사항</h1>
                
                {/* notices 리스트를 표시  dark일때 색깔이 미묘하기 때문에 나중에 살펴보기*/}
                <div className="w-full max-w-2xl dark:bg-slate-500 rounded-lg">
                    
                    {notices === undefined ? (
                        <p>로딩 중...</p>
                    ) : notices.length === 0 ? (
                        <p>공지사항이 없습니다.</p>
                    ) : (
                        <ul className="space-y-4">
                            {notices.map((notice) => (
                                <li key={notice._id} className="border p-4 rounded">
                                    <h2 className="text-xl font-semibold">{notice.title}</h2>
                                    <p className="text-gray-600">{notice.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="">
                    {/*/admin으로 가면 계정의 role이 admin이 아니면 홈화면으로 돌아가고, admin일 시 글쓰기 페이지로 진입 */}
                    <Link href="/admin">
                        <button className="bg-black text-white font-bold py-2 px-4 rounded right-0">
                        글쓰기
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Notice;

//리스트 출력하기 전 코드 예비용으로 남겨둠

/*"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/nextjs";
import { checkRole } from '@/utils/roles'
import Link from "next/link";
const Notice = () => {
    

    return(
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center
              md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-4xl font-bold">공지사항</h1>
                <div className="">
                    <Link href="/admin">
                        <button className="bg-black text-white font-bold py-2 px-4 rounded right-0">
                        글쓰기
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default Notice; */


