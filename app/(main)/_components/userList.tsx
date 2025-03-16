import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { Avatar } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";


const UserList = ({userId}: {userId: string}) => {
    const userList = useQuery(api.users.getUser, {id: userId});
    const { user } = useUser();

    console.log(userId);
    if(!user){
        return null;
    }
    if(!userList) {
        
        return <span>없어요</span>;
    }

    return (
        <div>
          {userList === undefined ? (
                <span className="font-medium">로딩 중...</span> // 데이터가 로딩 중일 때 표시
              ) : !userList ? (
                <span className="font-medium">그런 유저는 존재하지 않아요</span> // 유저가 없는 경우 표시
              ) : userList.externalId === user.id ?
              <span>본인은 친구로 추가할 수 없어요</span>
              :(
                <div className="userList-box">
                  <Avatar>
                    <AvatarImage src={userList.userIcon} alt="프로필이미지" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{userList.name}</span>
                  <span className="font-medium">{userList.email}</span>
                  <Button className="add-button">추가</Button>
                </div>
              )}
        </div>

     );
}
 
export default UserList;