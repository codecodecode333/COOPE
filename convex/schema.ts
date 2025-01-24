import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notices: defineTable({
    id: v.string(), //공지사항 ID
    title: v.string(),
    content: v.string(),
    author: v.string(),
    created_at: v.number() // 작성 시간 UTC 타임스탬프로 문서 생성시 Date.now()를 사용하여 현재 시간을 저장할 수 있음
  }),
});
