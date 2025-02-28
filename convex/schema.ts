import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notices: defineTable({
    title: v.string(),
    content: v.string(),
    file: v.optional(v.id("_storage")),
    fileFormat: v.optional(v.string()),
    fileName: v.optional(v.string()),
    author: v.string(),
    authorId: v.string()
  }),
  comments: defineTable({
    content: v.string(),
    author: v.string(),
    authorId: v.string(),
    postId: v.string(),
    authorImgUrl: v.string(),
  }),
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
  .index("by_user", ["userId"])
  .index("by_user_parent", ["userId","parentDocument"]),
  inquiryDetails: defineTable({
    userId: v.string(),
    userName: v.string(), 
    title: v.string(),
    content: v.string(),
    category: v.string(),
    environment: v.string(),
    responseStatus: v.optional(v.boolean()),
    userEmail: v.string(),
  }),
  inquiryFiles: defineTable({
    postId: v.id("inquiryDetails"),
    file: v.id("_storage"),
    fileName: v.string()
  }),
  inquiryAnswer: defineTable ({
    answer: v.string(),
    postId: v.string(),
    authorId: v.string()
  }),
  inquiryAnswerFiles: defineTable({
    postId: v.id("inquiryDetails"),
    answerId: v.id("inquiryAnswer"),
    file: v.id("_storage"),
    fileName: v.string()
  })
});
