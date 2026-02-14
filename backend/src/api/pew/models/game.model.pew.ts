import z from "zod";
import type { Level } from "../levels.pew";
import { BulletClass, bulletSerialisedSchema } from "./bullet.model.pew";
import { PlayerClass, playerSerialisedSchema } from "./player.model.pew";

// Internal Game State - Class based
const gameSchema = z.object({
  roomId: z.string(),
  bullets: z.array(z.instanceof(BulletClass)),
  players: z.array(z.instanceof(PlayerClass)),
});
export type GameModel = z.infer<typeof gameSchema>;

export class GameClass {
  constructor(public roomId: string, public level: Level) {
    this.roomId = roomId;
    this.level = level;
    this.players = [];
    this.bullets = [];
  }

  public players: PlayerClass[];
  public bullets: BulletClass[];

  public addPlayer(player: PlayerClass) {
    this.players.push(player);
  }

  public removePlayer(player: PlayerClass) {
    this.players = this.players.filter((p) => p !== player);
  }

  public addBullet(bullet: BulletClass) {
    this.bullets.push(bullet);
  }

  public updateBullets() {
    // Update all bullet positions
    this.bullets.forEach((bullet) => {
      bullet.updatePosition(this.level);
    });

    // Remove destroyed bullets from memory
    this.bullets = this.bullets.filter((bullet) => !bullet.isDestroyed);
  }

  // currently unused
  public removeBullet(bullet: BulletClass) {
    this.bullets = this.bullets.filter((b) => b.bulletId !== bullet.bulletId);
  }

  public toJSON() {
    return {
      roomId: this.roomId,
      bullets: this.bullets.map((bullet) => bullet.toJSON()),
      players: this.players.map((player) => player.toJSON()),
      // exclude level from JSON (too big)
    };
  }
}

// External Game State - Serialised
export const gameSerializedSchema = z.object({
  roomId: z.string(),
  bullets: z.array(bulletSerialisedSchema),
  players: z.array(playerSerialisedSchema),
});
export type GameSerialized = z.infer<typeof gameSerializedSchema>;
