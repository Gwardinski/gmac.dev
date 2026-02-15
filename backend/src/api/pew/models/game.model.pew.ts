import z from "zod";
import { BulletClass, bulletSerialisedSchema } from "./bullet.model.pew";
import type { SystemEvent } from "./chat.model.pew";
import { type Level } from "./level.model.pew";
import { PlayerClass, playerSerialisedSchema } from "./player.model.pew";

const PLAYER_RESPAWN_TIME = 3000;

// Internal Game State - Class based
const gameSchema = z.object({
  roomId: z.string(),
  bullets: z.array(z.instanceof(BulletClass)),
  players: z.array(z.instanceof(PlayerClass)),
});
export type GameModel = z.infer<typeof gameSchema>;

export class GameClass {
  constructor(
    public roomId: string,
    public level: Level,
    onSystemEvent?: (event: SystemEvent) => void
  ) {
    this.roomId = roomId;
    this.level = level;
    this.players = [];
    this.bullets = [];
    this.onSystemEvent = onSystemEvent;
  }

  public players: PlayerClass[];
  public bullets: BulletClass[];
  private onSystemEvent?: (event: SystemEvent) => void;

  public setSystemEventHandler(handler: (event: SystemEvent) => void) {
    this.onSystemEvent = handler;
  }

  public addPlayer(player: PlayerClass) {
    this.players.push(player);

    if (this.onSystemEvent) {
      this.onSystemEvent({
        type: "player-join",
        playerId: player.playerId,
        playerName: player.playerName,
        playerColour: player.playerColour,
      });
    }
  }

  public removePlayer(player: PlayerClass) {
    if (this.onSystemEvent) {
      this.onSystemEvent({
        type: "player-leave",
        playerId: player.playerId,
        playerName: player.playerName,
        playerColour: player.playerColour,
      });
    }

    this.players = this.players.filter((p) => p !== player);
    this.bullets = this.bullets.filter((b) => b.playerId !== player.playerId);
  }

  public addBullet(bullet: BulletClass) {
    this.bullets.push(bullet);
  }

  public updateBullets() {
    this.bullets.forEach((bullet) => {
      bullet.updatePosition(this.level);
    });

    this.checkBulletPlayerCollisions();

    // Clean up
    this.bullets = this.bullets.filter((bullet) => !bullet.isDestroyed);
  }

  public respawnPlayers() {
    const timestamp = Date.now();
    this.players.forEach((p) => {
      if (p.isDestroyed && p.deathTimestamp + PLAYER_RESPAWN_TIME < timestamp) {
        p.respawn({
          x: 64,
          y: 64,
        });
      }
    });
  }

  private checkBulletPlayerCollisions() {
    for (const bullet of this.bullets) {
      if (bullet.isDestroyed) {
        continue;
      }
      for (const player of this.players) {
        if (player.isDestroyed || player.playerId === bullet.playerId) {
          continue;
        }

        if (isBulletHittingPlayer(bullet, player)) {
          const died = player.takeDamage(bullet.damage);
          if (died) {
            const killer = this.players.find(
              (p) => p.playerId === bullet.playerId
            );

            // Emit death event
            if (this.onSystemEvent && killer) {
              this.onSystemEvent({
                type: "player-death",
                killerId: killer.playerId,
                killerName: killer.playerName,
                killerColour: killer.playerColour,
                victimId: player.playerId,
                victimName: player.playerName,
              });
            }

            killer?.incrementKillCount(player.playerId);
          }
          bullet.destroy();
          break;
        }
      }
    }
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

// External Game State - Serialised (messages moved to separate store)
export const gameSerializedSchema = z.object({
  roomId: z.string(),
  bullets: z.array(bulletSerialisedSchema),
  players: z.array(playerSerialisedSchema),
});
export type GameSerialized = z.infer<typeof gameSerializedSchema>;

function isBulletHittingPlayer(
  bullet: BulletClass,
  player: PlayerClass
): boolean {
  const bulletBounds = bullet.getBounds();
  const playerPos = player.getPositions();

  // Simple AABB (Axis-Aligned Bounding Box) collision detection
  const bulletRight = bulletBounds.x + bulletBounds.size;
  const bulletBottom = bulletBounds.y + bulletBounds.size;
  const playerRight = playerPos.x + player.playerSize;
  const playerBottom = playerPos.y + player.playerSize;

  return (
    bulletBounds.x < playerRight &&
    bulletRight > playerPos.x &&
    bulletBounds.y < playerBottom &&
    bulletBottom > playerPos.y
  );
}
