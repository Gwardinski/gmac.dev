import z from "zod";

export const PLAYER_WIDTH = 16;
export const PLAYER_HEIGHT = 16;
export const PLAYER_SPEED = 1;
export const PLAYER_FIRE_DELAY = 250;

export const BULLET_WIDTH = 1;
export const BULLET_HEIGHT = 1;
export const BULLET_SPEED = 8;
export const BULLET_DECAY_TIME = 4000;

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

// Direction enum for movement and firing
export const DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT"] as const;
const directionSchema = z.enum(DIRECTIONS);
export type Direction = z.infer<typeof directionSchema>;

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
  roomName: z
    .string()
    .min(3, "Room name must be at least 3 characters.")
    .max(20, "Room name must be at most 20 characters."),
  roomCode: z
    .string()
    .min(4, "Room code must be at least 4 characters.")
    .max(4, "Room code must be at most 4 characters."),
  playerName: z
    .string()
    .min(3, "Player name must be at least 3 characters.")
    .max(12, "Player name must be at most 12 characters."),
  playerColour: COLORS_SCHEMA,
  playerId: z.string().nullable().optional(),
  playerDeviceId: z.string(),
});
export type RoomJoinRequestModel = z.infer<typeof roomJoinSchema>;
export type RoomJoinResponseModel = Pick<Room, "roomId"> & { playerId: string };

// PLAYER
const playerSchema = z.object({
  playerId: z.string(),
  playerDeviceId: z.string(),
  playerName: z.string(),
  playerColour: COLORS_SCHEMA,
  lastFireTime: z.number().default(0), // Timestamp of last fire (ms)
  // playerScore: z.number().default(0),
  // playerLives: z.number().default(3),
  // playerHealth: z.number().default(100),
  // playerShield: z.boolean().default(false),
  x: z.number(),
  y: z.number(),
});
export type Player = z.infer<typeof playerSchema>;

// BULLET
const bulletSchema = z.object({
  bulletId: z.string(),
  playerId: z.string(),
  x: z.number(),
  y: z.number(),
  direction: directionSchema,
});
export type Bullet = z.infer<typeof bulletSchema>;

// GAME
const gameSchema = z.object({
  roomId: z.string(),
  players: z.array(playerSchema),
  bullets: z.array(bulletSchema),
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
