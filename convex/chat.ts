import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 메세지 전송
export const sendMessage = mutation({
    args: {
        roomId: v.string(),
        senderId: v.string(),
        text: v.string()
    },
    handler: async (ctx, args) => {
        if (!args.roomId || !args.senderId || !args.text.trim()) {
            throw new Error("유효하지않은 메세지입니다.")
        }

        await ctx.db.insert("messages", {
            roomId: args.roomId,
            senderId: args.senderId,
            text: args.text
        }
        )
    }
});

export const getMessages = query({
    args: {
        roomId: v.string()  // 메시지를 가져올 채팅방 ID
    },
    handler: async (ctx, args) => {
        // 해당 roomId에 속한 모든 메시지를 가져옴 (senderId 필터 제거)
        const messages = await ctx.db.query("messages")
            .filter((q) => q.eq(q.field("roomId"), args.roomId))
            .order("desc")
            .take(50);

        return messages.reverse(); // 오래된 메시지가 위로 오도록 정렬
    }
});
