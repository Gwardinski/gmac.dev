import { returnServiceResponse } from "../../responses";
import type { ServiceResponse } from "../../types";
import { GAMES_DB } from "./db.pew";
import type { Game, ROOM_ID } from "./models.pew";

export function getGameState(roomId: ROOM_ID): ServiceResponse<Game> {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    return returnServiceResponse<Game>("INVALID_ROOM_CODE");
  }
  return returnServiceResponse(game);
}
