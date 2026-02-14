import z from 'zod';

// Types synced with backend models
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// COLORS
export const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'BROWN'] as const;
export type Color = (typeof COLORS)[number];
export const COLORS_SCHEMA = z.enum(COLORS);

// Player type matching backend Player model
export type Player = {
  playerId: string;
  playerName: string;
  playerColour: Color;
  x: number;
  y: number;
  health: number;
  killCount: number;
  deathCount: number;
  isDestroyed: boolean;
};

// Bullet type matching backend Bullet model
export type Bullet = {
  bulletId: string;
  playerId: string;
  x: number;
  y: number;
  direction: Direction;
};

// Game state matching backend Game model
export type GameState = {
  roomId?: string;
  players: Player[];
  bullets: Bullet[];
};
