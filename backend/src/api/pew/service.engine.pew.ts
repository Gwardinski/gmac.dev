import { returnWSResponse } from "../../responses.js";
import { GAMES_DB } from "./db.pew.js";
import type { ROOM_ID, WSSendMessageType } from "./models/base.models.pew.js";
import type { GameSerialized } from "./models/game.model.pew.js";

const TICK_RATE = 1000 / 60; // 60 FPS?

// Store active game loops per room
const gameLoops = new Map<ROOM_ID, NodeJS.Timeout>();

// Store broadcast callback per room
type BroadcastCallback = (roomId: string, message: string) => void;
const broadcastCallbacks = new Map<ROOM_ID, BroadcastCallback>();

export function getActiveGameEngines(): ROOM_ID[] {
  return Array.from(gameLoops.keys());
}

export function startGameEngine(
  roomId: ROOM_ID,
  broadcastToRoom: BroadcastCallback
) {
  // Don't start if already running
  if (isGameEngineRunning(roomId)) {
    console.log(`Game engine already running for room: ${roomId}`);
    return;
  }

  // Store broadcast callback for this room
  broadcastCallbacks.set(roomId, broadcastToRoom);

  console.log(`Starting game engine for room: ${roomId}`);

  // Create the game loop interval
  const interval = setInterval(() => {
    gameEngineTick(roomId);
  }, TICK_RATE);

  gameLoops.set(roomId, interval);
}

export function stopGameEngine(roomId: ROOM_ID) {
  const interval = gameLoops.get(roomId);
  if (interval) {
    clearInterval(interval);
    gameLoops.delete(roomId);
    broadcastCallbacks.delete(roomId);
    console.log(`Stopped game engine for room: ${roomId}`);
  }
}

export function isGameEngineRunning(roomId: ROOM_ID): boolean {
  return gameLoops.has(roomId);
}

// Single Game Tick (Frame)
function gameEngineTick(roomId: ROOM_ID) {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    // Room no longer exists, stop the engine
    stopGameEngine(roomId);
    return;
  }

  // Only update if there is automated content to process
  // todo: add other automated content here
  if (game.bullets.length === 0) {
    return;
  }

  game.updateBullets();
  // todo: items?

  GAMES_DB.set(roomId, game);

  const broadcast = broadcastCallbacks.get(roomId);
  if (broadcast) {
    broadcast(
      roomId,
      returnWSResponse<WSSendMessageType, GameSerialized>(
        "game-state",
        game.toJSON()
      )
    );
  }
}
