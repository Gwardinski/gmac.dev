import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import type { Color, Direction, Game, Player, ROOM_ID } from "./models.pew";
import { updateGamePlayerState } from "./service.game.pew";
import { generatePlayerId } from "./util.pew";

// REST Services

export function playerServiceGetById(
  roomId: ROOM_ID,
  playerId: string
): ServiceResponse<Player> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<Player>("ROOM_NOT_FOUND");
  }
  const player = game.players.find((p) => p.playerId === playerId);
  if (!player) {
    return returnServiceResponse<Player>("INVALID_PLAYER_ID");
  }
  return returnServiceResponse(player);
}

export function playerServiceGetByDeviceId(
  roomId: ROOM_ID,
  playerDeviceId: string
): ServiceResponse<Player> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<Player>("ROOM_NOT_FOUND");
  }
  const player = game.players.find((p) => p.playerDeviceId === playerDeviceId);
  console.log("playerDeviceId", playerDeviceId);
  console.log("game.players", game.players);
  console.log("player", player);
  if (!player) {
    return returnServiceResponse<Player>("INVALID_PLAYER_ID");
  }
  return returnServiceResponse(player);
}

export function playerServiceCreate(
  roomId: ROOM_ID,
  playerName: string,
  playerColour: Color,
  playerDeviceId: string
): ServiceResponse<Player> {
  const player = {
    playerId: generatePlayerId(),
    playerName,
    playerColour,
    playerDeviceId,
    x: 64,
    y: 64,
  };
  GAMES_DB.get(roomId)?.players.push(player);
  return returnServiceResponse<Player>(player);
}

// WebSocket Services

// todo provide level as parameter
export function updatePlayerPosition(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
): ServiceResponse<Game> {
  const [updatedGame, updatedGameErr] = updateGamePlayerState(
    roomId,
    playerId,
    direction
  );

  if (updatedGameErr) {
    return returnServiceResponse<Game>(updatedGameErr);
  }
  return returnServiceResponse(updatedGame);
}

export function playerFire(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
): ServiceResponse<Game> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<Game>("INVALID_ROOM_CODE");
  }
  return returnServiceResponse(game);
}

export function removePlayerFromGame(
  roomId: ROOM_ID,
  playerId: string
): ServiceResponse<Game> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<Game>("INVALID_ROOM_CODE");
  }

  const player = game.players.find((p) => p.playerId === playerId);
  if (!player) {
    return returnServiceResponse<Game>("INVALID_PLAYER_ID");
  }

  const updatedGame = {
    ...game,
    players: game.players.filter((p) => p.playerId !== playerId),
  };

  GAMES_DB.set(roomId, updatedGame);

  return returnServiceResponse(updatedGame);
}
