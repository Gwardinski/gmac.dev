import z from "zod";

// COLORS
export const COLORS = [
  "RED",
  "BLUE",
  "GREEN",
  "YELLOW",
  "PURPLE",
  "ORANGE",
  "TEAL",
  "PINK",
] as const;
export type Color = (typeof COLORS)[number];
export const COLORS_SCHEMA = z.enum(COLORS);

// Direction enum for movement and firing
export const DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT"] as const;
export const directionSchema = z.enum(DIRECTIONS);
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

// WEBSOCKET

// WebSocket query parameters
export const wsQuerySchema = z.object({
  roomId: z.string(),
  playerId: z.string(),
});
export type WSQuery = z.infer<typeof wsQuerySchema>;

// WEBSOCKET MESSAGES

// movement
const updateMovementDataSchema = z.object({
  direction: directionSchema,
});

const updateMovementMessageSchema = z.object({
  type: z.literal("update-movement"),
  data: updateMovementDataSchema,
});
export type UpdateMovementMessage = z.infer<typeof updateMovementMessageSchema>;

// fire
const fireDataSchema = z.object({
  direction: directionSchema,
});

const fireMessageSchema = z.object({
  type: z.literal("fire"),
  data: fireDataSchema,
});
export type FireMessage = z.infer<typeof fireMessageSchema>;

// leave room
const leaveRoomMessageSchema = z.object({
  type: z.literal("leave-room"),
});
export type LeaveRoomMessage = z.infer<typeof leaveRoomMessageSchema>;

// send chat
const sendGameChatSchema = z.object({
  type: z.literal("send-chat"),
  data: z.object({
    chatContent: z.string(),
  }),
});
export type SendGameChat = z.infer<typeof sendGameChatSchema>;

// Union of all possible WebSocket messages
export const wsMessageSchema = z.discriminatedUnion("type", [
  updateMovementMessageSchema,
  fireMessageSchema,
  leaveRoomMessageSchema,
  sendGameChatSchema,
]);
export type WSMessage = z.infer<typeof wsMessageSchema>;

export type WSSendMessageType = "game-state" | "new-chat";
