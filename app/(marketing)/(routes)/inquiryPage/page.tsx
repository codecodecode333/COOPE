"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";



const InquiryPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const inquiryId = searchParams.get("inquiryId");
    const { user } = useUser();
    const deleteInquiry = useMutation(api.inquiries.deleteInquiry);

    if (!inquiryId) {
        return <p>문의 사항 ID가 유효하지 않습니다.</p>
    }
    const inquiry = useQuery(api.inquiries.getInquiry, { id: inquiryId });

    
    if (inquiry === undefined) {
        return <p>로딩중 ..</p>;
    }

    if (!inquiry) {
        return <p>문의 사항이 존재하지 않습니다.</p>;
    }
    if(user?.id !== inquiry?.userId){
        return <p>타인이 작성한 문의는 볼 수 없습니다.</p>
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();
        try {
            await deleteInquiry({
                inquiryId: inquiry._id
            });
            router.push("/customerService");
        } catch (error) {
            console.log("에러..임");
        }
    }

    return (
        <div className="mx-12 min-h-full flex justify-center py-10">
            <div className="h-full w-1/2">
                <h1 className="text-4xl font-bold mb-6">{inquiry?.title}</h1>
                <span className="text-xl">작성자</span>
                <h2 className="text-xl font-normal mb-2">{inquiry.userName}</h2>
                <span className="text-xl">문의 유형 및 환경</span>
                <h2 className="text-xl font-normal mb-2">{inquiry.category}, {inquiry.environment}</h2>
                <span className="text-xl">작성 일시</span>
                <h2 className="text-xl font-normal mb-2 ">
                    {new Intl.DateTimeFormat('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    }).format(new Date(inquiry?._creationTime))}
                </h2>
                <span className="text-xl">내용</span>
                <div className=" text-lg leading-relaxed font-medium mb-2">
                    {inquiry?.content}
                </div>
                <div className="grid-col-3">
                {inquiry.files && inquiry.files.map((file) =>
                    <div key={file._id}>
                        <h1 className="font-medium">{file.fileName}</h1>
                        {file.url && <Image loading="lazy" src={file.url} alt="첨부 이미지" width={500} height={500} />}
                    </div>

                )}
                </div>
                {/* 작성자의 아이디와 현재 접속된 유저의 아이디가 같을 때만 나타나는 버튼*/}
                {(inquiry.userId === user?.id) &&
                    <div className="text-right my-2">
                        {/* <Link key={inquiry._id}
                            href={{
                                pathname: '/inquiryEditPage',
                                query: { inquiry: JSON.stringify(inquiry) },
                        }} */}
                        <Link key={inquiry._id}
                            href={{
                                pathname: '/inquiryEditPage',
                                query: { inquiryId: inquiry?._id },
                            }}
                        ><Button variant="outline" className="mr-2">수정</Button></Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button>삭제</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>문의를 삭제하시겠습니까?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        삭제된 문의는 복구되지 않습니다. 신중하게 생각하고 삭제해주세요.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>취소</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                }
            </div>
        </div>
    );
}

export default InquiryPage;