"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const formatDate = (timeStamp: string | number | Date) => {
    const date = new Date(timeStamp);
    const formatter = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    return formatter.format(date);
}

const Notice = () => {
    // notices 테이블에서 데이터 가져옴.
    const notices = useQuery(api.notices.get);
    
    if (notices !== undefined) { // notices가 존재할때만
        // 최신순으로 정렬 -> 없으면 오래된 게시글이 위로 올라감
        notices.sort((a, b) => new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime());
    }
    
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex w-full flex-col items-center
              md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-4xl font-bold">공지사항</h1>

                <div className="w-10/12 rounded">

                    {notices === undefined ? (
                        <p>로딩 중...</p>
                    ) : notices.length === 0 ? (
                        <p>공지사항이 없습니다.</p>
                    ) : (
                        <Table className="w-full">
                            <TableCaption>글쓰기는 관리자의 권한입니다. 권한이 없는 사용자가 누를 시 메인페이지로 돌아갑니다</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">번호</TableHead>
                                    <TableHead>제목</TableHead>
                                    <TableHead>작성자</TableHead>
                                    <TableHead className="text-right">날짜</TableHead>
                                </TableRow>
                            </TableHeader>
                            {notices.map((notice, index) => (
                            <TableBody key={notice._id}>
                                <TableRow>
                                    <TableCell className="font-medium text-left">{index + 1}</TableCell>
                                    <TableCell className="text-left">{notice.title}</TableCell>
                                    <TableCell className="text-left">{notice.author}</TableCell>
                                    <TableCell className="text-right">{formatDate(notice._creationTime)}</TableCell>
                                </TableRow>
                            </TableBody>))}
                        </Table>
                    )}
                </div>

                <div className="flex justify-end w-10/12">
                    {/* /admin 진입시 계정의 role이 admin이 아니면 홈화면으로 돌아가고, admin일 시 글쓰기 페이지로 진입 */}
                    <Link href="/admin">
                        <Button className="">
                            글쓰기
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Notice;



/* 

-Table 사용전 게시판 목록 보여줄 때 사용한 것
<ul className="space-y-4">
                            {notices.map((notice) => (
                                <li key={notice._id} className="border p-4 rounded">
                                    <h2 className="text-xl font-semibold">{notice.title}</h2>
                                    <p className="text-gray-600">{formatDate(notice._creationTime)}</p>
                                    <p className="text-gray-600">{notice.author} 작성</p>
                                </li>
                            ))}
                        </ul>

*/

//리스트 출력하기 전 코드 예비용

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


