import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import type { Color, Direction, Game, Player, ROOM_ID } from "./models.pew";
import { generatePlayerId } from "./util.pew";

// REST Services

export function playerServiceGet(
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

export function playerServiceCreate(
  roomId: ROOM_ID,
  playerName: string,
  playerColour: Color
): ServiceResponse<Player> {
  const player = {
    playerId: generatePlayerId(),
    playerName,
    playerColour,
    x: 0,
    y: 0,
  };
  GAMES_DB.get(roomId)?.players.push(player);
  return returnServiceResponse<Player>(player);
}

// WebSocket Services

export function updatePlayerPosition(
  roomId: ROOM_ID,
  playerId: string,
  direction: Direction
): ServiceResponse<Game> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<Game>("INVALID_ROOM_CODE");
  }

  const player = game.players.find((p) => p.playerId === playerId);
  if (!player) {
    return returnServiceResponse<Game>("INVALID_PLAYER_ID");
  }

  // Update position based on direction
  switch (direction) {
    case "UP":
      player.y -= 4;
      break;
    case "DOWN":
      player.y += 4;
      break;
    case "LEFT":
      player.x -= 4;
      break;
    case "RIGHT":
      player.x += 4;
      break;
  }

  const updatedGame = {
    ...game,
    players: game.players.map((p) =>
      p.playerId === playerId ? { ...p, ...player } : p
    ),
  };

  GAMES_DB.set(roomId, updatedGame);

  return returnServiceResponse(game);
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

  if (updatedGame.players.length === 0) {
    GAMES_DB.delete(roomId);
  }

  return returnServiceResponse(updatedGame);
}

// Existing Player logic, re-add later

// const game = GAMES_DB.get(roomId);
// if (!game) {
//   return returnServiceResponse<Game>("INVALID_ROOM_CODE");
// }

// // check player is new or existing
// const existingPlayer = game.players.find(
//   (player) => player.playerId === playerId
// );

// const existingPlayerName = existingPlayer?.playerName === playerName;

// // player has reconnected to their previous session
// if (existingPlayer && existingPlayerName) {
//   console.log(
//     `Existing Player ${existingPlayer.playerName}|${existingPlayer.playerId} has reconnected.`
//   );
//   // return existing game state
//   return returnServiceResponse(game);
// }

// // player has reconnected to their previous session but has a new name
// if (existingPlayer && !existingPlayerName) {
//   console.log(
//     `Existing Player ${existingPlayer.playerName}|${existingPlayer.playerId} has reconnected as: ${playerName}`
//   );
//   // delete their old player from session and create new player for them
//   // For now, just update their name
//   existingPlayer.playerName = playerName;
//   existingPlayer.playerColour = playerColour as any;

//   // update existing player in game state
//   const updatedGame = {
//     ...game,
//     players: game.players.map((p) =>
//       p.playerId === playerId ? { ...p, ...existingPlayer } : p
//     ),
//   };
//   // set new game state
//   GAMES_DB.set(roomId, updatedGame);

//   return returnServiceResponse(updatedGame);
// }

// // new player joining the session
// if (!existingPlayer) {
//   console.log(`New Player ${playerName}|${playerId} has joined the session.`);
//   // create new player for them
//   const updatedGame = {
//     ...game,
//     players: [
//       ...game.players,
//       {
//         playerId,
//         playerName,
//         playerColour: playerColour as any,
//         x: 0,
//         y: 0,
//       },
//     ],
//   };
//   // set new game state
//   GAMES_DB.set(roomId, updatedGame);

//   return returnServiceResponse(updatedGame);
// }

// // edge case?
// console.error(`this probably shouldn't log?`);
// return returnServiceResponse(game);
