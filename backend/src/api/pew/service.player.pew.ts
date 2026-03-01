import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import type { Bearing, ROOM_ID } from "./models/base.models.pew";
import type { GameSerialized } from "./models/game.model.pew";

import {
  getGameAndPlayer,
  updateGamePlayerFire,
  updateGamePlayerPosition,
  updateGamePlayerPositionFromClient,
} from "./service.game.pew";

// WebSocket Services

export function playerMove(
  roomId: ROOM_ID,
  playerId: string,
  bearing: Bearing
): ServiceResponse<GameSerialized> {
  const [updatedGame, updatedGameErr] = updateGamePlayerPosition(
    roomId,
    playerId,
    bearing
  );
  if (updatedGameErr) {
    return returnServiceResponse<GameSerialized>(updatedGameErr);
  }
  return returnServiceResponse<GameSerialized>(updatedGame);
}

/** Apply client-sent position after server-side collision check. */
export function playerSetPosition(
  roomId: ROOM_ID,
  playerId: string,
  x: number,
  y: number,
  bearing: Bearing
): ServiceResponse<GameSerialized> {
  const [updatedGame, updatedGameErr] = updateGamePlayerPositionFromClient(
    roomId,
    playerId,
    x,
    y,
    bearing
  );
  if (updatedGameErr) {
    return returnServiceResponse<GameSerialized>(updatedGameErr);
  }
  return returnServiceResponse<GameSerialized>(updatedGame);
}

export function playerFire(
  roomId: ROOM_ID,
  playerId: string,
  bearing: Bearing
): ServiceResponse<GameSerialized> {
  const [updatedGame, updatedGameErr] = updateGamePlayerFire(
    roomId,
    playerId,
    bearing
  );
  if (updatedGameErr) {
    return returnServiceResponse<GameSerialized>(updatedGameErr);
  }
  return returnServiceResponse<GameSerialized>(updatedGame);
}

export function markPlayerForDeletion(
  roomId: ROOM_ID,
  playerId: string
): ServiceResponse<GameSerialized> {
  const [gameAndPlayer, error] = getGameAndPlayer(roomId, playerId);
  if (error) {
    return returnServiceResponse<GameSerialized>(error);
  }
  const { game, player } = gameAndPlayer;

  if (!player.isDeleted) {
    game.markPlayerAsDeleted(player);
  }

  return returnServiceResponse<GameSerialized>(game.toJSON());
}
