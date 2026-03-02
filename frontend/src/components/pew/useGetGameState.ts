import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { create } from 'zustand';
import type { Bullet, GameState, Level, Message } from './client-copies';
import { PlayerClient, type FireKey, type MovementKey, type Player } from './client-copies/PlayerClient';
import type { JoinRoomResponse } from './useJoinRoom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Matches backend
export const TARGET_FPS = 60;
export const FRAME_TIME = 1000 / TARGET_FPS;

const LERP_FACTOR = 0.15;
const BULLET_SPEED = 10;
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
  setRoomId: (roomId: string | null) => void;
  setPlayerId: (playerId: string | null) => void;
  setRoom: (roomId: string, playerId: string, level: Level) => void;
  clearRoom: () => void;
  setStatus: (status: ConnectionStatus) => void;
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
  displayBullets: Bullet[];
  setDisplayBullets: (displayBullets: Bullet[]) => void;
  debugEnabled: boolean;
  setDebugEnabled: (debugEnabled: boolean) => void;
};

export const useLocalGameState = create<LocalGameState>((set) => ({
  roomId: null,
  playerId: null,
  level: null,
  status: 'disconnected',
  setRoomId: (roomId) => set({ roomId }),
  setPlayerId: (playerId) => set({ playerId }),
  setRoom: (roomId, playerId, level) => set({ roomId, playerId, level }),
  clearRoom: () =>
    set({
      roomId: null,
      playerId: null,
      level: null,
      playerClient: null,
      serverPlayer: null,
      otherPlayers: [],
      gameState: { players: [], bullets: [], items: [] },
      previousGameState: { players: [], bullets: [], items: [] },
      displayBullets: []
    }),
  setStatus: (status) => set({ status }),
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
  setServerPlayer: (serverPlayer) => set({ serverPlayer }),
  displayBullets: [],
  setDisplayBullets: (displayBullets) => set({ displayBullets }),
  debugEnabled: false,
  setDebugEnabled: (debugEnabled) => set({ debugEnabled })
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
  const setGameState = useLocalGameState((s) => s.setGameState);
  const setPlayerClient = useLocalGameState((s) => s.setPlayerClient);
  const clearRoom = useLocalGameState((s) => s.clearRoom);
  const setStatus = useLocalGameState((s) => s.setStatus);
  const setChats = useLocalGameState((s) => s.setChats);
  const setRoom = useLocalGameState((s) => s.setRoom);
  const setPreviousGameState = useLocalGameState((s) => s.setPreviousGameState);
  const setDisplayBullets = useLocalGameState((s) => s.setDisplayBullets);

  const wsRef = useRef<WebSocket | null>(null);
  const movementKeysRef = useRef<Set<MovementKey>>(new Set());
  const fireKeysRef = useRef<Set<FireKey>>(new Set());

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

        // Fetch initial chat history on connect
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
            setStatus('error');
            return;
          }

          if (message.type === 'game-state') {
            setPreviousGameState(useLocalGameState.getState().gameState);
            setGameState(message.data);
            setDisplayBullets(message.data.bullets.map((b) => ({ ...b })));
            const playerServerData = message.data.players.find((p) => p.id === playerId);
            const { playerClient: currentPlayerClient } = useLocalGameState.getState();
            // Create Local PlayerClient when required, ensure status variables are synced with server
            if (!currentPlayerClient && playerServerData) {
              _createLocalPlayerClient(playerServerData);
            }
            if (playerServerData) {
              _syncPlayerClientWithServer(playerServerData);
            }
            // Ensure other PlayerClients exist and stay in sync with server flags
            _syncOtherPlayerClientsWithServer(message.data.players);
          }

          if (message.type === 'new-chat') {
            const { chats: currentChats } = useLocalGameState.getState();
            setChats([...currentChats, message.data]);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
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

  /*
    Join / Leave / Chat handlers
  */

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

  /*
    Player Sync Handlers
    Create New PlayerClient when required
    use to set status variables: isDestroyed, isSpawning, isInvincible
    for movement see tick functions
   */

  // Create Local PlayerClient
  function _createLocalPlayerClient(player: Player | undefined) {
    const state = useLocalGameState.getState();
    if (!player || !state.playerId || state.playerClient) return;
    const { id, name, colour, x, y, speed, isDestroyed, isSpawning, isInvincible, bearing } = player;
    const newPlayerClient = new PlayerClient(id, name, colour, x, y, speed, bearing);
    newPlayerClient.isDestroyed = isDestroyed;
    newPlayerClient.isSpawning = isSpawning;
    newPlayerClient.isInvincible = isInvincible;
    newPlayerClient.level = state.level ?? [];
    setPlayerClient(newPlayerClient);
  }

  // Sync Local PlayerClient with Server
  // note: this approach of having to overwrite existing state with a new version is very un-oop
  // would ideally just single line of `playerClient.syncStatusWithServerPlayer(serverPlayer)`
  function _syncPlayerClientWithServer(serverPlayer: Player) {
    const { playerClient } = useLocalGameState.getState();
    if (!playerClient) return;
    // Mutate the existing instance in place so references stay stable
    playerClient.syncStatusWithServer(serverPlayer);
  }

  // Sync Other PlayerClients with Server (create if missing, update flags if existing)
  function _syncOtherPlayerClientsWithServer(serverPlayers: Player[]) {
    const state = useLocalGameState.getState();
    const { otherPlayers, playerId, setOtherPlayers, level } = state;

    const existingById = new Map(otherPlayers.map((p) => [p.id, p]));
    const updatedOtherPlayers: PlayerClient[] = [];

    serverPlayers.forEach((sp) => {
      if (sp.id === playerId) return;
      const existing = existingById.get(sp.id);
      if (existing) {
        existing.syncStatusWithServer(sp);
        updatedOtherPlayers.push(existing);
      } else {
        const client = new PlayerClient(sp.id, sp.name, sp.colour, sp.x, sp.y, sp.speed, sp.bearing);
        client.isDestroyed = sp.isDestroyed ?? false;
        client.isSpawning = sp.isSpawning ?? false;
        client.isInvincible = sp.isInvincible ?? false;
        client.level = level ?? [];
        updatedOtherPlayers.push(client);
      }
    });

    setOtherPlayers(updatedOtherPlayers);
  }

  /*
    Input handlers
  */

  const registerMovementKey = useCallback((key: MovementKey, isPressed: boolean) => {
    if (isPressed) {
      movementKeysRef.current.add(key);
    } else {
      movementKeysRef.current.delete(key);
    }
  }, []);

  const registerAimKey = useCallback((key: FireKey, isPressed: boolean) => {
    if (isPressed) {
      fireKeysRef.current.add(key);
    } else {
      fireKeysRef.current.delete(key);
    }
  }, []);

  /*
    Tick functions
  */

  function tickUpdateBulletsOnScreen(deltaMs: number) {
    const { displayBullets } = useLocalGameState.getState();
    const dist = BULLET_SPEED * (deltaMs / 1000) * 60;
    const advancedBullets: Bullet[] = displayBullets.map((b) => {
      const rad = (b.bearing * Math.PI) / 180;
      return {
        ...b,
        x: b.x + Math.cos(rad) * dist,
        y: b.y + Math.sin(rad) * dist
      };
    });
    setDisplayBullets(advancedBullets);
  }

  function tickUpdatePositionTowardServer(clientData: PlayerClient, serverData: Player) {
    if (serverData.isDestroyed || serverData.isSpawning) {
      clientData.syncPositionWithServer(serverData.x, serverData.y);
    } else {
      const x = clientData.x + (serverData.x - clientData.x) * LERP_FACTOR;
      const y = clientData.y + (serverData.y - clientData.y) * LERP_FACTOR;
      clientData.syncPositionWithServer(x, y);
    }
  }

  const tickSendPlayerClientPosition = useCallback(() => {
    const { playerClient: currentPlayerClient } = useLocalGameState.getState();
    if (!currentPlayerClient || currentPlayerClient.bearing === undefined) return false;
    return sendMessage({
      type: 'update-position',
      data: { x: currentPlayerClient.x, y: currentPlayerClient.y, bearing: currentPlayerClient.bearing }
    });
  }, [sendMessage]);

  // Debounced Server Updates, via tick
  // const updatesPerSecond = 30;
  // const serverUpdaterCounter = useRef(0);
  // function tickSendUpdateToServer(deltaMs: number) {
  //   serverUpdaterCounter.current += deltaMs;
  //   if (serverUpdaterCounter.current >= 1000 / updatesPerSecond) {
  //     serverUpdaterCounter.current = 0;
  //   }
  // }

  // Main Game Loop - Called 60 times per second using _useEngineTick
  const onGameTick = useCallback(
    (deltaMs: number) => {
      const { otherPlayers, level: lvl, gameState, roomId: rid, playerId: pid, playerClient } = useLocalGameState.getState();
      if (!lvl || !rid || !pid || !playerClient) return;

      playerClient.onGameTick({
        _deltaMs: deltaMs,
        movementKeys: movementKeysRef.current,
        fireKeys: fireKeysRef.current,
        onFireCallback: (bearing) => {
          sendMessage({ type: 'fire', data: { bearing } });
        }
      });

      tickUpdateBulletsOnScreen(deltaMs);
      tickSendPlayerClientPosition();
      // tickSendUpdateToServer(deltaMs);

      otherPlayers.forEach((otherPlayer) => {
        const serverP = gameState.players.find((p) => p.id === otherPlayer.id);
        if (serverP) tickUpdatePositionTowardServer(otherPlayer, serverP);
      });
    },
    [setDisplayBullets, tickSendPlayerClientPosition]
  );

  _useEngineTick(onGameTick);

  return {
    sendMessage,
    sendChat,
    registerMovementKey,
    registerAimKey,
    onGameTick,
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
