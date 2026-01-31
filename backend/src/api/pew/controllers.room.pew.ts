import { returnAPIError, returnAPIResponse } from "../../responses";
import type { Room, RoomJoinRequestModel } from "./models.pew";
import { playerServiceCreate } from "./service.player.pew";
import {
  roomServiceCreate,
  roomServiceGetAll,
  roomServiceGetByName,
} from "./service.room.pew";

export const listRoomsController = () => {
  const [result, error] = roomServiceGetAll();

  if (!result || error) {
    return returnAPIError(error);
  }

  return returnAPIResponse(result);
};

export const joinRoomController = (body: RoomJoinRequestModel) => {
  const { roomName, roomCode, playerName, playerColour } = body; // add ID to check for existing player

  let room: Room | null = null;
  const [existingRoom, existingRoomError] = roomServiceGetByName(roomName);

  if (existingRoom) {
    if (existingRoom.roomCode !== roomCode) {
      return returnAPIError("INVALID_ROOM_CODE");
    }
    room = existingRoom;
  }

  if (!existingRoom || existingRoomError) {
    const [newRoom, newRoomError] = roomServiceCreate(roomName, roomCode);
    if (!newRoom || newRoomError) {
      return returnAPIError(newRoomError);
    }
    room = newRoom;
  }

  if (!room) {
    return returnAPIError("ROOM_FAILED_TO_FIND_OR_JOIN");
  }

  const [player, playerError] = playerServiceCreate(
    room.roomId,
    playerName,
    playerColour
  );
  if (!player || playerError) {
    return returnAPIError(playerError);
  }

  return returnAPIResponse({ roomId: room.roomId, playerId: player.playerId });
};
