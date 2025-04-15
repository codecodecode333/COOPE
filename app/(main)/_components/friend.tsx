import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import AddFriend from "./addFriend";
import FriendRequestList from "./friendRequestList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { FunctionReturnType } from "convex/server";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GenericId } from "convex/values";
import { Phone, Plus, X } from "lucide-react";
import CallModal from "./callModal";

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

const FriendPage = () => {
    const { user } = useUser();

    if (!user) {
        return;
    }
    console.log(convexSiteUrl);

    const friendsList = useQuery(api.friends.getFriendsList, { id: user?.id });
    const [messageInput, setMessageInput] = useState("");
    type FriendsListType = FunctionReturnType<typeof api.friends.getFriendsList>; // getFriendList를 통해 받아오는 return 값을 type으로 가지게 함
    type FriendType = FriendsListType[number]; // 친구 목록의 단일 타입을 얻기 위해서 필요
    const [selectedFriend, setSelectedFriend] = useState<FriendType & { roomId: string } | null>(null);
    const createOrGetChatRoom = useMutation(api.rooms.createOrGetChatRoom);
    const sendMessage = useMutation(api.chat.sendMessage);
    //useQuery 훅을 사용할 때 "skip"을 인자로 전달하면 쿼리가 실행되지 않음. 즉, 조건부로 쿼리를 실행하고 싶을 때 사용할 수 있는 특별한 값~
    const messages = useQuery(api.chat.getMessages, selectedFriend ? { roomId: selectedFriend.roomId } : "skip");
    const fileInput = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const chatScrollRef = useRef(null); //채팅을 맨 아래를 항상 비추도록 하기 위한 것
    const bottomRef = useRef<HTMLDivElement | null>(null); //채팅을 맨 아래를 항상 비추도록 하기 위한 것22
    const [isModalOpen, setIsModalOpen] = useState(false);//전화 모달

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "auto" });
        }
    })
    const handleMessageInput = (e: any) => {
        setMessageInput(e.target.value);
    }

    const handleFrinedClick = async (friend: { friendName: string | undefined; friendEmail: string | undefined; friendIcon: string | undefined; _id: GenericId<"friends">; _creationTime: number; userId: string; friendId: string; status: string; }) => {
        try {
            const chatRoom = await createOrGetChatRoom({ user1Id: user.id, user2Id: friend.friendId });

            if ('roomId' in chatRoom) {
                setSelectedFriend({
                    ...friend,
                    roomId: chatRoom.roomId
                })
            } else {
                console.log('채팅방의 번호가 없습니다.')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedFriend?.roomId) return;


        if (selectedFile) {
            const sendFileUrl = new URL(`${convexSiteUrl}/sendFile`);
            sendFileUrl.searchParams.set("author", user.id);
            sendFileUrl.searchParams.set("text", messageInput);
            sendFileUrl.searchParams.set("roomId", selectedFriend.roomId);
            sendFileUrl.searchParams.set("format", selectedFile.type);
            sendFileUrl.searchParams.set("fileName", selectedFile.name);

            try {
                const response = await fetch(sendFileUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedFile.type },
                    body: selectedFile,
                });

                if (!response.ok) {
                    console.log('오류난건가')
                }
            } catch (error) {
                console.log("파일 업로드에 에러가 발생했습니다:", error);
                throw error;
            }

        } else {
            await sendMessage({
                roomId: selectedFriend.roomId, // 채팅방 Id
                senderId: user.id, // 보낸사람 ID
                text: messageInput,
            })
        }

        setMessageInput("");
        setSelectedFile(null);
    };

    const redirectToCall = () => {
        setIsModalOpen(true); // 모달 열림
    };
    
      const closeModal = () => {
        setIsModalOpen(false); // 모달 닫힘
    };
    

    return (
        <div className="h-full">
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] rounded-lg border md:min-w-[450px]"
            >
                <ResizablePanel defaultSize={25}>
                    <div className="h-full p-5 relative">
                        <div className="flex items-center">
                            <div className="font-semibold">친구 목록</div>
                            <div className="ml-auto">
                                <FriendRequestList />
                            </div>
                        </div>
                        <div>
                            {friendsList?.length === 0 ? (
                                <div className="justify-center items-center h-full" >
                                    <div>아직 허용해준 친구가 없어요</div>
                                </div>
                            ) : (
                                <div>
                                    <ScrollArea className="h-full w-full rounded-md">
                                        <div className="p-4">
                                            {friendsList?.map((friend) => (
                                                <div key={friend._id}>
                                                    <div className="font-medium flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                                                        onClick={() => handleFrinedClick(friend)}>
                                                        <div>
                                                            <div>{friend.friendName}</div>
                                                            <div className="text-sm text-gray-600">{friend.friendEmail}</div>
                                                        </div>

                                                        <Avatar className="ml-auto">
                                                            <AvatarImage src={friend.friendIcon} alt="프로필이미지" />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                    <Separator className="my-2" />
                                                </div>
                                            ))}

                                        </div>
                                    </ScrollArea>
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-5 right-2">
                            <div className="flex items-end">
                                <div className="mr-2 font-medium">새로운 친구를 추가하고 싶나요?</div>
                                <AddFriend />
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                    <div className="flex h-full p-6">
                        {selectedFriend ?
                            <div className="h-full w-full relative">
                                <div className="flex">
                                    <div className="w-full">
                                        <h2 className="text-xl font-bold">{selectedFriend.friendName}</h2>
                                        <p className="text-gray-600">{selectedFriend.friendEmail}</p>
                                    </div>
                                    <Button variant="outline" className="right-auto rounded-full" onClick={redirectToCall}>
                                        <Phone/>
                                    </Button>
                                    <CallModal isOpen={isModalOpen} onClose={closeModal} roomId={selectedFriend.roomId} />
                                </div>
                                {/* 메시지가 입력창 위까지만 보이도록 `calc`를 사용 */}
                                <ScrollArea className="h-[calc(100%-8rem)]" ref={chatScrollRef}>
                                    <div>
                                        {messages &&
                                            messages.map((message, index) => {
                                                const isSameSenderAsPrevious =
                                                    index > 0 && messages[index - 1].senderId === message.senderId;
                                                return (
                                                    <article
                                                        key={message._id}
                                                        className={
                                                            message.senderId === user.id
                                                                ? "message-mine shadow-lg w-fit ml-auto rounded-lg my-3"
                                                                : "shadow-lg w-fit rounded-lg my-3"
                                                        }
                                                    >
                                                        {/* 같은 sender가 연속될 경우, 프로필 및 닉네임 생략 */}
                                                        {!isSameSenderAsPrevious && message.senderId !== user.id && (
                                                            <div>
                                                                <Avatar className="border ml-2">
                                                                    <AvatarImage
                                                                        src={selectedFriend.friendIcon}
                                                                        alt="프로필이미지"
                                                                    />
                                                                    <AvatarFallback>CN</AvatarFallback>
                                                                </Avatar>
                                                                <div className="mx-3">{selectedFriend.friendName}</div>
                                                            </div>
                                                        )}

                                                        {/* '나'의 메시지일 경우, 첫 메시지에만 표시 */}
                                                        {!isSameSenderAsPrevious && message.senderId === user.id && (
                                                            <div>나</div>
                                                        )}

                                                        {/* 메시지 내용 */}
                                                        {message.file && (
                                                            <div className="mx-3 mt-2">
                                                                {message.format && message.format.startsWith("image/") ? (
                                                                    <Image
                                                                        src={`${convexSiteUrl}/getFile?storageId=${message.file}`}
                                                                        width={200}
                                                                        height={200}
                                                                        alt={message.fileName || "이미지"}
                                                                        className="rounded-md"
                                                                    />
                                                                ) : (
                                                                    <a
                                                                        href={`${convexSiteUrl}/getFile?storageId=${message.file}&fileName=${encodeURIComponent(
                                                                            message.fileName || "file"
                                                                        )}`}
                                                                        download={message.fileName}
                                                                        className="flex items-center p-2 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className="mr-2"
                                                                        >
                                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                            <polyline points="7 10 12 15 17 10"></polyline>
                                                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                                                        </svg>
                                                                        {message.fileName || "파일 다운로드"}
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="font-normal mx-3">{message.text}</div>
                                                        <div className="font-extralight mx-3 pb-3">
                                                            {new Intl.DateTimeFormat("ko-KR", {
                                                                year: "numeric",
                                                                month: "2-digit",
                                                                day: "2-digit",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit",
                                                                hour12: true,
                                                            }).format(new Date(message._creationTime))}
                                                        </div>
                                                    </article>
                                                );
                                            })}

                                        <div ref={bottomRef} />
                                    </div>
                                </ScrollArea>
                                {/* 고정된 입력창 */}
                                <div className="absolute w-full bottom-0 rounded-lg">
                                    {selectedFile && <div className="opacity-60 py-5 flex">{selectedFile.name} <X /></div>}
                                    <div className="flex">
                                        <input
                                            type="file"
                                            ref={fileInput}
                                            accept="image/*, .hwp, .hwpx, .pdf, .docx, .ppt, .pptx,"
                                            className="hidden"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            id="fileInput"
                                        />
                                        <label htmlFor="fileInput" className="cursor-pointer self-center rounded-full mr-2 hover:bg-slate-200">
                                            <Plus />
                                        </label>
                                        <Textarea
                                            placeholder="메세지를 입력해주세요"
                                            className="resize-none mr-2 font-medium"
                                            value={messageInput}
                                            maxLength={1000}
                                            onChange={handleMessageInput}
                                        />
                                        <Button className="h-auto" onClick={handleSendMessage}>
                                            전송
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="flex h-full w-full items-center justify-center">
                                <div>
                                    <Image
                                        src="/chat.png"
                                        height={500}
                                        width={500}
                                        alt="채팅"
                                    />
                                    <div className="text-center text-lg font-medium">친구와 자유롭게 대화를 나눠보세요</div>
                                </div>
                            </div>}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default FriendPage;
