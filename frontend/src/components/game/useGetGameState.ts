import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { GAME_STATE, type Color, type Direction, type GameState } from './game-state';

const socket = io('http://localhost:3002');

export const useGetSocketId = () => {
  const [socketId, setSocketId] = useState<string>('');

  useEffect(() => {
    // Socket ID is available after connection
    if (socket.id) {
      setSocketId(socket.id);
    }

    // Listen for connect event to get ID when socket connects
    const handleConnect = () => {
      if (socket.id) {
        setSocketId(socket.id);
      }
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
  }, []);

  return socketId;
};

export const useGetGameState = () => {
  const [gameState, setGameState] = useState<GameState>(GAME_STATE);

  useEffect(() => {
    const handleGameState = (gameState: GameState) => {
      setGameState(gameState);
    };

    socket.on('game-state', handleGameState);

    return () => {
      socket.off('game-state', handleGameState);
    };
  }, []);

  return gameState;
};

export const usePlayerMove = (socketId: string) => {
  const playerMove = useCallback(
    (direction: Direction) => {
      socket.emit('update-position', { socketId, direction });
    },
    [socketId]
  );
  return { playerMove };
};

export const usePlayerShoot = (socketId: string) => {
  const playerShoot = useCallback(
    (direction: Direction) => {
      socket.emit('fire-weapon', { socketId, direction });
    },
    [socketId]
  );
  return { playerShoot };
};

export const useGameChat = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleGameChat = (messages: string[]) => {
      console.log('Received game-chat event with messages:', messages);
      setMessages(messages);
    };

    socket.on('game-chat', handleGameChat);

    return () => {
      socket.off('game-chat', handleGameChat);
    };
  }, []);

  return messages;
};

export function gameJoin(roomCode: string, playerName: string, playerColor: Color) {
  let sessionId = localStorage.getItem('player-session-id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('player-session-id', sessionId);
  }

  // Save player preferences to localStorage
  localStorage.setItem('player-name', playerName);
  localStorage.setItem('room-code', roomCode);
  localStorage.setItem('player-color', playerColor);

  socket.emit('join-game', { roomCode, playerName, playerColor, sessionId });
}
