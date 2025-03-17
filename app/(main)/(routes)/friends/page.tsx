"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import AddFriend from "../../_components/addFriend"; // 친구 추가 버튼과 기능
import FriendPage from "../../_components/friend"; // 친구(요청중, 수락됨)이 있을 경우의 페이지
import FriendRequestList from "../../_components/friendRequestList";

const ListOfFriends = () => {
  const [searchUser, setSearchUser] = useState("");
  const { user } = useUser();
  if (!user) {
    return;
  }
  const friendList = useQuery(api.friends.get, { id: user?.id });




  console.log(friendList);





  if (friendList === undefined) {
    return (
      <div>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  // 요청한 친구도 없고, 수락된 친구도 없을 경우
  if (friendList?.length === 0) {
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
        <Image
          src="/robot_dark.png"
          height={300}
          width={300}
          alt="empty"
          className="hidden dark:block"
          priority
        />
        <h2 className="text-lg font-medium">
          메세지를 나눌 친구가 없어요. 새로운 친구를 추가해볼까요?
        </h2>
        <div className="flex">
          <AddFriend />
          <div className="ml-2"><FriendRequestList /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <FriendPage />
    </div>
  )

}

export default ListOfFriends;