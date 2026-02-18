import { returnAPIError, returnAPIResponse } from "../../responses";
import type { Color, Room } from "./models/base.models.pew";
import type { GameClass } from "./models/game.model.pew";
import { LEVEL_1 } from "./models/level.model.pew";
import { getGameState } from "./service.game.pew";
import { roomServiceCreate, roomServiceGetByName } from "./service.room.pew";
import type { RoomJoinRequestModel } from "./validation";

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

  // room exists, check room code
  if (existingRoom) {
    if (existingRoom.roomCode !== roomCode) {
      return returnAPIError("INVALID_ROOM_CODE");
    }
    room = existingRoom;
  }

  // room does not exist, create new room
  if (!existingRoom || existingRoomError) {
    const [newRoom, newRoomError] = roomServiceCreate(roomName, roomCode);
    if (!newRoom || newRoomError) {
      return returnAPIError(newRoomError);
    }
    room = newRoom;
  }

  // edgecase?
  if (!room) {
    return returnAPIError("ROOM_FAILED_TO_FIND_OR_JOIN");
  }

  const [game, gameError] = getGameState(room.roomId);
  if (!game || gameError) {
    return returnAPIError(gameError);
  }

  // no optional player id provided. Return create new player
  if (!playerId) {
    return returnCreateNewPlayerResponse(
      room,
      game,
      playerDeviceId,
      playerName,
      playerColour
    );
  }

  // existing player?
  const existingPlayer = game.players.find(
    (p) => p.playerDeviceId === playerDeviceId
  );

  // id provided but not player, potentially deleted? Return create new player
  if (!existingPlayer) {
    return returnCreateNewPlayerResponse(
      room,
      game,
      playerDeviceId,
      playerName,
      playerColour
    );
  }

  // Name or colour changed, remove existing and return create new player
  if (
    existingPlayer.playerName !== playerName ||
    existingPlayer.playerColour !== playerColour
  ) {
    game.deletePlayer(existingPlayer.id);
    return returnCreateNewPlayerResponse(
      room,
      game,
      playerDeviceId,
      playerName,
      playerColour
    );
  }

  if (existingPlayer.isDeleted) {
    game.restorePlayer(existingPlayer.id);
  }

  return returnAPIResponse({
    roomId: room.roomId,
    playerId: existingPlayer.id,
    level: LEVEL_1,
  });
};

function returnCreateNewPlayerResponse(
  room: Room,
  game: GameClass,
  playerDeviceId: string,
  playerName: string,
  playerColour: Color
) {
  const newPlayer = game.spawnNewPlayer(
    playerDeviceId,
    playerName,
    playerColour
  );
  return returnAPIResponse({
    roomId: room.roomId,
    playerId: newPlayer.id,
    level: LEVEL_1,
  });
}
