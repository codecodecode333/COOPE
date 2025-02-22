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
        userName: v.string()
    },
    handler: async (ctx, args) => {
        const { title, content, userId, userName } = args;
        const inquiry = await ctx.db.insert("inquiryDetails", {title, content, userId, userName});
        return inquiry;
    }
})