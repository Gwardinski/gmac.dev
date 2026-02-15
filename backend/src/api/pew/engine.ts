import { returnWSResponse } from "../../responses.js";
import { GAMES_DB } from "./db.pew.js";
import type { ROOM_ID, WSSendMessageType } from "./models/base.models.pew.js";
import type { GameSerialized, SystemEvent } from "./models/game.model.pew.js";
import { addSystemChat } from "./service.chat.pew.js";

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
    broadcastCallbacks.delete(roomId);
    console.log(`Stopped game engine for room: ${roomId}`);
  }
}

export function isGameEngineRunning(roomId: ROOM_ID): boolean {
  return gameLoops.has(roomId);
}

function handleSystemEvent(
  roomId: ROOM_ID,
  event: SystemEvent,
  broadcastToRoom?: BroadcastCallback
) {
  let chatResult;

  switch (event.type) {
    case "player-death": {
      chatResult = addSystemChat(
        roomId,
        `${event.killerName} killed ${event.victimName}`,
        event.killerId,
        event.killerName,
        event.killerColour
      );
      break;
    }
    case "player-join": {
      chatResult = addSystemChat(
        roomId,
        `${event.playerName} joined the game`,
        event.playerId,
        event.playerName,
        event.playerColour
      );
      break;
    }
    case "player-leave": {
      chatResult = addSystemChat(
        roomId,
        `${event.playerName} left the game`,
        event.playerId,
        event.playerName,
        event.playerColour
      );
      break;
    }
  }

  // Broadcast the new chat message to all connected clients (if engine is running)
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

// Create system event handler factory for use in room service
export function createSystemEventHandler(roomId: ROOM_ID) {
  return (event: SystemEvent) => {
    // Get broadcast callback if engine is running
    const broadcastToRoom = broadcastCallbacks.get(roomId);
    handleSystemEvent(roomId, event, broadcastToRoom);
  };
}

// Single Game Tick (Frame)
function gameEngineTick(roomId: ROOM_ID) {
  const game = GAMES_DB.get(roomId);
  if (!game) {
    // Room no longer exists, stop the engine
    stopGameEngine(roomId);
    return;
  }

  game.respawnPlayers();

  // Only update if there is automated content to process
  if (game.bullets.length === 0) {
    return;
  }

  game.updateBullets();

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
