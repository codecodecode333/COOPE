import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const createEmptyNotice = mutation({
  args: {},
  handler: async (ctx) => {
    const id = await ctx.db.insert("notices", {
        author:"테스트1",
        content: "테스트 내용입니다.",
        id: "1",
        title:"테스트 게시물1"
    });
    return id;
  },
});

export const get = query(async (ctx) => {
    return await ctx.db.query("notices").collect();
});

export const getById = query({
  args: { id: v.string() }, // Validator 사용
  handler: async (ctx, { id }) => {
    const notice = await ctx.db.query("notices").filter(q => q.eq(q.field("id"), id)).first();
    return notice;
  },
});
