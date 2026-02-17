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
export const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'TEAL', 'PINK'] as const;
export type Color = (typeof COLORS)[number];
export const COLORS_SCHEMA = z.enum(COLORS);
export function colorToHex(color: Color | null) {
  switch (color) {
    case 'RED':
      return '#d51313';
    case 'BLUE':
      return '#2596be';
    case 'GREEN':
      return '#13d521';
    case 'YELLOW':
      return '#f5f319';
    case 'PURPLE':
      return '#a82aee';
    case 'ORANGE':
      return '#f97715';
    case 'TEAL':
      return '#15f9b6';
    case 'PINK':
      return '#ff23b1';
    default:
      return '#000000';
  }
}

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
  isSpawning: boolean;
  isInvincible: boolean;
};

// Bullet type matching backend Bullet model
export type Bullet = {
  bulletId: string;
  playerId: string;
  x: number;
  y: number;
  direction: Direction;
};

export type Item = {
  itemId: string;
  itemName: string;
  x: number;
  y: number;
};

export type Message = {
  chatId: string;
  playerId: string | null;
  playerName: string | null;
  playerColour: Color | null;
  secondColor: Color | null;
  content: string;
  timestamp: number;
  isSystem: boolean;
};

// Game state matching backend Game model (messages moved to separate channel)
export type GameState = {
  roomId?: string;
  players: Player[];
  bullets: Bullet[];
  items: Item[];
};
