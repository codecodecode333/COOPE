"use client"

import React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/*
    Next Js 13v 이후부터는 useRouter등의 기능을 next/routes가 아니라 next/navigation에서 가져와야한다.. 이걸 몰라서 고생했다
    UI 수정 필요
*/
const NoticePage = () => {
    const searchParams = useSearchParams();
    const noticeId = searchParams.get("noticeId"); // 공지사항 ID로 데이터를 가져옴

    if(!noticeId) { //null 체크, 없어도 사이트 자체는 돌아가지만 IDE에서는 계속 오류라고 표시됨
        return <p>공지사항 ID가 유효하지 않습니다.</p>
    }
    const notice = useQuery(api.notices.getById, { id: noticeId });

    if (notice === undefined) {
        return <p>로딩 중...</p>;
    }

    if (!notice) {
        return <p>해당 공지사항을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="min-h-full flex flex-col items-center justify-center px-6 py-10">
            <h1 className="text-4xl font-bold mb-6">{notice.title}</h1>
            <p className="text-gray-700 text-lg mb-4">작성자: {notice.author}</p>
            <p className="text-gray-700 text-lg mb-4">
                날짜: {new Intl.DateTimeFormat('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }).format(new Date(notice._creationTime))}
            </p>
            <div className="text-gray-700 text-lg leading-relaxed">
                {notice.content}
            </div>
        </div>
    )
};

export default NoticePage;
