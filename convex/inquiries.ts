import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: { userId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if(!args.userId){
            return [];
        }
        else{
        return await ctx.db.query("inquiryDetails").filter((q)=> q.eq(q.field("userId"), args.userId)).collect()};
    }
});

export const createInquiry = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        userId: v.string(),
        userName: v.string(),
        files: v.array(v.object({
          storageId: v.id("_storage"),
          fileName: v.string(),
          fileFormat: v.string(),
        })),
      },
    handler: async (ctx, args) => {
        const { title, content, userId, userName } = args;
        const inquiry = await ctx.db.insert("inquiryDetails", {title, content, userId, userName});

        for (const file of args.files) {
            await ctx.db.insert("inquiryFiles", {
                postId: inquiry,
                file: file.storageId,
                fileFormat: file.fileFormat,
                fileName: file.fileName
            })
        }
        
        return inquiry;
    }
})