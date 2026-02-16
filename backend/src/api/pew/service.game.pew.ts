import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import { type Direction, type ROOM_ID } from "./models/base.models.pew";
import { BulletClass, getBulletSpawnPoint } from "./models/bullet.model.pew";
import type { GameClass, GameSerialized } from "./models/game.model.pew";
import { LEVEL_1 } from "./models/level.model.pew";
import type { PlayerClass } from "./models/player.model.pew";

// REST Services

export function getGameState(roomId: ROOM_ID): ServiceResponse<GameClass> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<GameClass>("INVALID_ROOM_CODE");
  }
  return returnServiceResponse<GameClass>(game);
}

// Helper Service

type GameAndPlayer = {
  game: GameClass;
  player: PlayerClass;
};
export function getGameAndPlayer(
  roomId: ROOM_ID,
  playerId: string
): ServiceResponse<GameAndPlayer> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<GameAndPlayer>("INVALID_ROOM_CODE");
  }
  const player = game.players.find((p) => p.playerId === playerId);
  if (!player) {
    return returnServiceResponse<GameAndPlayer>("INVALID_PLAYER_ID");
  }
  return returnServiceResponse<GameAndPlayer>({ game, player });
}

// WebSocket Services

export function getGameSerialisedState(
  roomId: ROOM_ID
): ServiceResponse<GameSerialized> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<GameSerialized>("INVALID_ROOM_CODE");
  }
  return returnServiceResponse<GameSerialized>(game.toJSON());
}

export function removeGamePlayer(
  roomId: ROOM_ID,
  playerId: string
): ServiceResponse<GameSerialized> {
  const [gameAndPlayer, error] = getGameAndPlayer(roomId, playerId);
  if (error) {
    return returnServiceResponse<GameSerialized>(error);
  }

  const { game, player } = gameAndPlayer;

  game.removePlayer(player);

  return returnServiceResponse<GameSerialized>(game.toJSON());
}

export function updateGamePlayerPosition(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
): ServiceResponse<GameSerialized> {
  const [gameAndPlayer, error] = getGameAndPlayer(roomId, playerId);
  if (error) {
    return returnServiceResponse<GameSerialized>(error);
  }

  const { game, player } = gameAndPlayer;

  player.updatePosition(direction, LEVEL_1);

  return returnServiceResponse(game.toJSON());
}

export function updateGamePlayerFire(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
): ServiceResponse<GameSerialized> {
  const [gameAndPlayer, error] = getGameAndPlayer(roomId, playerId);
  if (error) {
    return returnServiceResponse<GameSerialized>(error);
  }

  const { game, player } = gameAndPlayer;

  if (!player.canFire()) {
    return returnServiceResponse<GameSerialized>(game.toJSON());
  }

  player.fire();

  const { x, y } = getBulletSpawnPoint(player, direction);

  const newBullet = new BulletClass(roomId, playerId, x, y, direction);

  game.addBullet(newBullet);

  return returnServiceResponse<GameSerialized>(game.toJSON());
}
