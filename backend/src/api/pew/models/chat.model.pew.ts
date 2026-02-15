import z from "zod";
import { COLORS_SCHEMA, type Color } from "./base.models.pew";

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

export type SystemEvent =
  | {
      type: "player-death";
      killerId: string;
      killerName: string;
      killerColour: Color;
      victimId: string;
      victimName: string;
    }
  | {
      type: "player-join";
      playerId: string;
      playerName: string;
      playerColour: Color;
    }
  | {
      type: "player-leave";
      playerId: string;
      playerName: string;
      playerColour: Color;
    };
