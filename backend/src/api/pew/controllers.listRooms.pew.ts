import { returnAPIError, returnAPIResponse } from "../../responses";
import { roomServiceGetAll } from "./service.room.pew";

export const listRoomsController = () => {
  const [result, error] = roomServiceGetAll();

  if (!result || error) {
    return returnAPIError(error);
  }

  return returnAPIResponse(result);
};
