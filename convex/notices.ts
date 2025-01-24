import { mutation, query } from "./_generated/server";

export const createEmptyNotice = mutation({
  args: {},
  handler: async (ctx) => {
    const id = await ctx.db.insert("notices", {
        author:"테스트1",
        content: "테스트 내용입니다.",
        created_at: Date.now(),
        id: "1",
        title:"테스트 게시물1"
    });
    return id;
  },
});

export const getNotices = query(async (ctx) => {
    return await ctx.db.query("notices").collect();
});