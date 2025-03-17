import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { Avatar } from "@/components/ui/avatar";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";


const UserList = ({ userId }: { userId: string }) => {
  const userList = useQuery(api.users.getUser, { id: userId });
  const { user } = useUser();

  const sendFriendRequest = useMutation(api.friends.sendFriendRequest);

  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  if (!user) {
    return null;
  }

  if (!userList) {

    return <span>그런 유저는 없어요 :/</span>;
  }
  const hadleAddFriend = async () => {
    
    if (!user.username) {
      return null;
    }
    const response = await sendFriendRequest({
      userId: user.id,
      friendId: userList.externalId,
      name: user.username,
      friendName: userList.name, // 친구 이름
      email: user.emailAddresses[0].emailAddress,
      friendEmail: userList.email, // 친구 이메일
      friendIcon: userList.userIcon,
      userIcon: user.imageUrl
    });

    if (!response.success && response.message) {
      // 에러 메시지를 설정하고 표시
      setErrorMessage(response.message);
      setShowError(true);
    } else {
      // 성공 시 에러를 숨기기
      setShowError(false);
    }
  };


  return (
    <div>
      {userList === undefined ? (
        <span className="font-medium">로딩 중...</span> // 데이터가 로딩 중일 때 표시
      ) : !userList ? (
        <span className="font-medium">그런 유저는 존재하지 않아요</span> // 유저가 없는 경우 표시
      ) : userList.externalId === user.id ?
        <span>본인은 친구로 추가할 수 없어요</span>
        : (
          <div >
            <div className="userList-box">
              <Avatar>
                <AvatarImage src={userList.userIcon} alt="프로필이미지" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="font-medium">{userList.name}</span>
              <span className="font-medium">{userList.email}</span>
              <Button type="button" onClick={hadleAddFriend} className="add-button px-3"><UserRoundPlus /></Button>
            </div>
            {showError && <div className="font-medium">{errorMessage}</div>}
          </div>

        )}
    </div>

  );
}

export default UserList;