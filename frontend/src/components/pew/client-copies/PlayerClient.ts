import type { Bearing, Color, Level } from '.';

export const PLAYER_SIZE = 16;

export type MovementKey = 'w' | 'a' | 's' | 'd';
export type FireKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
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
type PlayerTickCallbackProps = {
  _deltaMs: number;
  movementKeys: Set<MovementKey>;
  fireKeys: Set<FireKey>;
  onFireCallback: (bearing: Bearing) => void;
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
// Client copy of server Player class
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
  public level: Level = [];
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

  public syncStatusWithServer(serverPlayer: Player): PlayerClient {
    this.isDestroyed = serverPlayer.isDestroyed ?? false;
    this.isSpawning = serverPlayer.isSpawning ?? false;
    this.isInvincible = serverPlayer.isInvincible ?? false;

    // on death, spawn at server position (spawn point)
    // TODO: should also return & check for an "overwrite" flag, for if server should overwrite client position
    // i.e. if client moves too far from previous position (cheat detection)
    if (this.isDestroyed || this.isSpawning) {
      this._setPlayerClientPosition(serverPlayer.x, serverPlayer.y);
    }

    return this;
  }

  // used only by Other Players
  public syncPositionWithServer(x: number, y: number) {
    this._setPlayerClientPosition(x, y);
  }

  public onGameTick({ movementKeys, fireKeys, onFireCallback }: PlayerTickCallbackProps) {
    this._detectMovementInput(movementKeys);
    this._detectFireInput(fireKeys, onFireCallback);
  }

  private _detectFireInput(fireKeys: Set<FireKey>, onFireCallback: (bearing: Bearing) => void) {
    if (this.isSpawning || this.isDestroyed) return;

    const bearing = (() => {
      let dx = 0;
      let dy = 0;
      fireKeys.forEach((k) => {
        if (k === 'ArrowUp') dy -= 1;
        if (k === 'ArrowDown') dy += 1;
        if (k === 'ArrowLeft') dx -= 1;
        if (k === 'ArrowRight') dx += 1;
      });
      if (dx === 0 && dy === 0) return null;
      return Math.round((Math.atan2(dy, dx) * (180 / Math.PI) + 360) % 360) as Bearing;
    })();

    if (bearing === null) {
      return;
    }
    onFireCallback(bearing);
  }

  private _detectMovementInput(movementKeys: Set<MovementKey>) {
    if (this.isSpawning) return;
    let dx = 0;
    let dy = 0;
    movementKeys.forEach((k) => {
      if (k === 'w') dy -= 1;
      if (k === 's') dy += 1;
      if (k === 'a') dx -= 1;
      if (k === 'd') dx += 1;
    });
    if (dx === 0 && dy === 0) return;
    const bearing = (Math.round((Math.atan2(dy, dx) * (180 / Math.PI) + 360) % 360) as Bearing) ?? this.bearing;
    if (bearing !== undefined) {
      this._updatePosition(bearing);
    }
  }

  private _updatePosition(bearing: Bearing) {
    const rad = (bearing * Math.PI) / 180;
    const xMod = Math.cos(rad) * this.speed;
    const yMod = Math.sin(rad) * this.speed;

    let newX = this.x + xMod;
    let newY = this.y + yMod;

    this.bearing = bearing;

    if (checkWallCollision(newX, newY, this.level)) {
      // Wall sliding: try X-only or Y-only move if diagonal hits a wall
      const tryX = checkWallCollision(this.x + xMod, this.y, this.level);
      const tryY = checkWallCollision(this.x, this.y + yMod, this.level);
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

    this._setPlayerClientPosition(newX, newY);
  }

  private _setPlayerClientPosition(x: number, y: number) {
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
