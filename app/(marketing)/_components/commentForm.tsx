import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export const CommentFrom = ({notice}: {notice: string}) => {
    const [content, setContent] = useState('');
    const { user } = useUser();
    const addComment = useMutation(api.comments.addComment);
    const inputComment = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    }
    const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }
        if(!user.username){
            alert('유저가 존재하지않습니다');
            return;
        }
        if(!notice) {
            alert('공지사항이 존재하지않습니다.')
            return ;
        }
        try {

            await addComment({
                content,
                author: user?.username,
                postId: notice, 
                authorImgUrl: user?.imageUrl
            });
            setContent('');
        } catch (error) {
            console.log('댓글 작성중 오류발생생')
        }
    }
    return (
        <div className="flex w-full max-w-sm items-center space-x-2">
            <form onSubmit={handleComment} className="flex gap-2" >
                <Input type="text"
                    name="content"
                    value={content}
                    onChange={inputComment}
                    placeholder="댓글을 입력해주세요"
                    required
                />
                <Button type="submit">등록</Button>
            </form>
        </div>
    );
}

