import z from 'zod';
// 1 = floor
// 2 = wall
// 3 = spawn
// 4 = lava
type Floor = 1 | 2 | 3 | 4;
export const GRID_SIZE = 16;

/* prettier-ignore */
// don't format line length
type LevelRow = [Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor, Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor,Floor];
export type Level = LevelRow[];

export const TILE_SIZE = 16;

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
  speed: number;
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

export type Message = {
  messageId: string;
  playerId: string;
  playerName: string;
  playerColour: Color;
  messageContent: string;
  timestamp: number;
  isGameMessage: boolean;
};

// Game state matching backend Game model
export type GameState = {
  roomId?: string;
  players: Player[];
  bullets: Bullet[];
  messages: Message[];
};
