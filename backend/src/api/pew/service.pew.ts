import type { GameChat, GameState } from "./models.pew.js";

// rewrite Socketio logic to use Elysia Websockets instead

// Create concept of "Room"
// fields: RID, Name, Password, GameState
// List Rooms
// Create Room
// Join Room

// Create concept of "GameState"
// fields: GID, Players[]

// Create concept of "Player"
// fields: PID, Name, Color, X, Y, Health, Shield, Energy, KillCount, DeathCount
// Joining a room should be with a Player ID (store playerId in localStorage frontend to persist on disconnect)

// Create concept of "GameChat"
// fields: CID, RID, Messages[]

const GAME_ROOMS = new Map<string, GameState>();
const GAME_CHATS = new Map<string, GameChat>();
