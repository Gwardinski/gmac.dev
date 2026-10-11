import { returnAPIError, returnAPIResponse } from "../../../responses";
import type { APIResponse } from "../../../types";
import type { RoomListModel } from "../models";
import { roomServiceGetAll } from "../services";

export const listRoomsController = (): APIResponse<RoomListModel[]> => {
  const [value, error] = roomServiceGetAll();

  if (!value || error) {
    return returnAPIError(error);
  }

  return returnAPIResponse(value);
};
