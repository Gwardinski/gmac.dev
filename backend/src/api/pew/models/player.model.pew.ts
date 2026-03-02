import z from "zod";
import { generatePlayerId } from "../util.pew";
import {
  COLORS_SCHEMA,
  bearingSchema,
  type Bearing,
  type Color,
} from "./base.models.pew";
import type { LevelTiles } from "./level.model.pew";
import { PhysicalModel } from "./physical.model.pew";

const PLAYER_SIZE = 16; // width and height of the player
const PLAYER_BASE_SPEED = 2; // todo implement the collision code todo if increasing
const PLAYER_BASE_FIRE_DELAY = 200;
const PLAYER_BASE_HEALTH = 100;
const PLAYER_DELETION_GRACE_PERIOD = 30000; // 30 seconds to rejoin

const PLAYER_DEATH_TIME = 2000;
const PLAYER_SPAWN_TIME = 1200;
const PLAYER_INVINCIBILITY_TIME = 1600;

// External Player State - Serialised
export const playerSerialisedSchema = z.object({
  id: z.string(), // todo maybe don't return, could be hijacked...
  deviceId: z.string(),
  name: z.string(),
  colour: COLORS_SCHEMA,
  x: z.number(),
  y: z.number(),
  speed: z.number().optional(),
  health: z.number().optional(),
  topLeft: z.object({ x: z.number(), y: z.number() }).optional(),
  topRight: z.object({ x: z.number(), y: z.number() }).optional(),
  bottomLeft: z.object({ x: z.number(), y: z.number() }).optional(),
  bottomRight: z.object({ x: z.number(), y: z.number() }).optional(),
  killCount: z.number().optional(),
  deathCount: z.number().optional(),
  isDestroyed: z.boolean().optional(),
  isSpawning: z.boolean().optional(),
  isInvincible: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  bearing: bearingSchema.optional(),
});
export type PlayerSerialised = z.infer<typeof playerSerialisedSchema>;

// Internal Player State - Class based
export class PlayerClass extends PhysicalModel {
  constructor(
    public deviceId: string,
    public name: string,
    public colour: Color,
    initialX: number,
    initialY: number
  ) {
    super(generatePlayerId(), initialX, initialY, PLAYER_SIZE);
  }

  public playerSize: number = PLAYER_SIZE;
  public speed: number = PLAYER_BASE_SPEED;
  public health: number = PLAYER_BASE_HEALTH;
  // shooting
  public fireDelay: number = PLAYER_BASE_FIRE_DELAY;
  public lastFireTime: number = 0;
  // scoring
  public killCount: number = 0;
  public deathCount: number = 0;
  // death cycle
  public inDeathCycle: boolean = false;
  public isDestroyed: boolean = false;
  public destroyedTimestamp: number = 0;
  public isSpawning: boolean = false; // no spawn animation on initial join
  public spawnTimestamp: number = 0;
  public isInvincible: boolean = false;
  public invincibilityTimestamp: number = 0;
  // deletion
  public isDeleted: boolean = false; // todo, make difference between choosing to leave and leaving unexpectedly
  public deletedTimestamp: number = 0;

  public toJSON(): PlayerSerialised {
    const { x, y, topLeft, topRight, bottomLeft, bottomRight } =
      this.getPositions();
    return {
      id: this.id,
      deviceId: this.deviceId,
      name: this.name,
      colour: this.colour,
      x: x,
      y: y,
      health: this.health,
      speed: this.speed,
      bearing: this.bearing,
      topLeft: topLeft,
      topRight: topRight,
      bottomLeft: bottomLeft,
      bottomRight: bottomRight,
      killCount: this.killCount,
      deathCount: this.deathCount,
      isDestroyed: this.isDestroyed,
      isSpawning: this.isSpawning,
      isInvincible: this.isInvincible,
      isDeleted: this.isDeleted,
    };
  }

  public updateName(name: string) {
    this.name = name;
  }

  public updateColour(colour: Color) {
    this.colour = colour;
  }

  /*
    MOVEMENT
  */

  public updateServerPosition(bearing: Bearing, level: LevelTiles) {
    const rad = (bearing * Math.PI) / 180;
    const xMod = Math.cos(rad) * this.speed;
    const yMod = Math.sin(rad) * this.speed;

    const currentPositions = this.getPositions();
    let newX = currentPositions.x + xMod;
    let newY = currentPositions.y + yMod;

    if (this.checkWallCollision(newX, newY, level)) {
      // Wall sliding: try X-only or Y-only move if diagonal hits a wall
      const tryX = this.checkWallCollision(
        currentPositions.x + xMod,
        currentPositions.y,
        level
      );
      const tryY = this.checkWallCollision(
        currentPositions.x,
        currentPositions.y + yMod,
        level
      );
      if (!tryX) {
        newX = currentPositions.x + xMod;
        newY = currentPositions.y;
      } else if (!tryY) {
        newX = currentPositions.x;
        newY = currentPositions.y + yMod;
      } else {
        newX = currentPositions.x;
        newY = currentPositions.y;
      }
    }

    this.setPositions(newX, newY, bearing);
  }

  /** Client sends position; server validates (wall collision) and applies or rejects. */
  public setPositionFromClient(
    x: number,
    y: number,
    bearing: Bearing,
    level: LevelTiles
  ): void {
    const inWall = this.checkWallCollision(x, y, level);
    if (inWall) return;
    this.setPositions(x, y, bearing ?? this.bearing);
  }

  /*
    DEATH CYCLE
  */

  private handleDeathState() {
    this.inDeathCycle = true;
    this.isDestroyed = true;
    this.destroyedTimestamp = Date.now();
    this.deathCount++;
    this.fireDelay = PLAYER_BASE_FIRE_DELAY;
  }

  public canHandleRespawnState1() {
    return (
      this.isDestroyed &&
      this.destroyedTimestamp + PLAYER_DEATH_TIME < Date.now()
    );
  }

  public handleRespawnState1(spawnPoint: { x: number; y: number }) {
    this.isDestroyed = false;
    this.destroyedTimestamp = 0;
    this.health = PLAYER_BASE_HEALTH;
    this.setPositions(spawnPoint.x, spawnPoint.y, undefined);
    this.isSpawning = true;
    this.spawnTimestamp = Date.now();
    this.isInvincible = true;
    this.invincibilityTimestamp = Date.now();
  }

  public canHandleRespawnState2() {
    return (
      this.isSpawning && this.spawnTimestamp + PLAYER_SPAWN_TIME < Date.now()
    );
  }

  public handleRespawnState2() {
    this.isSpawning = false;
    this.spawnTimestamp = 0;
    this.isInvincible = true;
    this.invincibilityTimestamp = Date.now();
  }

  public canHandleRespawnState3() {
    return (
      this.isInvincible &&
      this.invincibilityTimestamp + PLAYER_INVINCIBILITY_TIME < Date.now()
    );
  }
  public handleRespawnState3() {
    this.isInvincible = false;
    this.invincibilityTimestamp = 0;
    this.inDeathCycle = false;
  }

  public markAsDeleted() {
    this.isDeleted = true;
    this.deletedTimestamp = Date.now();
  }

  /*
    SHOOTING
  */

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

  public incrementKillCount(killedPlayerId: string) {
    if (killedPlayerId === this.id) {
      return;
    }
    this.killCount++;
  }

  public takeDamage(amount: number): boolean {
    this.health -= amount;
    if (this.health <= 0) {
      this.handleDeathState();
      return true;
    }
    return false;
  }

  public increaseFireDelay() {
    this.fireDelay = 50;
  }

  /*
    DELETION
  */

  public restore() {
    this.isDeleted = false;
    this.deletedTimestamp = 0;
  }

  public shouldBeRemoved(): boolean {
    if (!this.isDeleted) {
      return false;
    }
    return Date.now() - this.deletedTimestamp > PLAYER_DELETION_GRACE_PERIOD;
  }
}
