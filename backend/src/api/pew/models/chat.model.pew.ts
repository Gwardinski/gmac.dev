import z from "zod";
import { COLORS_SCHEMA } from "./base.models.pew";

export const gameChatSchema = z.object({
  chatId: z.string(),
  playerId: z.string().nullable(),
  playerName: z.string().nullable(),
  playerColour: COLORS_SCHEMA.nullable(),
  content: z.string(),
  timestamp: z.number(),
  isSystem: z.boolean(),
});
export type GameChat = z.infer<typeof gameChatSchema>;
