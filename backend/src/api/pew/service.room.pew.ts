import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { CHATS_DB, GAMES_DB, ROOMS_DB } from "./db.pew";
import { systemEventHandler } from "./engine";
import type { Room, ROOM_ID, RoomListModel } from "./models/base.models.pew";
import { GameClass } from "./models/game.model.pew";
import { LEVEL_1, LevelClass } from "./models/level.model.pew";
import { SystemEventClass } from "./models/system-event.model";
import { generateRoomId } from "./util.pew";

// REST Services

export function roomServiceGetByName(roomName: ROOM_ID): ServiceResponse<Room> {
  const existingRoom = ROOMS_DB.values().find(
    (room) => room.roomName === roomName
  );
  if (!existingRoom) {
    return returnServiceResponse<Room>("ROOM_NOT_FOUND");
  }
  return returnServiceResponse(existingRoom);
}

export function roomServiceGetAll(): ServiceResponse<RoomListModel[]> {
  const roomList = Array.from(ROOMS_DB.values()).map(({ roomId, roomName }) => {
    const room: RoomListModel = {
      roomName,
      playerCount: GAMES_DB.get(roomId)?.players.length ?? 0,
    };
    return room;
  });
  return returnServiceResponse(roomList);
}

export function roomServiceCreate(
  roomName: string,
  roomCode: string
): ServiceResponse<Room> {
  const roomId = generateRoomId();
  const room: Room = {
    roomId,
    roomName,
    roomCode,
  };
  const systemEvent = new SystemEventClass((event) => {
    systemEventHandler(roomId)(event);
  });
  const level = new LevelClass(LEVEL_1);
  const game = new GameClass(roomId, level, systemEvent);

  ROOMS_DB.set(roomId, room);
  GAMES_DB.set(roomId, game);
  return returnServiceResponse({ roomId, roomName, roomCode });
}

export function roomServiceDeleteEmpty() {
  GAMES_DB.forEach((game) => {
    const activePlayers = game.players.filter((player) => !player.isDeleted);
    if (activePlayers.length === 0) {
      roomServiceDelete(game.roomId);
    }
  });
}

export function roomServiceDelete(roomId: ROOM_ID): ServiceResponse<void> {
  ROOMS_DB.delete(roomId);
  GAMES_DB.delete(roomId);
  CHATS_DB.delete(roomId);
  return returnServiceResponse(undefined);
}
