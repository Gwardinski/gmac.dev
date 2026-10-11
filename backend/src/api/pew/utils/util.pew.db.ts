import type { Room, ROOM_ID } from "../models";
import type { GameChat } from "../models";
import type { GameClass } from "../models";

export const ROOMS_DB = new Map<ROOM_ID, Room>();
export const GAMES_DB = new Map<ROOM_ID, GameClass>();
export const CHATS_DB = new Map<ROOM_ID, GameChat[]>();
