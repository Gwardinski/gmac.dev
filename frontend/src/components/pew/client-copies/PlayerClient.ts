import type { Color, Direction, Level } from '.';

export const PLAYER_SIZE = 16;
type CornerPosition = { x: number; y: number };
type PlayerPositions = {
  x: number;
  y: number;
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
};

// Player Data, for general use
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

// Player "Physical" model, for canvas. Copied from backend PlayerClass.
export class PlayerClient {
  constructor(
    public x: number,
    public y: number,
    public speed: number
  ) {
    // from api
    this.x = x;
    this.y = y;
    this.speed = speed;
    // rest
    this.topLeft = { x: this.x, y: this.y };
    this.topRight = { x: this.x + PLAYER_SIZE, y: this.y };
    this.bottomLeft = { x: this.x, y: this.y + PLAYER_SIZE };
    this.bottomRight = { x: this.x + PLAYER_SIZE, y: this.y + PLAYER_SIZE };
  }

  public topLeft: CornerPosition;
  public topRight: CornerPosition;
  public bottomLeft: CornerPosition;
  public bottomRight: CornerPosition;

  public getPositions(): PlayerPositions {
    return {
      x: this.x,
      y: this.y,
      topLeft: this.topLeft,
      topRight: this.topRight,
      bottomLeft: this.bottomLeft,
      bottomRight: this.bottomRight
    };
  }

  public updatePosition(direction: Direction, level: Level) {
    let xMod = 0;
    let yMod = 0;

    switch (direction) {
      case 'UP':
        yMod = -this.speed;
        break;
      case 'DOWN':
        yMod = this.speed;
        break;
      case 'LEFT':
        xMod = -this.speed;
        break;
      case 'RIGHT':
        xMod = this.speed;
        break;
    }

    // new position
    let newX = this.x + xMod;
    let newY = this.y + yMod;

    const isInWall = checkWallCollision(newX, newY, level);

    if (isInWall) {
      newX = this.x;
      newY = this.y;

      /*
      todo...
      if speed is more than 1 i.e. 4
      while speed > 0,
      check speed - 1, speed - 2, speed - 3, etc
      once found value that's not in wall, snap player that position to hug wall
      */
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
