"use client"
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { PlusCircle, UserSearch } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import UserList from "../../_components/userList";

const ListOfFriends = () => {
  const [searchUser, setSearchUser] = useState("");
  const [clickSearchUser, setClickSearchUser] = useState(false);
  const { user } = useUser();
  const searchedUser = useQuery(api.users.getUser, { id: searchUser });
  if (!user) {
    return;
  }
  const friendList = useQuery(api.friends.get, { id: user?.id });


  console.log(friendList);

  const handleSearchFriend = () => {
    if (!searchUser) {
      return;
    }
    setClickSearchUser(true);
  }

  const searchUserChange = (e: any) => {
    setSearchUser(e.target.value);
  }

  const handleState = () => {
    setClickSearchUser(false);
    setSearchUser("");
  }

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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              친구 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>친구 찾기</DialogTitle>
              <DialogDescription>
                검색을 통해 친구를 찾아볼까요?
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  placeholder="친구의 닉네임을 입력하세요"
                  value={searchUser}
                  onChange={searchUserChange}
                />
              </div>
              <Button type="button" size="sm" className="px-3" onClick={handleSearchFriend} >
                <UserSearch/>
              </Button>
            </div>
            {
              clickSearchUser?
              <UserList userId={searchUser} />: <span className="font-medium">입력된 값이 없습니다.</span>
            }
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={handleState}>
                  닫기
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default ListOfFriends;