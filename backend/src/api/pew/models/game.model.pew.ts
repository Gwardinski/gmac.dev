import z from "zod";
import type { Color } from "./base.models.pew";
import { BulletClass, bulletSerialisedSchema } from "./bullet.model.pew";
import type { SystemEvent } from "./chat.model.pew";
import { LevelClass } from "./level.model.pew";
import { PlayerClass, playerSerialisedSchema } from "./player.model.pew";

const PLAYER_DEATH_TIME = 2000;
const PLAYER_SPAWN_TIME = 1200;
const PLAYER_INVINCIBILITY_TIME = 1600;

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
    public level: LevelClass,
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

  /* 
    PLAYER MANAGEMENT 
  */

  public spawnNewPlayer(
    playerDeviceId: string,
    playerName: string,
    playerColour: Color
  ): PlayerClass {
    const { x, y } = this.getSpawnPoint(this.level);
    const player = new PlayerClass(
      playerDeviceId,
      playerName,
      playerColour,
      x,
      y
    );

    this.players.push(player);

    if (this.onSystemEvent) {
      this.onSystemEvent({
        type: "player-join",
        playerId: player.playerId,
        playerName: player.playerName,
        playerColour: player.playerColour,
      });
    }

    return player;
  }

  // mark for deletion, allow to reconnect
  public removePlayer(player: PlayerClass) {
    if (this.onSystemEvent) {
      this.onSystemEvent({
        type: "player-leave",
        playerId: player.playerId,
        playerName: player.playerName,
        playerColour: player.playerColour,
      });
    }
    // Mark as deleted instead of removing immediately - allows for reconnection
    player.markAsDeleted();
    this.bullets = this.bullets.filter((b) => b.playerId !== player.playerId);
  }

  // hard delete
  public deletePlayer(playerId: string) {
    this.players = this.players.filter((p) => p.playerId !== playerId);
    this.bullets = this.bullets.filter((b) => b.playerId !== playerId);
  }

  public restorePlayer(playerId: string) {
    const playerIndex = this.players.findIndex((p) => p.playerId === playerId);
    if (playerIndex === -1 || !this.players[playerIndex]) {
      return;
    }
    this.players[playerIndex].restore();
  }

  public cleanupDeletedPlayers() {
    this.players.forEach((p) => {
      if (p.shouldBeRemoved()) {
        this.deletePlayer(p.playerId);
      }
    });
  }

  public updatePlayerNameAndColour(
    playerId: string,
    name: string,
    colour: Color
  ) {
    this.players.forEach((p) => {
      if (p.playerId === playerId) {
        p.updateName(name);
        p.updateColour(colour);
      }
    });
  }

  public addBullet(bullet: BulletClass) {
    this.bullets.push(bullet);
  }

  public updateBullets() {
    this.bullets.forEach((bullet) => {
      bullet.updatePosition(this.level.level);
    });

    this.checkBulletPlayerCollisions();

    // Clean up
    this.bullets = this.bullets.filter((bullet) => !bullet.isDestroyed);
  }

  public respawnPlayers() {
    const timestamp = Date.now();
    this.players.forEach((p) => {
      //  note: always check in this order: spawning, invincibility, destroyed
      if (p.isSpawning && p.spawnTimestamp + PLAYER_SPAWN_TIME < timestamp) {
        p.respawn();
      }

      if (
        p.isInvincible &&
        p.invincibilityTimestamp + PLAYER_INVINCIBILITY_TIME < timestamp
      ) {
        p.endInvincibility();
      }

      if (p.isDestroyed && p.deathTimestamp + PLAYER_DEATH_TIME < timestamp) {
        const spawnPoint = this.getSpawnPoint(this.level);
        p.beginRespawn(spawnPoint);
      }
    });
  }

  // remove param
  public getSpawnPoint(level: LevelClass) {
    return (
      level.spawnPoints[
        Math.floor(Math.random() * level.spawnPoints.length)
      ] ?? { x: 128, y: 128 }
    );
  }

  private checkBulletPlayerCollisions() {
    for (const bullet of this.bullets) {
      if (bullet.isDestroyed) {
        continue;
      }
      for (const player of this.players) {
        if (
          player.isDestroyed ||
          player.isSpawning ||
          player.isInvincible ||
          player.playerId === bullet.playerId
        ) {
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
                victimColour: player.playerColour,
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
      // Filter out deleted players from serialized output
      players: this.players
        .filter((player) => !player.isDeleted)
        .map((player) => player.toJSON()),
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
