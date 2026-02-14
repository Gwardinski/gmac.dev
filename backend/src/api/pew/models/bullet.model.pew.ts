import z from "zod";
import { generateBulletId } from "../util.pew";
import { directionSchema, type Direction } from "./base.models.pew";
import { GRID_SIZE, type Level } from "./level.model.pew";
import type { PlayerClass } from "./player.model.pew";

const BULLET_BASE_SPEED = 10;
const BULLET_SIZE = 1;
const BULLET_DECAY_TIME = 4000;
const BULLET_BASE_DAMAGE = 100;

export const bulletSerialisedSchema = z.object({
  bulletId: z.string(),
  playerId: z.string(),
  x: z.number(),
  y: z.number(),
  direction: directionSchema,
});
export type BulletModel = z.infer<typeof bulletSerialisedSchema>;

export class BulletClass {
  constructor(
    public gameId: string,
    public playerId: string,
    public x: number,
    public y: number,
    public direction: Direction
  ) {
    // set constructor values
    this.gameId = gameId;
    this.bulletId = generateBulletId();
    this.playerId = playerId;
    this.x = x;
    this.y = y;
    this.direction = direction;
    // set required values
    this.speed = BULLET_BASE_SPEED;
    this.spawnTimestamp = Date.now();
    this.isDestroyed = false;
    this.damage = BULLET_BASE_DAMAGE;
  }

  public spawnTimestamp: number;
  public bulletId: string;
  public speed: number;
  public damage: number;
  public isDestroyed: boolean;

  public updatePosition(level: Level) {
    if (Date.now() - this.spawnTimestamp > BULLET_DECAY_TIME) {
      this.destroy();
      return;
    }

    let newX = this.x;
    let newY = this.y;

    switch (this.direction) {
      case "UP":
        newY -= this.speed;
        break;
      case "DOWN":
        newY += this.speed;
        break;
      case "LEFT":
        newX -= this.speed;
        break;
      case "RIGHT":
        newX += this.speed;
        break;
    }

    // Check if bullet hit a wall
    const hitWall = isBulletInWall(newX, newY, level);

    if (hitWall) {
      this.destroy();
      return;
    }

    this.x = newX;
    this.y = newY;
  }

  public toJSON() {
    return {
      bulletId: this.bulletId,
      playerId: this.playerId,
      direction: this.direction,
      x: this.x,
      y: this.y,
    };
  }

  public destroy() {
    this.isDestroyed = true;
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      size: BULLET_SIZE,
    };
  }
}

// spawn point mid point on any 4 sides of the player based on direction
export function getBulletSpawnPoint(player: PlayerClass, direction: Direction) {
  const { x, y } = player.getPositions();
  switch (direction) {
    case "UP":
      return { x: x + player.playerSize / 2, y: y };
    case "DOWN":
      return { x: x + player.playerSize / 2, y: y + player.playerSize };
    case "LEFT":
      return { x: x, y: y + player.playerSize / 2 };
    case "RIGHT":
      return { x: x + player.playerSize, y: y + player.playerSize / 2 };
    default:
      // Fallback to right direction if invalid direction provided 🤷‍♂️
      return { x: x + player.playerSize, y: y + player.playerSize / 2 };
  }
}

function isBulletInWall(x: number, y: number, level: Level): boolean {
  const gridX = Math.floor(x / GRID_SIZE);
  const gridY = Math.floor(y / GRID_SIZE);

  //  todo: check if should add 16 to account for wall width
  if (
    gridY < 0 ||
    gridY >= level.length ||
    gridX < 0 ||
    gridX >= (level[0]?.length || 0)
  ) {
    return true; // outside level bounds
  }

  return level[gridY]?.[gridX] === 2;
}
