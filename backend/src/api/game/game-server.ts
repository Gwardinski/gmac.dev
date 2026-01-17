/* eslint-disable no-console */
import http from 'http';
import { Server } from 'socket.io';

// Utilities & Logic Refactor
// Add room logic
// Separate out the messages so they don't update / re-render the frontend when players move
// double check id logic to make sure removed previous implementation
// see if there's a better way to handle server state without needing DB
// Gameplay Mechanics
// add shooting (client side shooting? spawn point on backend but let client update position)
// add damage / health
// add death / respawn
// add scoreboard
// UI Update
// screen size scaling?

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Color =
  | 'RED'
  | 'BLUE'
  | 'GREEN'
  | 'YELLOW'
  | 'PURPLE'
  | 'ORANGE'
  | 'BROWN';

type Player = {
  socketId: string;
  sessionId: string; // Unique ID that persists across refreshes
  name: string;
  color: Color;
  x: number;
  y: number;
  // health: number;
  // shield: boolean;
  // energy: number;
  // killCount: number;
  // deathCount: number;
};

type GameState = {
  id: string;
  roomCode: string;
  players: Player[];
};
type GameChat = {
  messages: string[];
};

const GAME_ROOMS = new Map<string, GameState>();
const GAME_CHATS = new Map<string, GameChat>();

function getOrCreateRoom(roomCode: string): GameState {
  if (!GAME_ROOMS.has(roomCode)) {
    GAME_ROOMS.set(roomCode, {
      id: generateRoomId(),
      roomCode,
      players: [],
    });
  }
  return GAME_ROOMS.get(roomCode)!;
}

function getOrCreateChat(roomCode: string): GameChat {
  if (!GAME_CHATS.has(roomCode)) {
    GAME_CHATS.set(roomCode, {
      messages: [],
    });
  }
  return GAME_CHATS.get(roomCode)!;
}

function generateRoomId(): string {
  return `room-${Date.now()}-${Math.random().toString(36)}`;
}

function cleanupEmptyRooms() {
  for (const [roomCode, state] of GAME_ROOMS.entries()) {
    if (state.players.length === 0) {
      console.log(`Cleaning up empty room: ${roomCode}`);
      GAME_ROOMS.delete(roomCode);
      GAME_CHATS.delete(roomCode);
    }
  }
}

export function initGameServer(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Allow all origins - change to specific origin in production
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Cleanup empty rooms every 5 minutes
  setInterval(cleanupEmptyRooms, 5 * 60 * 1000);

  io.on('connection', (socket) => {
    const socketId = socket.id;
    let currentRoomCode: string | null = null;

    socket.on('join-game', (newPlayerData) => {
      const { playerName, playerColor, sessionId, roomCode } = newPlayerData;
      if (!roomCode) {
        console.error('No room code provided');
        return;
      }
      currentRoomCode = roomCode;

      // Join the socket.io room
      socket.join(roomCode);

      const gameState = getOrCreateRoom(roomCode);
      const isReconnect = gameState.players.some((p) => p.sessionId === sessionId);
      const newPlayer = joinGame(roomCode, socketId, playerName, playerColor, sessionId);
      if (!newPlayer) {
        return;
      }

      updateGameChat(roomCode, `${newPlayer.name} ${isReconnect ? 'is back online' : 'joined the game!'}`);

      const chatState = getOrCreateChat(roomCode);

      socket.emit(`join-game-${newPlayer.name}`, newPlayer.socketId);
      socket.emit('game-state', returnGameState(roomCode));
      socket.emit('game-chat', chatState.messages);

      socket.to(roomCode).emit('game-state', returnGameState(roomCode));
      socket.to(roomCode).emit('game-chat', chatState.messages);
    });

    socket.on('update-position', (playerData) => {
      if (!currentRoomCode) return;

      const { socketId, direction } = playerData;
      const updated = updatePlayerPosition(currentRoomCode, socketId, direction);
      if (!updated) {
        return;
      }
      io.to(currentRoomCode).emit('game-state', returnGameState(currentRoomCode));
    });

    socket.on('disconnect', () => {
      if (!currentRoomCode) return;

      const player = playerDisconnected(currentRoomCode, socketId);
      if (player) {
        updateGameChat(currentRoomCode, `${player.name} disconnected`);
        const chatState = getOrCreateChat(currentRoomCode);
        io.to(currentRoomCode).emit('game-chat', chatState.messages);
        io.to(currentRoomCode).emit('game-state', returnGameState(currentRoomCode));
      }
    });
  });

  return io;
}

function joinGame(
  roomCode: string,
  socketId: string,
  playerName: string,
  color: Color,
  sessionId: string
): Player | undefined {
  const gameState = getOrCreateRoom(roomCode);

  // Check if a player with this sessionId already exists (from a previous connection)
  const existingPlayer = gameState.players.find((p) => p.sessionId === sessionId);

  if (existingPlayer) {
    // Update the existing player's socketId and keep their position
    existingPlayer.socketId = socketId;
    existingPlayer.name = playerName; // Update name in case they changed it
    existingPlayer.color = color; // Update color in case they changed it

    updateGameState(roomCode, { ...gameState });
    return existingPlayer;
  }

  // Create a new player
  const newPlayer: Player = {
    socketId: socketId,
    sessionId: sessionId,
    name: playerName,
    color: color ?? 'RED',
    x: 0,
    y: 0,
  };

  updateGameState(roomCode, {
    ...gameState,
    players: [...gameState.players, newPlayer],
  });

  return newPlayer;
}

function updatePlayerPosition(roomCode: string, socketId: string, direction: Direction): boolean {
  const gameState = getOrCreateRoom(roomCode);
  const player = gameState.players.find((player) => player.socketId === socketId);
  if (!player || !direction) {
    return false;
  }

  if (direction === 'RIGHT') {
    player.x += 4;
  } else if (direction === 'LEFT') {
    player.x -= 4;
  } else if (direction === 'UP') {
    player.y -= 4;
  } else if (direction === 'DOWN') {
    player.y += 4;
  }

  updateGameState(roomCode, {
    ...gameState,
    players: gameState.players.map((player) => {
      if (player.socketId === socketId) {
        return { ...player };
      }
      return player;
    }),
  });

  return true;
}

function updateGameState(roomCode: string, newState: GameState) {
  GAME_ROOMS.set(roomCode, newState);
}

function returnGameState(roomCode: string): GameState {
  const gameState = getOrCreateRoom(roomCode);
  return {
    ...gameState,
    players: gameState.players.map((player) => {
      const p = { ...player };
      return { ...p };
    }),
  };
}

function playerDisconnected(roomCode: string, socketId: string) {
  const gameState = getOrCreateRoom(roomCode);
  const player = gameState.players.find((player) => player.socketId === socketId);
  if (!player) {
    return;
  }

  updateGameState(roomCode, {
    ...gameState,
    players: gameState.players.filter((player) => player.socketId !== socketId),
  });

  return player;
}

function updateGameChat(roomCode: string, message: string) {
  const chatState = getOrCreateChat(roomCode);
  chatState.messages.push(message);
}