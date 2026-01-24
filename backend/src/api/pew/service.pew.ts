import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB, ROOMS_DB } from "./db.pew";
import type {
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
