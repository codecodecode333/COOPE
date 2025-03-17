import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import AddFriend from "./addFriend";
import FriendRequestList from "./friendRequestList";

const FriendPage = () => {
    const { user } = useUser();
    if (!user) {
        return;
    }

    const friendsList = useQuery(api.friends.getFriendsList, { id: user?.id });
    return (
        <div className="h-full">
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] rounded-lg border md:min-w-[450px]"
            >
                <ResizablePanel defaultSize={25}>
                    {/*<Avatar className="ml-auto">
                        <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>*/}
                    <div className="h-full p-5 relative">
                        <div className="flex items-center">
                            <div className="font-semibold">친구 목록</div>
                            <div className="ml-auto">
                            <FriendRequestList />
                            </div>
                        </div>
                        <div>
                            {friendsList?.length === 0 ?
                                <div className="justify-center items-center h-full">
                                    <div>아직 허용해준 친구가 없어요</div>
                                </div>
                                :
                                <div>
                                    
                                </div>}
                        </div>
                        <div className="absolute bottom-5 right-2">
                            <div className="flex items-center">
                                <div className="mr-2 font-medium">새로운 친구를 추가하고 싶나요?</div>
                                <AddFriend />
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Content</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default FriendPage;