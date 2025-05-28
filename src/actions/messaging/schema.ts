import { z } from "zod";

export const createConversationSchema = z.object({
  recipientId: z.string().uuid(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1),
});

export const markMessagesAsReadSchema = z.object({
  conversationId: z.string().uuid(),
});