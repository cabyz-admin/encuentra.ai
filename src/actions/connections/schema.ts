import { z } from "zod";

export const createConnectionRequestSchema = z.object({
  recipientId: z.string().uuid(),
  message: z.string().optional(),
});

export const respondToConnectionRequestSchema = z.object({
  connectionId: z.string().uuid(),
  accepted: z.boolean(),
  message: z.string().optional(),
});