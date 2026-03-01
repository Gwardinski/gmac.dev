import type { Bearing, Color, Level } from '.';

export const PLAYER_SIZE = 16;
type CornerPosition = { x: number; y: number };
type PlayerPositions = {
  x: number;
  y: number;
  topLeft: CornerPosition;
  topRight: CornerPosition;
  bottomLeft: CornerPosition;
  bottomRight: CornerPosition;
  bearing: Bearing | undefined;
};

// Game State Players
export type Player = {
  id: string;
  name: string;
  colour: Color;
  x: number;
  y: number;
  bearing: Bearing | undefined;
  speed: number;
  health: number;
  killCount: number;
  deathCount: number;
  isDestroyed: boolean;
  isSpawning: boolean;
  isInvincible: boolean;
};

// Active Player (For Client Rendering)
// Simplified copy of server Player class
export class PlayerClient {
  constructor(
    public id: string,
    public name: string,
    public colour: Color,
    public x: number,
    public y: number,
    public speed: number,
    public bearing: Bearing | undefined
  ) {
    // from api
    this.id = id;
    this.name = name;
    this.colour = colour;
    this.x = x;
    this.y = y;
    this.speed = speed;
    // rest
    this.topLeft = { x: this.x, y: this.y };
    this.topRight = { x: this.x + PLAYER_SIZE, y: this.y };
    this.bottomLeft = { x: this.x, y: this.y + PLAYER_SIZE };
    this.bottomRight = { x: this.x + PLAYER_SIZE, y: this.y + PLAYER_SIZE };
    this.bearing = bearing;
  }

  public topLeft: CornerPosition;
  public topRight: CornerPosition;
  public bottomLeft: CornerPosition;
  public bottomRight: CornerPosition;

  // set from player server data
  public inDeathCycle: boolean = false;
  public isDestroyed: boolean = false;
  public isSpawning: boolean = false;
  public isInvincible: boolean = false;

  public getPositions(): PlayerPositions {
    return {
      x: this.x,
      y: this.y,
      topLeft: this.topLeft,
      topRight: this.topRight,
      bottomLeft: this.bottomLeft,
      bottomRight: this.bottomRight,
      bearing: this.bearing ?? undefined
    };
  }

  public updatePosition(bearing: Bearing, level: Level) {
    const rad = (bearing * Math.PI) / 180;
    const xMod = Math.cos(rad) * this.speed;
    const yMod = Math.sin(rad) * this.speed;

    let newX = this.x + xMod;
    let newY = this.y + yMod;

    this.bearing = bearing;

    if (checkWallCollision(newX, newY, level)) {
      // Wall sliding: try X-only or Y-only move if diagonal hits a wall
      const tryX = checkWallCollision(this.x + xMod, this.y, level);
      const tryY = checkWallCollision(this.x, this.y + yMod, level);
      if (!tryX) {
        newX = this.x + xMod;
        newY = this.y;
      } else if (!tryY) {
        newX = this.x;
        newY = this.y + yMod;
      } else {
        newX = this.x;
        newY = this.y;
      }
    }

    this.setPlayerPosition(newX, newY);
  }

  // public on client to sync with server
  public setPlayerPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.topLeft = { x: this.x, y: this.y };
    this.topRight = { x: this.x + PLAYER_SIZE, y: this.y };
    this.bottomLeft = { x: this.x, y: this.y + PLAYER_SIZE };
    this.bottomRight = { x: this.x + PLAYER_SIZE, y: this.y + PLAYER_SIZE };
  }
}

function checkWallCollision(newX: number, newY: number, level: Level) {
  // new 4 corners of the player
  const topLeft: CornerPosition = { x: newX, y: newY };
  const topRight: CornerPosition = { x: newX + PLAYER_SIZE, y: newY };
  const bottomLeft: CornerPosition = { x: newX, y: newY + PLAYER_SIZE };
  const bottomRight: CornerPosition = {
    x: newX + PLAYER_SIZE,
    y: newY + PLAYER_SIZE
  };

  // grid coordinates of the new 4 corners of the player
  const topLeftGrid = {
    x: Math.floor(topLeft.x / PLAYER_SIZE),
    y: Math.floor(topLeft.y / PLAYER_SIZE)
  };
  const topRightGrid = {
    x: Math.floor(topRight.x / PLAYER_SIZE),
    y: Math.floor(topRight.y / PLAYER_SIZE)
  };
  const bottomLeftGrid = {
    x: Math.floor(bottomLeft.x / PLAYER_SIZE),
    y: Math.floor(bottomLeft.y / PLAYER_SIZE)
  };
  const bottomRightGrid = {
    x: Math.floor(bottomRight.x / PLAYER_SIZE),
    y: Math.floor(bottomRight.y / PLAYER_SIZE)
  };

  // Check grid coordinates, is new position in a wall?
  const isInWall =
    level[topLeftGrid.y]?.[topLeftGrid.x] === 2 ||
    level[topRightGrid.y]?.[topRightGrid.x] === 2 ||
    level[bottomLeftGrid.y]?.[bottomLeftGrid.x] === 2 ||
    level[bottomRightGrid.y]?.[bottomRightGrid.x] === 2;

  return isInWall;
}
