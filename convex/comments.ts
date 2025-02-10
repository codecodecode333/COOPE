import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addComment = mutation({
  args:{ 
    content: v.string(),
    author: v.string(),
    postId: v.string(),
    authorImgUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.insert("comments",{ content: args.content, author: args.author, postId: args.postId, authorImgUrl: args.authorImgUrl});
    return comment;
  },
});

export const listComments = query({
  args:{
    id: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("comments").filter((q)=> q.eq(q.field("postId"), args.id)).order("desc").collect();
  }
})