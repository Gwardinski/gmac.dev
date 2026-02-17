import { returnAPIError, returnAPIResponse } from "../../responses";
import type { APIResponse } from "../../types";
import type { RoomListModel } from "./models/base.models.pew";
import { roomServiceGetAll } from "./service.room.pew";

export const listRoomsController = (): APIResponse<RoomListModel[]> => {
  const [value, error] = roomServiceGetAll();

  if (!value || error) {
    return returnAPIError(error);
  }

  return returnAPIResponse(value);
};
