import z from "zod";

// ROOMS

export type ROOM_ID = string;

const roomSchema = z.object({
  roomId: z.string() as z.ZodType<ROOM_ID>,
  roomName: z.string(),
  roomCode: z.string(),
  playerCount: z.number().optional(),
});
export type Room = z.infer<typeof roomSchema>;
export type RoomListModel = Omit<Room, "roomCode" | "roomId">;

export const roomJoinSchema = z.object({
  roomName: z.string(),
  roomCode: z.string(),
});
export type RoomJoinRequestModel = z.infer<typeof roomJoinSchema>;
export type RoomJoinResponseModel = Pick<Room, "roomId">;

// PLAYER

const playerColourSchema = z.enum([
  "RED",
  "BLUE",
  "GREEN",
  "YELLOW",
  "PURPLE",
  "ORANGE",
  "BROWN",
] as const);
export type PlayerColour = z.infer<typeof playerColourSchema>;

const playerSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
  playerColour: playerColourSchema,
  x: z.number(),
  y: z.number(),
});
export type Player = z.infer<typeof playerSchema>;

// GAME

const gameSchema = z.object({
  roomId: z.string(),
  players: z.array(playerSchema),
});
export type Game = z.infer<typeof gameSchema>;

// CHAT

// type GameChat = {
//   messages: Message[];
// };

// // Possibly too many fields here. Want to keep simple, but can delete later.
// type Message = {
//   messageId: string;
//   playerId: string; // might not need this since we have playerColor
//   playerColor: Color;
//   content: string;
//   timestamp: number;
// };
