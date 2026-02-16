import type { Room, ROOM_ID } from "./models/base.models.pew";
import type { GameChat } from "./models/chat.model.pew";
import type { GameClass } from "./models/game.model.pew";

export const ROOMS_DB = new Map<ROOM_ID, Room>();
export const GAMES_DB = new Map<ROOM_ID, GameClass>();
export const CHATS_DB = new Map<ROOM_ID, GameChat[]>();
