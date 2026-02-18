import z from "zod";
import { generateBulletId } from "../util.pew";
import { directionSchema, type Direction } from "./base.models.pew";
import type { LevelTiles } from "./level.model.pew";
import { PhysicalModel } from "./physical.model.pew";
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

export class BulletClass extends PhysicalModel {
  constructor(
    public gameId: string,
    public playerId: string,
    initialX: number,
    initialY: number,
    public direction: Direction
  ) {
    super(generateBulletId(), initialX, initialY, BULLET_SIZE);
    this.speed = BULLET_BASE_SPEED;
    this.spawnTimestamp = Date.now();
    this.isDestroyed = false;
    this.damage = BULLET_BASE_DAMAGE;
  }

  public spawnTimestamp: number;

  public speed: number;
  public damage: number;
  public isDestroyed: boolean;

  public toJSON() {
    const { x, y } = this.getPositions();
    return {
      bulletId: this.id,
      playerId: this.playerId,
      direction: this.direction,
      x: x,
      y: y,
    };
  }

  public updatePosition(level: LevelTiles) {
    if (Date.now() - this.spawnTimestamp > BULLET_DECAY_TIME) {
      this.destroy();
      return;
    }
    const currentPositions = this.getPositions();
    let newX = currentPositions.x;
    let newY = currentPositions.y;

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

    const hitWall = this.checkWallCollision(
      newX,
      newY,
      level,
      BULLET_SIZE,
      true
    );

    if (hitWall) {
      this.destroy();
      return;
    }

    this.setPositions(newX, newY);
  }

  public destroy() {
    this.isDestroyed = true;
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
