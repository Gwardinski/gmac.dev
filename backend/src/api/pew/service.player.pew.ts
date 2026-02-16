import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import type { Direction, ROOM_ID } from "./models/base.models.pew";
import type { GameSerialized } from "./models/game.model.pew";

import {
  getGameAndPlayer,
  updateGamePlayerFire,
  updateGamePlayerPosition,
} from "./service.game.pew";

// WebSocket Services

export function updatePlayerPosition(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
): ServiceResponse<GameSerialized> {
  const [updatedGame, updatedGameErr] = updateGamePlayerPosition(
    roomId,
    playerId,
    direction
  );
  if (updatedGameErr) {
    return returnServiceResponse<GameSerialized>(updatedGameErr);
  }
  return returnServiceResponse<GameSerialized>(updatedGame);
}

export function playerFire(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
): ServiceResponse<GameSerialized> {
  const [updatedGame, updatedGameErr] = updateGamePlayerFire(
    roomId,
    playerId,
    direction
  );
  if (updatedGameErr) {
    return returnServiceResponse<GameSerialized>(updatedGameErr);
  }
  return returnServiceResponse<GameSerialized>(updatedGame);
}

export function removePlayerFromGame(
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
