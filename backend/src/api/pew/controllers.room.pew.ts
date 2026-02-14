import { returnAPIError, returnAPIResponse } from "../../responses";
import type {
  Color,
  Room,
  RoomJoinRequestModel,
} from "./models/base.models.pew";
import { LEVEL_1 } from "./models/level.model.pew";
import {
  playerServiceCreate,
  playerServiceGetSerialisedByDeviceId,
  removePlayerFromGame,
} from "./service.player.pew";
import {
  roomServiceCreate,
  roomServiceGetAll,
  roomServiceGetByName,
} from "./service.room.pew";
import { sendMessage } from "./util.pew";

export const listRoomsController = () => {
  const [result, error] = roomServiceGetAll();

  if (!result || error) {
    return returnAPIError(error);
  }

  return returnAPIResponse(result);
};

export const joinRoomController = (body: RoomJoinRequestModel) => {
  const {
    roomName,
    roomCode,
    playerName,
    playerColour,
    playerId,
    playerDeviceId,
  } = body;

  let room: Room | null = null;
  const [existingRoom, existingRoomError] = roomServiceGetByName(roomName);

  // existing room, check room code
  if (existingRoom) {
    if (existingRoom.roomCode !== roomCode) {
      return returnAPIError("INVALID_ROOM_CODE");
    }
    room = existingRoom;
  }

  // new room, create new room
  if (!existingRoom || existingRoomError) {
    const [newRoom, newRoomError] = roomServiceCreate(roomName, roomCode);
    if (!newRoom || newRoomError) {
      return returnAPIError(newRoomError);
    }
    room = newRoom;
  }

  // edgecase
  if (!room) {
    return returnAPIError("ROOM_FAILED_TO_FIND_OR_JOIN");
  }

  // new player
  if (!playerId) {
    sendMessage("return new player (no provided playerId)");
    return returnCreateNewPlayerResponse(
      room.roomId,
      playerName,
      playerColour,
      playerDeviceId
    );
  }

  // existing player, via deviceId (the provided playerId may have changed if switched rooms. deviceId is constant)
  const [existingPlayer, existingPlayerError] =
    playerServiceGetSerialisedByDeviceId(room.roomId, playerDeviceId);
  if (!existingPlayer || existingPlayerError) {
    sendMessage("return new player (no existing deviceId)");
    return returnCreateNewPlayerResponse(
      room.roomId,
      playerName,
      playerColour,
      playerDeviceId
    );
  }

  // existing player, if name or colour change, delete old player and create new
  if (
    existingPlayer.playerName !== playerName ||
    existingPlayer.playerColour !== playerColour
  ) {
    sendMessage(
      "return new player & delete old player (name or colour change)"
    );
    const [removedGame, removedGameError] = removePlayerFromGame(
      room.roomId,
      existingPlayer.playerId
    );
    if (!removedGame || removedGameError) {
      return returnAPIError(removedGameError);
    }
    return returnCreateNewPlayerResponse(
      room.roomId,
      playerName,
      playerColour,
      playerDeviceId
    );
  }

  // existing player & existing room, return existing player
  return returnAPIResponse({
    roomId: room.roomId,
    playerId: existingPlayer.playerId,
    level: LEVEL_1,
  });
};

function returnCreateNewPlayerResponse(
  roomId: string,
  playerName: string,
  playerColour: Color,
  playerDeviceId: string
) {
  const [player, playerError] = playerServiceCreate(
    roomId,
    playerName,
    playerColour,
    playerDeviceId
  );
  if (!player || playerError) {
    return returnAPIError(playerError);
  }
  return returnAPIResponse({
    roomId: roomId,
    playerId: player.playerId,
    level: LEVEL_1,
  });
}
