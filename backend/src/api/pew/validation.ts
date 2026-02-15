import z from "zod";
import { COLORS_SCHEMA, type Room } from "./models/base.models.pew";

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

// chat
export const sendChatSchema = z.object({
  playerId: z.string(),
  content: z.string().min(1, "Message cannot be empty"),
});
export type SendChatRequestModel = z.infer<typeof sendChatSchema>;
