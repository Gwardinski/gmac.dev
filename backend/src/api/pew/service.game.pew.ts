import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import { level1 } from "./levels.pew";
import type { Direction, Game, Player, ROOM_ID } from "./models.pew";

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

const playerHeight = 16;
const playerWidth = 16;
export function updateGamePlayerState(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
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

  let xMod = 0;
  let yMod = 0;

  switch (direction) {
    case "UP":
      yMod = -1;
      break;
    case "DOWN":
      yMod = 1;
      break;
    case "LEFT":
      xMod = -1;
      break;
    case "RIGHT":
      xMod = 1;
      break;
  }

  // collision detect
  let newX = currentPlayer.x + xMod;
  let newY = currentPlayer.y + yMod;

  // Determine which edge of the player to check based on direction
  const checkX =
    direction === "LEFT"
      ? newX // Check left edge
      : direction === "RIGHT"
      ? newX + playerWidth // Check right edge
      : newX; // Check current x for horizontal movement

  const checkY =
    direction === "UP"
      ? newY // Check top edge
      : direction === "DOWN"
      ? newY + playerHeight // Check bottom edge
      : newY; // Check current y for vertical movement

  // Convert pixel coordinates to grid coordinates
  const gridX = Math.floor(checkX / 16);
  const gridY = Math.floor(checkY / 16);

  // Check if the position is in a wall
  const isInWall = level1[gridY]?.[gridX] === 2;

  if (isInWall) {
    console.log("collision detected");
    // Move as close to the wall as possible
    switch (direction) {
      case "UP":
        // Align to the bottom edge of the wall tile above
        newY = (gridY + 1) * 16;
        break;
      case "DOWN":
        // Align to the top edge of the wall tile below (minus player height)
        newY = gridY * 16 - playerHeight;
        break;
      case "LEFT":
        // Align to the right edge of the wall tile to the left
        newX = (gridX + 1) * 16;
        break;
      case "RIGHT":
        // Align to the left edge of the wall tile to the right (minus player width)
        newX = gridX * 16 - playerWidth;
        break;
    }
  }

  const updatedPlayer = {
    ...currentPlayer,
    x: newX,
    y: newY,
  };

  const updatedGame = {
    ...currentGame,
    players: currentGame.players.map((p) =>
      p.playerId === playerId ? updatedPlayer : p
    ) as Player[],
  };

  GAMES_DB.set(roomId, updatedGame);

  // Return the updated game, not the old one
  return returnServiceResponse(updatedGame);
}
