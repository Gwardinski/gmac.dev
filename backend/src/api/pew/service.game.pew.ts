import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import { type Direction, type ROOM_ID } from "./models/base.models.pew";
import { BulletClass, getBulletSpawnPoint } from "./models/bullet.model.pew";
import type { GameSerialized } from "./models/game.model.pew";
import { LEVEL_1 } from "./models/level.model.pew";

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
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<GameSerialized>("INVALID_ROOM_CODE");
  }
  const player = game.players.find((p) => p.playerId === playerId);
  if (!player) {
    return returnServiceResponse<GameSerialized>("INVALID_PLAYER_ID");
  }

  game.removePlayer(player);

  return returnServiceResponse<GameSerialized>(game.toJSON());
}

export function updateGamePlayerPosition(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
): ServiceResponse<GameSerialized> {
  const currentGame = GAMES_DB.get(roomId);
  if (!currentGame) {
    return returnServiceResponse<GameSerialized>("INVALID_ROOM_CODE");
  }
  const currentPlayer = currentGame.players.find(
    (p) => p.playerId === playerId
  );
  if (!currentPlayer) {
    return returnServiceResponse<GameSerialized>("INVALID_PLAYER_ID");
  }

  currentPlayer.updatePosition(direction, LEVEL_1);

  return returnServiceResponse(currentGame.toJSON());
}

export function updateGamePlayerFire(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
): ServiceResponse<GameSerialized> {
  const currentGame = GAMES_DB.get(roomId);
  if (!currentGame) {
    return returnServiceResponse<GameSerialized>("INVALID_ROOM_CODE");
  }
  const currentPlayer = currentGame.players.find(
    (p) => p.playerId === playerId
  );
  if (!currentPlayer) {
    return returnServiceResponse<GameSerialized>("INVALID_PLAYER_ID");
  }

  if (!currentPlayer.canFire()) {
    return returnServiceResponse<GameSerialized>(currentGame.toJSON());
  }

  currentPlayer.fire();

  const { x, y } = getBulletSpawnPoint(currentPlayer, direction);

  const newBullet = new BulletClass(roomId, playerId, x, y, direction);

  currentGame.addBullet(newBullet);

  return returnServiceResponse<GameSerialized>(currentGame.toJSON());
}

export function addMessageToGameState(
  roomId: ROOM_ID,
  playerId: string,
  messageContent: string
): ServiceResponse<GameSerialized> {
  const currentGame = GAMES_DB.get(roomId);
  if (!currentGame) {
    return returnServiceResponse<GameSerialized>("INVALID_ROOM_CODE");
  }
  const player = currentGame.players.find((p) => p.playerId === playerId);
  if (!player) {
    return returnServiceResponse<GameSerialized>("INVALID_PLAYER_ID");
  }
  currentGame.addMessage(player, messageContent);
  return returnServiceResponse<GameSerialized>(currentGame.toJSON());
}
