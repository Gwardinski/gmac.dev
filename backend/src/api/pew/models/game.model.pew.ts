import z from "zod";
import type { Color } from "./base.models.pew";
import { BulletClass, bulletSerialisedSchema } from "./bullet.model.pew";
import { ItemClass, itemSerialisedSchema } from "./item.model.pew";
import { LevelClass } from "./level.model.pew";
import { PlayerClass, playerSerialisedSchema } from "./player.model.pew";
import type { SystemEventClass } from "./system-event.model";

// External Game State - Serialised
export const gameSerializedSchema = z.object({
  roomId: z.string(),
  bullets: z.array(bulletSerialisedSchema),
  players: z.array(playerSerialisedSchema),
  items: z.array(itemSerialisedSchema),
});
export type GameSerialized = z.infer<typeof gameSerializedSchema>;

// Internal Game State - Class based
const gameSchema = z.object({
  roomId: z.string(),
  bullets: z.array(z.instanceof(BulletClass)),
  players: z.array(z.instanceof(PlayerClass)),
  items: z.array(z.instanceof(ItemClass)),
});
export type GameModel = z.infer<typeof gameSchema>;

export class GameClass {
  constructor(
    public roomId: string,
    public level: LevelClass,
    public systemEvent: SystemEventClass
  ) {
    this.roomId = roomId;
    this.level = level;
    this.systemEvent = systemEvent;
  }

  public players: PlayerClass[] = [];
  public bullets: BulletClass[] = [];
  public items: ItemClass[] = [];

  public toJSON() {
    return {
      roomId: this.roomId,
      bullets: this.bullets.map((bullet) => bullet.toJSON()),
      players: this.players
        .filter((player) => !player.isDeleted)
        .map((player) => player.toJSON()),
      items: this.items.map((item) => item.toJSON()),
    };
  }

  /* 
    GENERAL "TICK" MANAGEMENT 
  */

  public tickCollisionTracking() {
    this.players.forEach((player) => {
      player.tickCollisionTracking();
    });

    this.bullets.forEach((bullet) => {
      bullet.tickCollisionTracking();
    });

    this.items.forEach((item) => {
      item.tickCollisionTracking();
    });
  }

  public tickRespawnPlayers() {
    this.players
      .filter((p) => p.inDeathCycle)
      .forEach((p) => {
        if (p.canHandleRespawnState1()) {
          const spawnPoint = this.getPlayerSpawnPoint();
          p.handleRespawnState1(spawnPoint);
          return;
        }
        if (p.canHandleRespawnState2()) {
          p.handleRespawnState2();
          return;
        }
        if (p.canHandleRespawnState3()) {
          p.handleRespawnState3();
        }
      });
  }

  public tickCleanupDeletedPlayers() {
    this.players.forEach((p) => {
      if (p.shouldBeRemoved()) {
        this.deletePlayer(p.id);
      }
    });
  }

  public tickBulletPositionAndCollisions() {
    if (this.bullets.length === 0) {
      return;
    }
    this.bullets.forEach((bullet) => {
      bullet.updateServerPosition(this.level.level);
    });
    this.checkBulletPlayerCollisions();
    this.bullets = this.bullets.filter((bullet) => !bullet.isDestroyed);
  }

  public tickItemSpawns() {
    this.checkItemPlayerCollisions();
    if (this.items.length >= this.level.maxItems) {
      return;
    }
    if (
      this.level.itemLastSpawnTimestamp + this.level.itemSpawnInterval >
      Date.now()
    ) {
      return;
    }
    const itemSpawnPoint =
      this.level.itemSpawnPoints[
        Math.floor(Math.random() * this.level.itemSpawnPoints.length)
      ];
    if (!itemSpawnPoint) {
      return;
    }
    const item = new ItemClass(itemSpawnPoint.x, itemSpawnPoint.y, "Big Gun");
    this.items.push(item);
    this.systemEvent.itemSpawnEvent(item);
  }

  /* 
    PLAYER MANAGEMENT 
  */

  public spawnNewPlayer(
    playerDeviceId: string,
    playerName: string,
    playerColour: Color
  ): PlayerClass {
    const { x, y } = this.getPlayerSpawnPoint();
    const player = new PlayerClass(
      playerDeviceId,
      playerName,
      playerColour,
      x,
      y
    );

    this.players.push(player);
    this.systemEvent.playerJoinEvent(player);
    return player;
  }

  public markPlayerAsDeleted(player: PlayerClass) {
    player.markAsDeleted();
    this.bullets = this.bullets.filter((b) => b.playerId !== player.id);
    this.systemEvent.playerLeaveEvent(player);
  }

  public deletePlayer(playerId: string) {
    this.players = this.players.filter((p) => p.id !== playerId);
    this.bullets = this.bullets.filter((b) => b.playerId !== playerId);
  }

  public restorePlayer(playerId: string) {
    const playerIndex = this.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1 || !this.players[playerIndex]) {
      return;
    }
    this.systemEvent.playerRejoinEvent(this.players[playerIndex]);
    this.players[playerIndex].restore();
  }

  public updatePlayerNameAndColour(
    playerId: string,
    name: string,
    colour: Color
  ) {
    this.players.forEach((p) => {
      if (p.id === playerId) {
        p.updateName(name);
        p.updateColour(colour);
      }
    });
  }

  public getPlayerSpawnPoint() {
    return (
      this.level.playerSpawnPoints[
        Math.floor(Math.random() * this.level.playerSpawnPoints.length)
      ] ?? { x: 128, y: 128 }
    );
  }

  /*
    BULLET MANAGEMENT
  */

  public addBullet(bullet: BulletClass) {
    this.bullets.push(bullet);
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
          player.id === bullet.playerId
        ) {
          continue;
        }

        if (bullet.onCollisionEnter(player)) {
          const died = player.takeDamage(bullet.damage);
          if (died) {
            const killer = this.players.find((p) => p.id === bullet.playerId);
            if (!killer) {
              continue;
            }
            killer.incrementKillCount(player.id);
            this.systemEvent.playerDeathEvent(killer, player);
          }
          bullet.destroy();
          break;
        }
      }
    }
  }

  /*
    ITEM MANAGEMENT
  */

  public checkItemPlayerCollisions() {
    const itemsToRemove: string[] = [];

    for (const item of this.items) {
      for (const player of this.players) {
        if (player.isDestroyed || player.isSpawning || player.isDeleted) {
          continue;
        }

        if (item.onCollisionEnter(player)) {
          player.increaseFireDelay();
          itemsToRemove.push(item.id);
          this.systemEvent.itemPickedUpEvent(player, item);
          this.level.itemLastSpawnTimestamp = Date.now();
          break; // Only one player
        }
      }
    }

    if (itemsToRemove.length > 0) {
      this.items = this.items.filter(
        (item) => !itemsToRemove.includes(item.id)
      );
    }
  }

  // Utility Methods
}
