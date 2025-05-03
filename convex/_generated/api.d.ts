/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aiChat from "../aiChat.js";
import type * as chat from "../chat.js";
import type * as client from "../client.js";
import type * as comments from "../comments.js";
import type * as documents from "../documents.js";
import type * as friends from "../friends.js";
import type * as http from "../http.js";
import type * as inquiries from "../inquiries.js";
import type * as notices from "../notices.js";
import type * as rooms from "../rooms.js";
import type * as users from "../users.js";
import type * as workspace from "../workspace.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiChat: typeof aiChat;
  chat: typeof chat;
  client: typeof client;
  comments: typeof comments;
  documents: typeof documents;
  friends: typeof friends;
  http: typeof http;
  inquiries: typeof inquiries;
  notices: typeof notices;
  rooms: typeof rooms;
  users: typeof users;
  workspace: typeof workspace;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
