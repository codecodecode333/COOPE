// convex/client.ts
"use client";

import { createClient } from "convex/react-clerk";
import { api } from "./_generated/api";

export const client = createClient();

export { api };
