import { returnWSResponse } from "../../responses.js";
import { GAMES_DB } from "./db.pew.js";
import type { ROOM_ID, WSSendMessageType } from "./models/base.models.pew.js";
import type { GameSerialized } from "./models/game.model.pew.js";
import type { SystemChatParams } from "./models/system-event.model.js";
import { addSystemChat } from "./service.chat.pew.js";

const TICK_RATE = 1000 / 60; // 60 FPS
const BROADCAST_RATE = 10; // broadcasts per second
const BROADCAST_INTERVAL_MS = 1000 / BROADCAST_RATE;

// Store active game loops per room
const gameLoops = new Map<ROOM_ID, NodeJS.Timeout>();

// Store last broadcast time per room (for throttling)
const lastBroadcastTime = new Map<ROOM_ID, number>();

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

  // Store broadcast callback for this room (used by system event handler)
  broadcastCallbacks.set(roomId, broadcastToRoom);

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
    lastBroadcastTime.delete(roomId);
    broadcastCallbacks.delete(roomId);
    console.log(`Stopped game engine for room: ${roomId}`);
  }
}

export function isGameEngineRunning(roomId: ROOM_ID): boolean {
  return gameLoops.has(roomId);
}

// Single Game Tick
function gameEngineTick(roomId: ROOM_ID) {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    stopGameEngine(roomId);
    return;
  }

  game.tickCollisionTracking();
  game.tickRespawnPlayers();
  game.tickCleanupDeletedPlayers();
  game.tickBulletPositionAndCollisions();
  game.tickItemSpawns();

  GAMES_DB.set(roomId, game);

  // Throttle broadcasts to 4 per second
  const now = Date.now();
  const lastBroadcast = lastBroadcastTime.get(roomId) ?? 0;
  if (now - lastBroadcast >= BROADCAST_INTERVAL_MS) {
    lastBroadcastTime.set(roomId, now);
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
}

export function systemEventHandler(roomId: ROOM_ID) {
  return (systemChat: SystemChatParams) => {
    const broadcastToRoom = broadcastCallbacks.get(roomId);
    if (broadcastToRoom) {
      handleSystemEvent(roomId, systemChat, broadcastToRoom);
    }
  };
}

function handleSystemEvent(
  roomId: ROOM_ID,
  systemChat: SystemChatParams,
  broadcastToRoom: BroadcastCallback
) {
  const chatResult = addSystemChat(roomId, systemChat);
  if (chatResult && broadcastToRoom) {
    const [newChat, chatError] = chatResult;
    if (newChat && !chatError) {
      broadcastToRoom(
        roomId,
        returnWSResponse<WSSendMessageType, typeof newChat>("new-chat", newChat)
      );
    }
  }
}
