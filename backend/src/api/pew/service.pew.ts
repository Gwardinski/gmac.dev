import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB, ROOMS_DB } from "./db.pew";
import type {
  Direction,
  Game,
  Room,
  ROOM_ID,
  RoomJoinRequestModel,
  RoomJoinResponseModel,
  RoomListModel,
} from "./models.pew";
import { generateId } from "./pew.util";

// REST Services

export function listRooms(): ServiceResponse<RoomListModel[]> {
  const roomList = Array.from(ROOMS_DB.values()).map(({ roomId, roomName }) => {
    const room: RoomListModel = {
      roomName,
      playerCount: GAMES_DB.get(roomId)?.players.length ?? 0,
    };
    return room;
  });
  return returnServiceResponse(roomList);
}

export function joinRoom(
  params: RoomJoinRequestModel
): ServiceResponse<RoomJoinResponseModel> {
  const { roomName, roomCode } = params;

  const existingRoom = ROOMS_DB.values().find(
    (room) => room.roomName === roomName
  );

  // Rooms exists, check code and return rooms id for use with websockets
  if (existingRoom) {
    if (existingRoom.roomCode !== roomCode) {
      return returnServiceResponse<RoomJoinResponseModel>("INVALID_ROOM_CODE");
    }

    return returnServiceResponse({ roomId: existingRoom.roomId });
  }

  // Rooms does not exist, create a new room and new game
  const roomId = generateId();
  const room: Room = {
    roomId,
    roomName,
    roomCode,
  };
  const game: Game = {
    roomId,
    players: [],
  };
  ROOMS_DB.set(roomId, room);
  GAMES_DB.set(roomId, game);

  return returnServiceResponse({ roomId });
}

export function getGameState(roomId: ROOM_ID): ServiceResponse<Game> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<Game>("INVALID_ROOM_CODE");
  }
  return returnServiceResponse(game);
}

// WebSocket Services

export function connectPlayerToGame(
  roomId: ROOM_ID,
  playerId: string,
  playerName: string,
  playerColour: string
): ServiceResponse<Game> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<Game>("INVALID_ROOM_CODE");
  }

  // check player is new or existing
  const existingPlayer = game.players.find(
    (player) => player.playerId === playerId
  );

  const existingPlayerName = existingPlayer?.playerName === playerName;

  // player has reconnected to their previous session
  if (existingPlayer && existingPlayerName) {
    console.log(
      `Existing Player ${existingPlayer.playerName}|${existingPlayer.playerId} has reconnected.`
    );
    // return existing game state
    return returnServiceResponse(game);
  }

  // player has reconnected to their previous session but has a new name
  if (existingPlayer && !existingPlayerName) {
    console.log(
      `Existing Player ${existingPlayer.playerName}|${existingPlayer.playerId} has reconnected as: ${playerName}`
    );
    // delete their old player from session and create new player for them
    // For now, just update their name
    existingPlayer.playerName = playerName;
    existingPlayer.playerColour = playerColour as any;

    // update existing player in game state
    const updatedGame = {
      ...game,
      players: game.players.map((p) =>
        p.playerId === playerId ? { ...p, ...existingPlayer } : p
      ),
    };
    // set new game state
    GAMES_DB.set(roomId, updatedGame);

    return returnServiceResponse(updatedGame);
  }

  // new player joining the session
  if (!existingPlayer) {
    console.log(`New Player ${playerName}|${playerId} has joined the session.`);
    // create new player for them
    const updatedGame = {
      ...game,
      players: [
        ...game.players,
        {
          playerId,
          playerName,
          playerColour: playerColour as any,
          x: 0,
          y: 0,
        },
      ],
    };
    // set new game state
    GAMES_DB.set(roomId, updatedGame);

    return returnServiceResponse(updatedGame);
  }

  // edge case?
  console.error(`this probably shouldn't log?`);
  return returnServiceResponse(game);
}

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
