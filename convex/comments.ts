import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addComment = mutation({
  args:{ 
    content: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.insert("comments",{ content: args.content, author: args.author});
    return comment;
  },
});