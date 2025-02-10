import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "convex/react";

export const CommentList = ({ notice }: { notice: string }) => {
    const comments = useQuery(api.comments.listComments, { id: notice });
    const user = useUser();
    console.log(user);
    return (
        <div>
            {comments === undefined ? (
                <p>로딩중..</p>
            ) : comments.length === 0 ? (
                <p>댓글이 없습니다.</p>
            ) : (
                <>
                    {comments.map((comment) => (
                        <div key={comment._id} className="comment-box">
                            <Avatar>
                                <AvatarImage src={comment.authorImgUrl} alt="프로필이미지" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="speech-bubble">
                                <div>{comment.author}</div>
                                <div>{comment.content}</div>
                                <div>{new Intl.DateTimeFormat('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                }).format(new Date(comment._creationTime))}</div>
                            </div>
                        </div>

                    ))}
                </>
            )}
        </div>
    );
}

export default CommentList;