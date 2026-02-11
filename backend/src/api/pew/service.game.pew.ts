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

  // new position
  let newX = currentPlayer.x + xMod;
  let newY = currentPlayer.y + yMod;

  // new 4 corners of the player
  const topLeft = { x: newX, y: newY };
  const topRight = { x: newX + playerWidth, y: newY };
  const bottomLeft = { x: newX, y: newY + playerHeight };
  const bottomRight = {
    x: newX + playerWidth,
    y: newY + playerHeight,
  };

  // grid coordinates of the new 4 corners of the player
  const topLeftGrid = {
    x: Math.floor(topLeft.x / 16),
    y: Math.floor(topLeft.y / 16),
  };
  const topRightGrid = {
    x: Math.floor(topRight.x / 16),
    y: Math.floor(topRight.y / 16),
  };
  const bottomLeftGrid = {
    x: Math.floor(bottomLeft.x / 16),
    y: Math.floor(bottomLeft.y / 16),
  };
  const bottomRightGrid = {
    x: Math.floor(bottomRight.x / 16),
    y: Math.floor(bottomRight.y / 16),
  };

  // Check grid coordinates, is new position in a wall?
  const isInWall =
    level1[topLeftGrid.y]?.[topLeftGrid.x] === 2 ||
    level1[topRightGrid.y]?.[topRightGrid.x] === 2 ||
    level1[bottomLeftGrid.y]?.[bottomLeftGrid.x] === 2 ||
    level1[bottomRightGrid.y]?.[bottomRightGrid.x] === 2;

  if (isInWall) {
    console.log("collision detected");
    // todo: current position + pixels to move = inside wall
    // so check pixels to move - 1, 2, 3, etc while less than pixels to move
    // once found value to not be in wall, snap player that position to hug wall

    newX = currentPlayer.x;
    newY = currentPlayer.y;
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
