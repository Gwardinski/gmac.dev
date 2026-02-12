import { returnWSResponse } from "../../responses.js";
import { GAMES_DB } from "./db.pew.js";
import { level1 } from "./levels.pew.js";
import type { Bullet, Game, ROOM_ID, WSSendMessageType } from "./models.pew.js";
import { BULLET_SPEED } from "./models.pew.js";

const TICK_RATE = 1000 / 60; // 60 FPS?
const GRID_SIZE = 16;

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

  // Update bullet positions
  const updatedBullets = updateBullets(game.bullets);
  // todo: create update functions for other automated content here

  // Update game state
  const updatedGame: Game = {
    ...game,
    bullets: updatedBullets,
    // todo: add other automated content here
  };

  GAMES_DB.set(roomId, updatedGame);

  // Broadcast updated state to all connected clients
  const broadcast = broadcastCallbacks.get(roomId);
  if (broadcast) {
    broadcast(
      roomId,
      returnWSResponse<WSSendMessageType, Game>("game-state", updatedGame)
    );
  }
}

function updateBullets(bullets: Bullet[]): Bullet[] {
  const activeBullets: Bullet[] = [];

  for (const bullet of bullets) {
    let newX = bullet.x;
    let newY = bullet.y;

    switch (bullet.direction) {
      case "UP":
        newY -= BULLET_SPEED;
        break;
      case "DOWN":
        newY += BULLET_SPEED;
        break;
      case "LEFT":
        newX -= BULLET_SPEED;
        break;
      case "RIGHT":
        newX += BULLET_SPEED;
        break;
    }

    // Check if bullet hit a wall
    const hitWall = isBulletInWall(newX, newY);
    // todo: create collision detection for players

    if (!hitWall) {
      activeBullets.push({
        ...bullet,
        x: newX,
        y: newY,
      });
    }
  }

  return activeBullets;
}

function isBulletInWall(x: number, y: number): boolean {
  const gridX = Math.floor(x / GRID_SIZE);
  const gridY = Math.floor(y / GRID_SIZE);

  //  todo: check if should add 16 to account for wall width
  if (
    gridY < 0 ||
    gridY >= level1.length ||
    gridX < 0 ||
    gridX >= (level1[0]?.length || 0)
  ) {
    return true; // outside level bounds
  }

  return level1[gridY]?.[gridX] === 2;
}

function isBulletInPlayer(x: number, y: number): boolean {
  // more complicated...
  return false;
}
