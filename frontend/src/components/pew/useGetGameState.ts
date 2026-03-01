import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { create } from 'zustand';
import type { Bearing, GameState, Level, Message } from './client-copies';
import { PlayerClient, type Player } from './client-copies/PlayerClient';
import type { JoinRoomResponse } from './useJoinRoom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Matches backend
export const TARGET_FPS = 60;
export const FRAME_TIME = 1000 / TARGET_FPS;

const DRIFT_THRESHOLD = 8;
const LERP_FACTOR = 0.3;
const WS_URL = BACKEND_URL.replace('http', 'ws');

// WebSocket message types - matches backend structure
type WSMessage = { type: 'game-state'; data: GameState } | { type: 'new-chat'; data: Message } | { error: string };

// WebSocket connection states
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

type LocalGameState = {
  roomId: string | null;
  playerId: string | null;
  level: Level | null;
  status: ConnectionStatus;
  error: string | null;
  setRoomId: (roomId: string | null) => void;
  setPlayerId: (playerId: string | null) => void;
  setRoom: (roomId: string, playerId: string, level: Level) => void;
  clearRoom: () => void;
  setStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
  playerClient: PlayerClient | null;
  setPlayerClient: (playerClient: PlayerClient | null) => void;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  previousGameState: GameState;
  setPreviousGameState: (previousGameState: GameState) => void;
  otherPlayers: PlayerClient[];
  setOtherPlayers: (otherPlayers: PlayerClient[]) => void;
  chats: Message[];
  setChats: (chats: Message[]) => void;
  serverPlayer: PlayerClient | null;
  setServerPlayer: (serverPlayer: PlayerClient | null) => void;
};

export const useLocalGameState = create<LocalGameState>((set) => ({
  roomId: null,
  playerId: null,
  level: null,
  status: 'disconnected',
  error: null,
  setRoomId: (roomId) => set({ roomId }),
  setPlayerId: (playerId) => set({ playerId }),
  setRoom: (roomId, playerId, level) => set({ roomId, playerId, level }),
  clearRoom: () => set({ roomId: null, playerId: null, level: null }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  playerClient: null,
  setPlayerClient: (playerClient) => set({ playerClient }),
  gameState: { players: [], bullets: [], items: [] },
  setGameState: (gameState) => set({ gameState }),
  previousGameState: { players: [], bullets: [], items: [] },
  setPreviousGameState: (previousGameState) => set({ previousGameState }),
  otherPlayers: [],
  setOtherPlayers: (otherPlayers) => set({ otherPlayers }),
  chats: [],
  setChats: (chats) => set({ chats }),
  serverPlayer: null,
  setServerPlayer: (serverPlayer) => set({ serverPlayer })
}));

type GameActions = ReturnType<typeof useGetGameState>;
const GameActionsContext = createContext<GameActions | null>(null);

export function GameStateProvider(props: { children: React.ReactNode }) {
  const actions = useGetGameState();
  return React.createElement(GameActionsContext.Provider, { value: actions }, props.children);
}

export function useGameActions(): GameActions {
  const ctx = useContext(GameActionsContext);
  if (!ctx) throw new Error('useGameActions must be used within GameStateProvider');
  return ctx;
}

export function useGetGameState() {
  const roomId = useLocalGameState((s) => s.roomId);
  const playerId = useLocalGameState((s) => s.playerId);
  const playerClient = useLocalGameState((s) => s.playerClient);
  const setGameState = useLocalGameState((s) => s.setGameState);
  const setPlayerClient = useLocalGameState((s) => s.setPlayerClient);
  const clearRoom = useLocalGameState((s) => s.clearRoom);
  const setStatus = useLocalGameState((s) => s.setStatus);
  const setError = useLocalGameState((s) => s.setError);
  const setChats = useLocalGameState((s) => s.setChats);
  const setRoom = useLocalGameState((s) => s.setRoom);
  const setOtherPlayers = useLocalGameState((s) => s.setOtherPlayers);
  const setPreviousGameState = useLocalGameState((s) => s.setPreviousGameState);
  const setServerPlayer = useLocalGameState((s) => s.setServerPlayer);

  const wsRef = useRef<WebSocket | null>(null);

  // Send WebSocket Messages
  const sendMessage = (message: unknown) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  };

  // Setup & Receive WebSocket Messages
  useEffect(() => {
    if (!roomId || !playerId) {
      setStatus('disconnected');
      return;
    }

    setStatus('connecting');

    const connectionDelay = setTimeout(() => {
      const ws = new WebSocket(`${WS_URL}/pew/game?roomId=${roomId}&playerId=${playerId}`);
      wsRef.current = ws;

      ws.onopen = async () => {
        setStatus('connected');
        setError(null);

        // Fetch initial chat history when connecting
        try {
          const response = await fetch(`${BACKEND_URL}/pew/chats/${roomId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.value && Array.isArray(data.value)) {
              setChats(data.value as Message[]);
            }
          }
        } catch (err) {
          console.error('Error fetching initial chats:', err);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WSMessage;

          if ('error' in message) {
            setError(message.error);
            setStatus('error');
            return;
          }

          if (message.type === 'game-state') {
            setPreviousGameState(useLocalGameState.getState().gameState);
            setGameState(message.data);
            const thisPlayer = message.data.players.find((p) => p.id === playerId);
            _createLocalPlayerClient(thisPlayer);
            _syncPlayerClientWithPlayerServer(thisPlayer);
            _syncOtherPlayers(message.data.players);
            setError(null);
          }

          if (message.type === 'new-chat') {
            const { chats: currentChats } = useLocalGameState.getState();
            setChats([...currentChats, message.data]);
            setError(null);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setError('Failed to parse message from server');
        }
      };

      ws.onclose = () => {
        if (wsRef.current === ws) {
          wsRef.current = null;
          setStatus('disconnected');
        }
      };

      // Connection error
      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        setStatus('error');
      };
    }, 100);

    return () => {
      clearTimeout(connectionDelay);
      const ws = wsRef.current;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close(1000, 'Component unmounted');
      }
      wsRef.current = null;
      setChats([]);
    };
  }, [roomId, playerId]);

  function _createLocalPlayerClient(player: Player | undefined) {
    if (!playerId || !player || playerClient) return;
    const { id, name, colour, x, y, speed, isDestroyed, isSpawning, isInvincible, bearing } = player;
    const newPlayerClient = new PlayerClient(id, name, colour, x, y, speed, bearing);
    newPlayerClient.isDestroyed = isDestroyed;
    newPlayerClient.isSpawning = isSpawning;
    newPlayerClient.isInvincible = isInvincible;
    setPlayerClient(newPlayerClient);
  }

  function _syncPlayerClientWithPlayerServer(serverPlayer: Player | undefined) {
    if (!playerId || !playerClient || !serverPlayer) return;
    const { isDestroyed, isSpawning, isInvincible } = serverPlayer;
    if (isDestroyed === playerClient.isDestroyed && isSpawning === playerClient.isSpawning && isInvincible === playerClient.isInvincible) return;

    const updatedPlayerClient = new PlayerClient(playerClient.id, playerClient.name, playerClient.colour, playerClient.x, playerClient.y, playerClient.speed, playerClient.bearing);
    updatedPlayerClient.isDestroyed = isDestroyed;
    updatedPlayerClient.isSpawning = isSpawning;
    updatedPlayerClient.isInvincible = isInvincible;
    setPlayerClient(updatedPlayerClient);
  }

  function _syncOtherPlayers(serverPlayers: Player[]) {
    if (!serverPlayers || serverPlayers.length === 0) return;
    const updatedOtherPlayers = serverPlayers.filter((p) => p.id !== playerId).map((p) => new PlayerClient(p.id, p.name, p.colour, p.x, p.y, p.speed, p.bearing));
    setOtherPlayers(updatedOtherPlayers);
    const thisPlayer = serverPlayers.find((p) => p.id === playerId);
    if (!thisPlayer) return;
    const serverPlayer = new PlayerClient(thisPlayer.id, thisPlayer.name, thisPlayer.colour, thisPlayer.x, thisPlayer.y, thisPlayer.speed, thisPlayer.bearing);
    serverPlayer.isDestroyed = thisPlayer.isDestroyed;
    serverPlayer.isSpawning = thisPlayer.isSpawning;
    serverPlayer.isInvincible = thisPlayer.isInvincible;
    setServerPlayer(serverPlayer);
  }

  _useEngineTick((_deltaMs) => {
    const { otherPlayers, level: lvl, serverPlayer, previousGameState: prev } = useLocalGameState.getState();
    if (!lvl) return;
    if (serverPlayer) {
      const previousPlayer = prev.players.find((p) => p.id === serverPlayer.id);
      if (!previousPlayer) return;
      if (previousPlayer.x === serverPlayer.x && previousPlayer.y === serverPlayer.y) return;
      serverPlayer.updatePosition(serverPlayer.bearing ?? 0, lvl);
    }
    otherPlayers.forEach((otherPlayer) => {
      const previousPlayer = prev.players.find((p) => p.id === otherPlayer.id);
      if (!previousPlayer) return;
      if (previousPlayer.x === otherPlayer.x && previousPlayer.y === otherPlayer.y) return;
      if (otherPlayer.bearing !== undefined && otherPlayer.bearing !== null) {
        otherPlayer.updatePosition(otherPlayer.bearing, lvl);
      }
    });
  });

  // Sync local position from server (spawn/destroy snap + drift lerp)
  // useEffect(() => {
  //   if (!playerId || !playerClientRef.current) return;
  //   const currentPlayer = gameState.players?.find((p) => p.playerId === playerId);
  //   if (!currentPlayer) return;

  //   if (currentPlayer.isSpawning || currentPlayer.isDestroyed) {
  //     playerClientRef.current.setPlayerPosition(currentPlayer.x, currentPlayer.y);
  //     setPlayerClientState({ x: currentPlayer.x, y: currentPlayer.y });
  //     return;
  //   }

  //   const dx = Math.abs(currentPlayer.x - playerClientRef.current.x);
  //   const dy = Math.abs(currentPlayer.y - playerClientRef.current.y);
  //   if (dx > DRIFT_THRESHOLD || dy > DRIFT_THRESHOLD) {
  //     const newX = playerClientRef.current.x + (currentPlayer.x - playerClientRef.current.x) * LERP_FACTOR;
  //     const newY = playerClientRef.current.y + (currentPlayer.y - playerClientRef.current.y) * LERP_FACTOR;
  //     playerClientRef.current.setPlayerPosition(newX, newY);
  //     setPlayerClientState({ x: playerClientRef.current.x, y: playerClientRef.current.y });
  //   }
  // }, [playerId, gameState.players, setPlayerClientState]);

  const updatePlayerClientPosition = useCallback(
    (bearing: Bearing, level: Level) => {
      if (!playerClient) return false;
      playerClient.updatePosition(bearing, level);
      const next = new PlayerClient(playerClient.id, playerClient.name, playerClient.colour, playerClient.x, playerClient.y, playerClient.speed, bearing);
      next.isDestroyed = playerClient.isDestroyed;
      next.isSpawning = playerClient.isSpawning;
      next.isInvincible = playerClient.isInvincible;
      setPlayerClient(next);
      sendMessage({
        type: 'update-position',
        data: { x: playerClient.x, y: playerClient.y, bearing }
      });
      return true;
    },
    [playerClient, sendMessage, setPlayerClient]
  );

  const updatePlayerClientFire = useCallback(
    (bearing: Bearing) => {
      if (!playerClient) return false;
      sendMessage({ type: 'fire', data: { bearing } });
    },
    [playerClient]
  );

  const onJoinSuccess = useCallback(
    ({ roomId, playerId, level }: JoinRoomResponse) => {
      setRoom(roomId, playerId, level);
      localStorage.setItem('room-id', roomId);
      localStorage.setItem('player-id', playerId);
    },
    [setRoom]
  );

  const onLeave = useCallback(() => {
    sendMessage({ type: 'leave-room' });
    clearRoom();
    localStorage.removeItem('room-id');
    localStorage.removeItem('player-id');
  }, [sendMessage, clearRoom]);

  const sendChat = (chatContent: string) => {
    return sendMessage({
      type: 'send-chat',
      data: { chatContent }
    });
  };

  return {
    sendMessage,
    sendChat,
    updatePlayerClientPosition,
    updatePlayerClientFire,
    onJoinSuccess,
    onLeave
  };
}

function _useEngineTick(tick: (deltaMs: number) => void) {
  const tickRef = useRef(tick);
  tickRef.current = tick;
  const lastTickTimeRef = useRef(performance.now());

  useEffect(() => {
    let frameId: number;

    const loop = () => {
      const now = performance.now();
      const elapsed = now - lastTickTimeRef.current;
      if (elapsed >= FRAME_TIME) {
        lastTickTimeRef.current = now;
        tickRef.current(FRAME_TIME);
      }
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);
}
