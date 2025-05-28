"use server";

import { authActionClient } from "@/actions/safe-action";
import { createConnectionRequest, respondToConnectionRequest } from "@/lib/supabase/mutations/connections";
import { createConnectionRequestSchema, respondToConnectionRequestSchema } from "./schema";

export const createConnectionRequestAction = authActionClient
  .schema(createConnectionRequestSchema)
  .metadata({
    name: "create-connection-request",
  })
  .action(async ({ parsedInput: { recipientId, message }, ctx: { user } }) => {
    const result = await createConnectionRequest(user.id, recipientId, message);
    return result;
  });

export const respondToConnectionRequestAction = authActionClient
  .schema(respondToConnectionRequestSchema)
  .metadata({
    name: "respond-to-connection-request",
  })
  .action(async ({ parsedInput: { connectionId, accepted, message }, ctx: { user } }) => {
    const result = await respondToConnectionRequest(connectionId, user.id, accepted, message);
    return result;
  });