import type { Game, Room, ROOM_ID } from "./models.pew";

// DATA STORE - Consider moving to Redis, but for now just big objects.

export const ROOMS_DB = new Map<ROOM_ID, Room>();
export const GAMES_DB = new Map<ROOM_ID, Game>();
// const CHATS_DB = new Map<ROOM_ID, GameChat>();
