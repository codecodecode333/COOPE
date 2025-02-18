import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addComment = mutation({
  args:{ 
    content: v.string(),
    author: v.string(),
    authorId: v.string(),
    postId: v.string(),
    authorImgUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.insert("comments",{ content: args.content, author: args.author, postId: args.postId, authorImgUrl: args.authorImgUrl, authorId: args.authorId});
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
});

export const deleteComment = mutation({
  args: {commentId: v.id("comments") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.commentId);
  }
});

export const editComment = mutation({
  args: {id: v.id("comments"), content: v.string()},
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.patch(id, {content: args.content})
  }
});