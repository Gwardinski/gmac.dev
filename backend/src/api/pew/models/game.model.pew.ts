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
    this.bullets = this.bullets.filter((b) => b.playerId !== player.playerId);
    this.systemEvent.playerLeaveEvent(player);
  }

  public cleanupDeletedPlayers() {
    this.players.forEach((p) => {
      if (p.shouldBeRemoved()) {
        this.deletePlayer(p.playerId);
      }
    });
  }

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

  public respawnPlayers() {
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

  public updateBullets() {
    if (this.bullets.length === 0) {
      return;
    }
    this.bullets.forEach((bullet) => {
      bullet.updatePosition(this.level.level);
    });
    this.checkBulletPlayerCollisions();
    this.bullets = this.bullets.filter((bullet) => !bullet.isDestroyed);
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
            if (!killer) {
              continue;
            }
            killer.incrementKillCount(player.playerId);
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

  public updateItems() {
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
    this.level.itemLastSpawnTimestamp = Date.now();
  }

  public checkItemPlayerCollisions() {
    const itemsToRemove: string[] = [];

    for (const item of this.items) {
      for (const player of this.players) {
        if (player.isDestroyed || player.isSpawning || player.isDeleted) {
          continue;
        }

        if (isItemHittingPlayer(item, player)) {
          player.increaseFireDelay();
          itemsToRemove.push(item.itemId);
          this.systemEvent.itemPickedUpEvent(player, item);
          break; // Only one player
        }
      }
    }

    if (itemsToRemove.length > 0) {
      this.items = this.items.filter(
        (item) => !itemsToRemove.includes(item.itemId)
      );
    }
  }

  // Utility Methods
}

function isBulletHittingPlayer(
  bullet: BulletClass,
  player: PlayerClass
): boolean {
  const bulletBounds = bullet.getBounds();
  const playerPos = player.getPositions();

  // AABB (Axis-Aligned Bounding Box) collision detection
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

function isItemHittingPlayer(item: ItemClass, player: PlayerClass): boolean {
  const itemBounds = item.getBounds();
  const playerPos = player.getPositions();

  // AABB (Axis-Aligned Bounding Box) collision detection
  const itemRight = itemBounds.x + itemBounds.size;
  const itemBottom = itemBounds.y + itemBounds.size;
  const playerRight = playerPos.x + player.playerSize;
  const playerBottom = playerPos.y + player.playerSize;

  return (
    itemBounds.x < playerRight &&
    itemRight > playerPos.x &&
    itemBounds.y < playerBottom &&
    itemBottom > playerPos.y
  );
}
