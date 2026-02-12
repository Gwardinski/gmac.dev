import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import { level1 } from "./levels.pew";
import {
  PLAYER_FIRE_DELAY,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  type Bullet,
  type Direction,
  type Game,
  type Player,
  type ROOM_ID,
} from "./models.pew";
import { generateBulletId } from "./util.pew";

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

export function updateGamePlayerPosition(
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
  const topRight = { x: newX + PLAYER_WIDTH, y: newY };
  const bottomLeft = { x: newX, y: newY + PLAYER_HEIGHT };
  const bottomRight = {
    x: newX + PLAYER_WIDTH,
    y: newY + PLAYER_HEIGHT,
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

export function updateGamePlayerFire(
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

  // Check if enough time has passed since last fire
  const currentTime = Date.now();
  const timeSinceLastFire = currentTime - currentPlayer.lastFireTime;

  if (timeSinceLastFire < PLAYER_FIRE_DELAY) {
    return returnServiceResponse(currentGame);
  }

  const { x, y } = getBulletSpawnPoint(currentPlayer, direction);

  const newBullet: Bullet = {
    bulletId: generateBulletId(),
    playerId,
    x,
    y,
    direction,
  };

  const updatedGame = {
    ...currentGame,
    players: currentGame.players.map((p) =>
      p.playerId === playerId ? { ...p, lastFireTime: currentTime } : p
    ) as Player[],
    bullets: [...currentGame.bullets, newBullet],
  };

  GAMES_DB.set(roomId, updatedGame);

  // Return the updated game, not the old one
  return returnServiceResponse(updatedGame);
}

// spawn point mid point on any 4 sides of the player based on direction
function getBulletSpawnPoint(player: Player, direction: Direction) {
  switch (direction) {
    case "UP":
      return { x: player.x + PLAYER_WIDTH / 2, y: player.y };
    case "DOWN":
      return { x: player.x + PLAYER_WIDTH / 2, y: player.y + PLAYER_HEIGHT };
    case "LEFT":
      return { x: player.x, y: player.y + PLAYER_HEIGHT / 2 };
    case "RIGHT":
      return { x: player.x + PLAYER_WIDTH, y: player.y + PLAYER_HEIGHT / 2 };
    default:
      // Fallback to right direction if invalid direction provided
      return { x: player.x + PLAYER_WIDTH, y: player.y + PLAYER_HEIGHT / 2 };
  }
}
