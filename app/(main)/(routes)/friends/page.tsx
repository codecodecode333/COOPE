"use client"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const ListOfFriends = () => {
    const addFriend = () => {
        <div>머임</div>
    }
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

export default ListOfFriends;