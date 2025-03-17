import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 친구 리스트 출력
export const get = query({
    args: {
        id: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db
        .query("friends")
        .withIndex("by_userId", (q) => q.eq("userId", args.id))
        .collect();
    }
});

// 수락된 친구 목록
export const getFriendsList = query({
    args: {
        id: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db
        .query("friends")
        .withIndex("by_userId", (q) => q.eq("userId", args.id))
        .filter((q) => q.eq(q.field("status"), "수락됨"))
        .collect();
    }
})

// 내가 요청중인 친구 목록
export const getFriendRequest = query({
    args: {
        id: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db
        .query("friends")
        .withIndex("by_userId", (q) => q.eq("userId", args.id))
        .filter((q) => q.eq(q.field("status"), "요청중"))
        .collect();
    }
})

export const getRequest = query({
    args: {
        id: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db
        .query("friends")
        .withIndex("by_friend", (q) => q.eq("friendId", args.id))
        .filter((q) => q.eq(q.field("status"), "요청중"))
        .collect();
    }
})

// 친구 요청
export const sendFriendRequest = mutation({
    args: {
        userId: v.string(),
        friendId: v.string(),
        name: v.string(),
        friendName: v.string(),
        email: v.string(),
        friendIcon: v.string(),
        userIcon: v.string(),
        friendEmail: v.string()
    },
    handler: async (ctx, args) => {
        // 이미 친구 요청이 존재하는지 확인
        const existingRequest = await ctx.db.query("friends")
        .withIndex("by_userId_friendId", (q) =>
            q.eq("userId", args.userId).eq("friendId", args.friendId)
        )
        .unique();


        if (existingRequest) {
            return { success: false, message: "이미 친구 요청이 있습니다." };
            /* 
            더 구조화된 데이터를 전달할 수도 있다고 함
            throw new ConvexError({
                code: "Friend_REQUEST_EXIST",
                message: "이미 친구 요청을 보냈습니다."
            });
            
            */
        }

        await ctx.db.insert("friends",{
            userId: args.userId,
            friendId: args.friendId,
            status: "요청중",
            name: args.name,
            friendName: args.friendName,
            email: args.email,
            friendEmail: args.friendEmail,
            friendIcon: args.friendIcon,
            userIcon: args.userIcon
            
        });

        return { success: true };
    }
});

// 친구 요청 수락
export const acceptFriendRequest = mutation({
    args: {
        userId: v.string(),
        friendId: v.string(),
        name: v.string(),
        friendName: v.string(),
        email: v.string(),
        friendIcon: v.string(),
        userIcon: v.string(),
        friendEmail: v.string()
    },
    handler: async (ctx, args) => {
        const friendRequest = await ctx.db.query("friends")
        .withIndex("by_userId_friendId", (q) =>
            q.eq("userId", args.userId).eq("friendId", args.friendId)
        )
        .unique();

        if(!friendRequest) {
            throw new Error("Friend request not found");
        }

        await ctx.db.patch(friendRequest._id, { status: "수락됨"});

        await ctx.db.insert("friends", {
            userId: args.friendId,
            friendId: args.userId,
            status: "수락됨",
            name: args.friendName,
            friendName: args.name,
            email: args.friendEmail,
            friendEmail: args.email,
            friendIcon: args.userIcon,
            userIcon: args.friendIcon
        })
    }
});