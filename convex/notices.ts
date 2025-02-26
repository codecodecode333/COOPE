
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";



//글쓰기로 notice 작성 후 게시 눌렀을 때
export const createNotice = mutation({
  args:{ title: v.string(),
  content: v.string(),
  storageId: v.optional(v.id("_storage")),
  author: v.string(),
  fileFormat: v.optional(v.string()),
  fileName: v.optional(v.string()),
  authorId: v.string(),},
  
  handler: async (ctx, args) => {
    const { title, content, author, storageId, fileFormat, fileName, authorId } = args;
    const notice = await ctx.db.insert("notices",{ title, content, author, file: storageId, fileFormat, fileName, authorId});
    return notice;
  },
});

//notices 테이블 불러옴
export const get = query(async (ctx) => {
    return await ctx.db.query("notices").collect();
});

export const getNoticeForComments = query({
  args: {id: v.id("notices")},
  handler: async (ctx, args) => {
    const id = ctx.db.get(args.id);
    if (!id) {
      return null;
    }
    return id;
  }
})

//게시글을 불러오기 위한 쿼리문
export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("notices", args.id);
    if (id === null) {
      return null;
    }
    const notice = await ctx.db.get(id);
    if (!notice) {
      return null;
    }
    
    let fileUrl = null;
    if (notice.file) {
      fileUrl = await ctx.storage.getUrl(notice.file);
    }
    
    return { ...notice, fileUrl };
  },
});

//file 가져오기
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
})

//notice 삭제 && 달려있는 댓글도 같이 삭제
export const deleteNotice = mutation({
  args: {noticeId: v.string()},
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("notices", args.noticeId);
    if(!id) {
      return null;
    }
    await ctx.db.delete(id);

    const comments = await ctx.db.query("comments").filter((q)=> q.eq(q.field("postId"), args.noticeId)).collect();

    for(const comment of comments) {
      await ctx.db.delete(comment._id);
    }
  }
})

