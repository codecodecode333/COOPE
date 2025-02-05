/*import { v } from "convex/values";

import { mutation, query} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler:async (convexToJson, args) => {
        const identity = await convexToJson.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const document = await convexToJson.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });

        return document;
    }
})*/