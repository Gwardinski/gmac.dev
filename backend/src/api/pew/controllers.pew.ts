import { returnAPIError, returnAPIResponse } from "../../responses";
import type { RoomJoinRequestModel } from "./models.pew";
import { joinRoom, listRooms } from "./service.pew";

export const listRoomsController = () => {
  const [result, error] = listRooms();

  if (!result || error) {
    return returnAPIError(error);
  }

  return returnAPIResponse(result);
};

export const joinRoomController = (body: RoomJoinRequestModel) => {
  const { roomName, roomCode } = body;

  const [result, error] = joinRoom({
    roomName,
    roomCode,
  });
  if (!result || error) {
    return returnAPIError(error);
  }

  return returnAPIResponse(result);
};
