"use client"
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const ListOfFriends = () => {
    const { user } = useUser();
    if (!user) {
        return;
    }
    const friendList = useQuery(api.friends.get, {id: user?.id});
    console.log(friendList);
    const addFriend = () => {
        <div>머임</div>
    }

    if (friendList === undefined) {
        return (
          <div>
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
              <div className="space-y-4 pl-8 pt-4">
                <Skeleton className="h-14 w-[50%]"/>
                <Skeleton className="h-14 w-[80%]"/>
                <Skeleton className="h-14 w-[40%]"/>
                <Skeleton className="h-14 w-[60%]"/>
              </div>
            </div>
          </div>
        )
      }

    if(friendList?.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Image
                    src="/robot.png"
                    height={300}
                    width={300}
                    alt="empty"
                    className="dark:hidden"
                    priority
                />
                <h2 className="text-lg font-medium">
                    메세지를 나눌 친구가 없어요. 새로운 친구를 추가해볼까요?
                </h2>
                <Button onClick={addFriend}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    친구 추가
                </Button>
            </div>
        );
    }
}

export default ListOfFriends;