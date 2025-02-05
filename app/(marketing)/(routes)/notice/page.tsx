"use client";

import React, { useState } from "react";
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
} from "@/components/ui/table";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";

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
};

const Notice = () => {
    // notices 테이블에서 데이터 가져옴.
    const notices = useQuery(api.notices.get);
    const [currentPage, setCurrentPage] = useState<number>(1); //현재 페이지 1로 초기화
    const noticesPerPage = 10; //페이지당 표시될 공지사항의 개수 

    /* 페이지네이션을 위해 데이터 슬라이스, notices의 (currentPage - 1) * noticesPerPage 부터 currentPage * noticesPerPage 까지 추출 
        페이지1 (currentPage = 1)
        - 시작 인덱스: (1-1) * 10 = 0
        - 끝 인덱스: 1 * 10 = 10
        notices.slice(0, 10) => notices 배열의 index 0 ~ 9 까지 슬라이스 됨

        페이지2 (currentPage = 2)
        - 시작 인덱스: (2-1) * 10 = 10
        - 끝 인덱스: 2 * 10 = 20
        notices.slice(10, 20) => notices 배열의 index 10 ~ 19 까지 슬라이스
    */
    const paginatedNotices = notices ? notices.slice((currentPage - 1) * noticesPerPage, currentPage * noticesPerPage) : [];

    // 페이지 수 계산, Math.ceil: 소수점 이하를 올림함
    const pageCount = notices ? Math.ceil(notices.length / noticesPerPage) : 1;

    // 최신순으로 정렬
    if (notices !== undefined) {
        notices.sort((a, b) => new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime());
    }

    /* 
     SetStateAction에 대한 설명은 찾아보면 많이 나오지만, 여기서 pageNumber: React.SetStateAction<Number>를 사용한 이유는 
     pageNumber를를 prop을 단순히 pageNumber: number로 타입을 지정하면 함수로 상태를 업데이트할 수 없음. 오직 숫자로만 가능
     setStateAction을 통해 타입을 지정하면 숫자, 함수를 통해 상태를 업데이트 할 수 있음
     handlePageChange(Math.max(currentPage - 1, 1))처럼 함수를 값으로 받아오기 위해 이런 타입지정이 필요함
    */

    const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-h-full flex flex-col">
            <div className="flex w-full flex-col items-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-4xl font-bold">공지사항</h1>

                <div className="w-10/12 rounded">
                    {notices === undefined ? (
                        <p>로딩 중...</p>
                    ) : notices.length === 0 ? (
                        <p>공지사항이 없습니다.</p>
                    ) : (
                        <>
                            <Table className="w-full">
                                <TableCaption>글쓰기는 관리자의 권한입니다. 권한 없는 사용자가 누를 시 메인페이지로 돌아갑니다</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">번호</TableHead>
                                        <TableHead>제목</TableHead>
                                        <TableHead>작성자</TableHead>
                                        <TableHead className="text-right">날짜</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {paginatedNotices.map((notice, index) => (
                                    <TableBody key={notice._id}>
                                        <TableRow>
                                            <TableCell className="font-medium text-left">{notices.length - (currentPage - 1) * noticesPerPage - index}</TableCell>
                                            <TableCell className="text-left">
                                                <Link className="cursor-pointer" href={{
                                                    pathname: "/noticePage",
                                                    query: { noticeId: notice._id },
                                                }}>{notice.title}</Link>
                                            </TableCell>
                                            <TableCell className="text-left">{notice.author}</TableCell>
                                            <TableCell className="text-right">{formatDate(notice._creationTime)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                ))}
                            </Table>

                            <Pagination className="flex justify-center mt-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} />
                                    </PaginationItem>
                                    {Array.from({ length: pageCount }, (_, index) => (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                href="#"
                                                isActive={currentPage === index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    {currentPage < pageCount - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                                    <PaginationItem>
                                        <PaginationNext href="#" onClick={() => handlePageChange(Math.min(currentPage + 1, pageCount))} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </>
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
    );
};

export default Notice;
