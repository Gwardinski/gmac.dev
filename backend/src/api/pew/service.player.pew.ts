import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import type { Color, Direction, ROOM_ID } from "./models/base.models.pew";
import type { GameSerialized } from "./models/game.model.pew";
import { PlayerClass, type PlayerSerialised } from "./models/player.model.pew";

import {
  updateGamePlayerFire,
  updateGamePlayerPosition,
} from "./service.game.pew";

// REST Services

export function playerServiceGetSerialisedById(
  roomId: ROOM_ID,
  playerId: string
): ServiceResponse<PlayerSerialised> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<PlayerSerialised>("ROOM_NOT_FOUND");
  }
  const player = game.players.find((p) => p.playerId === playerId);
  if (!player) {
    return returnServiceResponse<PlayerSerialised>("INVALID_PLAYER_ID");
  }
  return returnServiceResponse(player.toJSON());
}

export function playerServiceGetSerialisedByDeviceId(
  roomId: ROOM_ID,
  playerDeviceId: string
): ServiceResponse<PlayerSerialised> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<PlayerSerialised>("ROOM_NOT_FOUND");
  }
  const player = game.players.find((p) => p.playerDeviceId === playerDeviceId);

  if (!player) {
    return returnServiceResponse<PlayerSerialised>("INVALID_PLAYER_ID");
  }
  return returnServiceResponse(player.toJSON());
}

export function playerServiceCreate(
  roomId: ROOM_ID,
  playerName: string,
  playerColour: Color,
  playerDeviceId: string
): ServiceResponse<PlayerSerialised> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<PlayerSerialised>("ROOM_NOT_FOUND");
  }

  const spawnPoint = game.getSpawnPoint(game.level);
  const player = new PlayerClass(
    playerDeviceId,
    playerName,
    playerColour,
    spawnPoint.x,
    spawnPoint.y
  );
  game.addPlayer(player);

  return returnServiceResponse<PlayerSerialised>(player.toJSON());
}

// WebSocket Services

// todo provide level as parameter
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
