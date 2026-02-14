import z from "zod";
import type { Level } from "../levels.pew";
import { generatePlayerId } from "../util.pew";
import { COLORS_SCHEMA, type Color, type Direction } from "./base.models.pew";

const PLAYER_SIZE = 16; // width and height of the player
const PLAYER_BASE_SPEED = 1; // todo implement the collision code todo if increasing
const PLAYER_BASE_FIRE_DELAY = 200;
const PLAYER_BASE_HEALTH = 100;

type CornerPosition = { x: number; y: number };
type PlayerPositions = {
  x: number;
  y: number;
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
};

export const playerSerialisedSchema = z.object({
  playerId: z.string(),
  playerDeviceId: z.string(),
  playerName: z.string(),
  playerColour: COLORS_SCHEMA,
  x: z.number(),
  y: z.number(),
  health: z.number().optional(),
  topLeft: z.object({ x: z.number(), y: z.number() }).optional(),
  topRight: z.object({ x: z.number(), y: z.number() }).optional(),
  bottomLeft: z.object({ x: z.number(), y: z.number() }).optional(),
  bottomRight: z.object({ x: z.number(), y: z.number() }).optional(),
  killCount: z.number().optional(),
  deathCount: z.number().optional(),
  isDestroyed: z.boolean().optional(),
});
export type PlayerSerialised = z.infer<typeof playerSerialisedSchema>;

export class PlayerClass {
  constructor(
    public playerDeviceId: string,
    public playerName: string,
    public playerColour: Color,
    private x: number,
    private y: number
  ) {
    // set properties
    this.playerDeviceId = playerDeviceId;
    this.playerName = playerName;
    this.playerColour = playerColour;
    this.x = x;
    this.y = y;
    // set default values
    this.playerId = generatePlayerId();
    this.playerSize = PLAYER_SIZE;
    this.health = PLAYER_BASE_HEALTH;
    this.fireDelay = PLAYER_BASE_FIRE_DELAY;
    this.lastFireTime = 0;
    this.speed = PLAYER_BASE_SPEED;
    this.topLeft = { x: this.x, y: this.y };
    this.topRight = { x: this.x + PLAYER_SIZE, y: this.y };
    this.bottomLeft = { x: this.x, y: this.y + PLAYER_SIZE };
    this.bottomRight = { x: this.x + PLAYER_SIZE, y: this.y + PLAYER_SIZE };
    this.killCount = 0;
    this.deathCount = 0;
    this.deathTimestamp = 0;
    this.isDestroyed = false;
  }

  public playerId: string;
  public playerSize: number;
  private health: number;
  private fireDelay: number;
  private lastFireTime: number;
  private speed: number;
  private topLeft: CornerPosition;
  private topRight: CornerPosition;
  private bottomLeft: CornerPosition;
  private bottomRight: CornerPosition;
  // scoring
  public killCount: number;
  public deathCount: number;
  public deathTimestamp: number;
  public isDestroyed: boolean;

  public getPositions(): PlayerPositions {
    return {
      x: this.x,
      y: this.y,
      topLeft: this.topLeft,
      topRight: this.topRight,
      bottomLeft: this.bottomLeft,
      bottomRight: this.bottomRight,
    };
  }

  public updatePosition(direction: Direction, level: Level) {
    let xMod = 0;
    let yMod = 0;

    switch (direction) {
      case "UP":
        yMod = -this.speed;
        break;
      case "DOWN":
        yMod = this.speed;
        break;
      case "LEFT":
        xMod = -this.speed;
        break;
      case "RIGHT":
        xMod = this.speed;
        break;
    }

    // new position
    let newX = this.x + xMod;
    let newY = this.y + yMod;

    const isInWall = checkWallCollision(newX, newY, level);

    if (isInWall) {
      console.log("collision detected");
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

  private setPlayerPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.topLeft = { x: this.x, y: this.y };
    this.topRight = { x: this.x + PLAYER_SIZE, y: this.y };
    this.bottomLeft = { x: this.x, y: this.y + PLAYER_SIZE };
    this.bottomRight = { x: this.x + PLAYER_SIZE, y: this.y + PLAYER_SIZE };
  }

  public updateHealth(amount: number) {
    this.health += amount;
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  private destroy() {
    this.isDestroyed = true;
    this.deathTimestamp = Date.now();
    this.deathCount++;
    this.setPlayerPosition(-1000, -1000); // off screen
  }

  public respawn(spawnPoint: { x: number; y: number }) {
    this.isDestroyed = false;
    this.deathTimestamp = 0;
    this.health = PLAYER_BASE_HEALTH;
    this.setPlayerPosition(spawnPoint.x, spawnPoint.y);
  }

  public canFire(): boolean {
    const currentTime = Date.now();
    const timeSinceLastFire = currentTime - this.lastFireTime;

    if (timeSinceLastFire < this.fireDelay) {
      return false;
    }
    return true;
  }

  public fire() {
    const currentTime = Date.now();
    this.lastFireTime = currentTime;
    // maybe move Bullet Spawn within Player 🤔
  }

  // Serialize player instance to plain object (for WebSocket/DB)
  public toJSON(): PlayerSerialised {
    return {
      playerId: this.playerId,
      playerDeviceId: this.playerDeviceId,
      playerName: this.playerName,
      playerColour: this.playerColour,
      x: this.x,
      y: this.y,
      health: this.health,
      topLeft: this.topLeft,
      topRight: this.topRight,
      bottomLeft: this.bottomLeft,
      bottomRight: this.bottomRight,
      killCount: this.killCount,
      deathCount: this.deathCount,
      isDestroyed: this.isDestroyed,
    };
  }
}

// Move outside player file if other things need this?
function checkWallCollision(newX: number, newY: number, level: Level) {
  // new 4 corners of the player
  const topLeft: CornerPosition = { x: newX, y: newY };
  const topRight: CornerPosition = { x: newX + PLAYER_SIZE, y: newY };
  const bottomLeft: CornerPosition = { x: newX, y: newY + PLAYER_SIZE };
  const bottomRight: CornerPosition = {
    x: newX + PLAYER_SIZE,
    y: newY + PLAYER_SIZE,
  };

  // grid coordinates of the new 4 corners of the player
  const topLeftGrid = {
    x: Math.floor(topLeft.x / PLAYER_SIZE),
    y: Math.floor(topLeft.y / PLAYER_SIZE),
  };
  const topRightGrid = {
    x: Math.floor(topRight.x / PLAYER_SIZE),
    y: Math.floor(topRight.y / PLAYER_SIZE),
  };
  const bottomLeftGrid = {
    x: Math.floor(bottomLeft.x / PLAYER_SIZE),
    y: Math.floor(bottomLeft.y / PLAYER_SIZE),
  };
  const bottomRightGrid = {
    x: Math.floor(bottomRight.x / PLAYER_SIZE),
    y: Math.floor(bottomRight.y / PLAYER_SIZE),
  };

  // Check grid coordinates, is new position in a wall?
  const isInWall =
    level[topLeftGrid.y]?.[topLeftGrid.x] === 2 ||
    level[topRightGrid.y]?.[topRightGrid.x] === 2 ||
    level[bottomLeftGrid.y]?.[bottomLeftGrid.x] === 2 ||
    level[bottomRightGrid.y]?.[bottomRightGrid.x] === 2;

  return isInWall;
}
