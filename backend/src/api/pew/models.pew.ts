import z from "zod";

export const directionSchema = z.enum(["UP", "DOWN", "LEFT", "RIGHT"]);
export type Direction = z.infer<typeof directionSchema>;

export const colorSchema = z.enum([
  "RED",
  "BLUE",
  "GREEN",
  "YELLOW",
  "PURPLE",
  "ORANGE",
  "BROWN",
] as const);
export type Color = z.infer<typeof colorSchema>;

export const joinGameSchema = z.object({
  playerName: z.string(),
  playerColor: colorSchema,
  sessionId: z.string(),
  roomCode: z.string(),
});
export type JoinGameRequest = z.infer<typeof joinGameSchema>;

export const updatePositionSchema = z.object({
  socketId: z.string(),
  direction: directionSchema,
});
export type UpdatePositionRequest = z.infer<typeof updatePositionSchema>;

export type Player = {
  socketId: string;
  sessionId: string; // Unique ID that persists across refreshes
  name: string;
  color: Color;
  x: number;
  y: number;
  // health: number;
  // shield: boolean;
  // energy: number;
  // killCount: number;
  // deathCount: number;
};

export type GameState = {
  id: string;
  roomCode: string;
  players: Player[];
};

export type GameChat = {
  messages: string[];
};
