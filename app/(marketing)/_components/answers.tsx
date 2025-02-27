import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { editComment } from "@/convex/comments";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { comment } from "postcss";
import { FC } from "react";

interface AnswersProp {
    postId: string
}

const AnswerList: FC<AnswersProp> = ({postId}) => {
    const answers = useQuery(api.inquiries.listAnswer, {id: postId});
    const { user } = useUser();
    return (
        <div>
            {answers === undefined ? (
                <p>로딩중..</p>
            ) : answers.length === 0 ? (
                <p>아직 답변이 도착하지않았습니다.</p>
            ) : (
                <>
                    {answers.map((answer) => (
                        <div key={answer._id} className="comment-box">
                            <div className="speech-bubble dark:bg-neutral-900">
                                <div className="font-medium">{answer.answer}</div>
                                <div className="font-medium">{new Intl.DateTimeFormat('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                }).format(new Date(answer._creationTime))}</div>
                                {/*{answer.authorId === user?.id &&
                                    <div className="text-right">
                                        <Button variant="ghost" className="h-3" onClick={(e) => handleEditButtonClick(comment._id, comment.content, e)}>수정</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="h-3">삭제</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>댓글을 삭제하시겠습니까?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        삭제된 댓글은 복구되지 않습니다. 신중하게 생각하고 삭제해주세요.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>취소</AlertDialogCancel>
                                                    <AlertDialogAction onClick={(e) => handleDelete(comment._id, e)}>삭제</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>}*/}
                            </div>

                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
 
export default AnswerList;