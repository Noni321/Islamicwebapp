import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z.string().min(1),
  conversationHistory: z.array(z.tuple([z.string(), z.string()])).optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export interface ChatResponse {
  response: string;
}
