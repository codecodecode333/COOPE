import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
    args: {
        id: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("friends").filter((q) => q.eq(q.field("userId"), args.id)).collect();
    }
});