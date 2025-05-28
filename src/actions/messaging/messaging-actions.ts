"use server";

import { authActionClient } from "@/actions/safe-action";
import { createConversation, sendMessage, markMessagesAsRead } from "@/lib/supabase/mutations/messaging";
import { createConversationSchema, sendMessageSchema, markMessagesAsReadSchema } from "./schema";

export const createConversationAction = authActionClient
  .schema(createConversationSchema)
  .metadata({
    name: "create-conversation",
  })
  .action(async ({ parsedInput: { recipientId }, ctx: { user } }) => {
    const result = await createConversation(user.id, recipientId);
    return result;
  });

export const sendMessageAction = authActionClient
  .schema(sendMessageSchema)
  .metadata({
    name: "send-message",
  })
  .action(async ({ parsedInput: { conversationId, content }, ctx: { user } }) => {
    const result = await sendMessage(conversationId, user.id, content);
    return result;
  });

export const markMessagesAsReadAction = authActionClient
  .schema(markMessagesAsReadSchema)
  .metadata({
    name: "mark-messages-as-read",
  })
  .action(async ({ parsedInput: { conversationId }, ctx: { user } }) => {
    const result = await markMessagesAsRead(conversationId, user.id);
    return result;
  });