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

// Bearing in degrees 0-359: 0=right, 90=down, 180=left, 270=up (allows diagonal movement)
export const bearingSchema = z.number().int().min(0).max(359);
export type Bearing = z.infer<typeof bearingSchema>;

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

// position
const updatePositionDataSchema = z.object({
  x: z.number(),
  y: z.number(),
  bearing: bearingSchema,
});
const updatePositionMessageSchema = z.object({
  type: z.literal("update-position"),
  data: updatePositionDataSchema,
});
export type UpdatePositionMessage = z.infer<typeof updatePositionMessageSchema>;

// fire
const fireDataSchema = z.object({
  bearing: bearingSchema,
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
  updatePositionMessageSchema,
  fireMessageSchema,
  leaveRoomMessageSchema,
  sendGameChatSchema,
]);
export type WSMessage = z.infer<typeof wsMessageSchema>;

export type WSSendMessageType = "game-state" | "new-chat";
