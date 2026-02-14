import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import { LEVEL_1 } from "./levels.pew";
import { type Direction, type ROOM_ID } from "./models/base.models.pew";
import { BulletClass, getBulletSpawnPoint } from "./models/bullet.model.pew";
import type { GameSerialized } from "./models/game.model.pew";

export function getGameSerialisedState(
  roomId: ROOM_ID
): ServiceResponse<GameSerialized> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<GameSerialized>("INVALID_ROOM_CODE");
  }
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

  const newBullet = new BulletClass(playerId, x, y, direction);

  currentGame.addBullet(newBullet);

  return returnServiceResponse<GameSerialized>(currentGame.toJSON());
}
