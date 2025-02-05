
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const createEmptyNotice = mutation({
  args: {},
  handler: async (ctx) => {
    const id = await ctx.db.insert("notices", {
        author:"테스트1",
        content: "테스트 내용입니다.",
        title:"테스트 게시물1"
    });
    return id;
  },
});

//글쓰기로 notice 작성 후 게시 눌렀을 때때
export const createNotice = mutation({
  args:{ title: v.string(), content: v.string(), file: v.optional(v.string()), author: v.string()},
  handler: async (ctx, args) => {
    const { title, content, author, file } = args;
    const notice = await ctx.db.insert("notices",{ title, content, author, file});
    return notice;
  },
});

//notices 테이블 불러옴
export const get = query(async (ctx) => {
    return await ctx.db.query("notices").collect();
});

//_id 값으로 게시글 가져옴
export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("notices",args.id);
    if ( id === null ) {
      return null;
    }
    return await ctx.db.get(id);
  },
});


