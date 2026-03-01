import z from "zod";
import { generateBulletId } from "../util.pew";
import { bearingSchema, type Bearing } from "./base.models.pew";
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
  bearing: bearingSchema,
});
export type BulletModel = z.infer<typeof bulletSerialisedSchema>;

export class BulletClass extends PhysicalModel {
  constructor(
    public gameId: string,
    public playerId: string,
    initialX: number,
    initialY: number,
    bearing: Bearing
  ) {
    super(generateBulletId(), initialX, initialY, BULLET_SIZE);
    this.speed = BULLET_BASE_SPEED;
    this.spawnTimestamp = Date.now();
    this.isDestroyed = false;
    this.damage = BULLET_BASE_DAMAGE;
    this.setPositions(initialX, initialY, bearing);
  }

  public spawnTimestamp: number;

  public speed: number;
  public damage: number;
  public isDestroyed: boolean;

  public toJSON(): BulletModel {
    const { x, y } = this.getPositions();
    return {
      bulletId: this.id,
      playerId: this.playerId,
      bearing: this.bearing!,
      x: x,
      y: y,
    };
  }

  public updateServerPosition(level: LevelTiles) {
    if (Date.now() - this.spawnTimestamp > BULLET_DECAY_TIME || this.bearing === undefined) {
      this.destroy();
      return;
    }
    const currentPositions = this.getPositions();
    const rad = (this.bearing * Math.PI) / 180;
    const newX = currentPositions.x + Math.cos(rad) * this.speed;
    const newY = currentPositions.y + Math.sin(rad) * this.speed;

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

    this.setPositions(newX, newY, this.bearing);
  }

  public destroy() {
    this.isDestroyed = true;
  }
}

// spawn at edge of player in bearing direction (0=right, 90=down, 180=left, 270=up)
export function getBulletSpawnPoint(player: PlayerClass, bearing: Bearing) {
  const { x, y } = player.getPositions();
  const half = player.playerSize / 2;
  const rad = (bearing * Math.PI) / 180;
  const dist = half + 1;
  return {
    x: x + half + Math.cos(rad) * dist,
    y: y + half + Math.sin(rad) * dist,
  };
}
