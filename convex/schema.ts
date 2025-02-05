import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notices: defineTable({
    title: v.string(),
    content: v.string(),
    file: v.optional(v.id("_storage")),
    fileFormat: v.optional(v.string()),
    author: v.string(),
  }),
});
