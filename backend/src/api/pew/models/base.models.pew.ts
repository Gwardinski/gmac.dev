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

// leave room
export const roomLeaveSchema = z.object({
  roomId: z.string(),
  playerId: z.string(),
});
export type RoomLeaveRequestModel = z.infer<typeof roomLeaveSchema>;
export type RoomLeaveResponseModel = Pick<Room, "roomId"> & {
  playerId: string;
};

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

// send message
const sendMessageMessageSchema = z.object({
  type: z.literal("send-message"),
  data: z.object({
    messageContent: z.string(),
  }),
});
export type SendMessageMessage = z.infer<typeof sendMessageMessageSchema>;

// Union of all possible WebSocket messages
export const wsMessageSchema = z.discriminatedUnion("type", [
  updateMovementMessageSchema,
  fireMessageSchema,
  leaveRoomMessageSchema,
  sendMessageMessageSchema,
]);
export type WSMessage = z.infer<typeof wsMessageSchema>;

export type WSSendMessageType = "game-state";

// CHAT

export const gameMessageSchema = z.object({
  messageId: z.string(),
  playerId: z.string(),
  playerName: z.string(),
  playerColour: COLORS_SCHEMA,
  messageContent: z.string(),
  timestamp: z.number(),
  isGameMessage: z.boolean(),
});
export type GameMessage = z.infer<typeof gameMessageSchema>;
