import z from "zod";

// COLORS
export const COLORS = [
  "RED",
  "BLUE",
  "GREEN",
  "YELLOW",
  "PURPLE",
  "ORANGE",
  "BROWN",
] as const;
export type Color = (typeof COLORS)[number];
export const COLORS_SCHEMA = z.enum(COLORS);

// ROOMS
// list rooms
export type ROOM_ID = string;
const roomSchema = z.object({
  roomId: z.string() as z.ZodType<ROOM_ID>,
  roomName: z.string(),
  roomCode: z.string(),
  playerCount: z.number().optional(),
});
export type Room = z.infer<typeof roomSchema>;
export type RoomListModel = Omit<Room, "roomCode" | "roomId">;

// join room
export const roomJoinSchema = z.object({
  roomName: z.string(),
  roomCode: z.string(),
  playerName: z.string(),
  playerColour: COLORS_SCHEMA,
});
export type RoomJoinRequestModel = z.infer<typeof roomJoinSchema>;
export type RoomJoinResponseModel = Pick<Room, "roomId">;

// PLAYER
const playerSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
  playerColour: COLORS_SCHEMA,
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

// WEBSOCKET

// WebSocket query parameters
export const wsQuerySchema = z.object({
  roomId: z.string(),
  playerId: z.string(),
});
export type WSQuery = z.infer<typeof wsQuerySchema>;

// WEBSOCKET MESSAGES

// Direction enum for movement and firing
export const DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT"] as const;
const directionSchema = z.enum(DIRECTIONS);
export type Direction = z.infer<typeof directionSchema>;

// Message data schemas
const updateMovementDataSchema = z.object({
  direction: directionSchema,
});
export type UpdateMovementData = z.infer<typeof updateMovementDataSchema>;

// WebSocket message wrapper schemas
const updateMovementMessageSchema = z.object({
  type: z.literal("update-movement"),
  data: updateMovementDataSchema,
});
export type UpdateMovementMessage = z.infer<typeof updateMovementMessageSchema>;

const fireDataSchema = z.object({
  direction: directionSchema,
});
export type FireData = z.infer<typeof fireDataSchema>;

const fireMessageSchema = z.object({
  type: z.literal("fire"),
  data: fireDataSchema,
});
export type FireMessage = z.infer<typeof fireMessageSchema>;

// Union of all possible WebSocket messages
export const wsMessageSchema = z.discriminatedUnion("type", [
  updateMovementMessageSchema,
  fireMessageSchema,
]);
export type WSMessage = z.infer<typeof wsMessageSchema>;

export type WSSendMessageType = "game-state";

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
