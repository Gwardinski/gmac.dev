import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import type { Game, Player, ROOM_ID } from "./models.pew";

export function getGameState(roomId: ROOM_ID): ServiceResponse<Game> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<Game>("INVALID_ROOM_CODE");
  }
  return returnServiceResponse(game);
}

export function updateGameState(
  roomId: ROOM_ID,
  gameUpdate: Partial<Game>
): ServiceResponse<Game> {
  const currentGame = GAMES_DB.get(roomId);
  if (!currentGame) {
    return returnServiceResponse<Game>("INVALID_ROOM_CODE");
  }
  const updatedGame = { ...currentGame, ...gameUpdate };
  GAMES_DB.set(roomId, updatedGame);
  return returnServiceResponse(updatedGame);
}

export function updateGamePlayerState(
  roomId: ROOM_ID,
  playerId: string,
  playerUpdate: Partial<Player>
): ServiceResponse<Game> {
  const currentGame = GAMES_DB.get(roomId);
  if (!currentGame) {
    return returnServiceResponse<Game>("INVALID_ROOM_CODE");
  }
  const currentPlayer = currentGame.players.find(
    (p) => p.playerId === playerId
  );
  if (!currentPlayer) {
    return returnServiceResponse<Game>("INVALID_PLAYER_ID");
  }
  const updatedPlayer = { ...currentPlayer, ...playerUpdate };
  GAMES_DB.set(roomId, {
    ...currentGame,
    players: currentGame.players.map((p) =>
      p.playerId === playerId ? updatedPlayer : p
    ) as Player[],
  });
  return returnServiceResponse(currentGame);
}
