import { useEffect, useRef, useState } from 'react';
import type { GameState } from './client-copies';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const WS_URL = BACKEND_URL.replace('http', 'ws');

// WebSocket message types - matches backend structure
type WSMessage = { type: 'game-state'; data: GameState } | { type: 'echo'; data: unknown } | { error: string };

// WebSocket connection states
type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useGetGameState(roomId: string | null, playerId: string | null) {
  const [gameState, setGameState] = useState<GameState>({ players: [], bullets: [], messages: [] });
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);

  // Use ref to store WebSocket instance so we can send messages
  const wsRef = useRef<WebSocket | null>(null);

  // Function to send messages to the server
  const sendMessage = (message: unknown) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    // Silently fail if not connected (normal during React Strict Mode)
    return false;
  };

  useEffect(() => {
    if (!roomId || !playerId) {
      setStatus('disconnected');
      return;
    }

    setStatus('connecting');

    // race conditions when joining a room
    const connectionDelay = setTimeout(() => {
      // Create WebSocket connection
      const ws = new WebSocket(`${WS_URL}/pew/game?roomId=${roomId}&playerId=${playerId}`);
      wsRef.current = ws;

      // Connection opened
      ws.onopen = () => {
        setStatus('connected');
        setError(null);
      };

      // Listen for messages
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WSMessage;

          // Handle error messages
          if ('error' in message) {
            setError(message.error);
            setStatus('error');
            return;
          }

          // Handle game state updates
          if (message.type === 'game-state') {
            setGameState(message.data);
            setError(null);
          }

          // Handle other message types as needed
          // if (message.type === 'echo') { ... }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setError('Failed to parse message from server');
        }
      };

      // Connection closed
      ws.onclose = () => {
        // Only clear the ref if THIS WebSocket is the current one
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
    }, 100); // 100ms delay to ensure backend is ready

    // Cleanup on unmount or roomId change
    return () => {
      clearTimeout(connectionDelay);
      const ws = wsRef.current;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close(1000, 'Component unmounted');
      }
      wsRef.current = null;
      // Don't set status here - it causes state updates during cleanup
    };
  }, [roomId, playerId]);

  return {
    gameState,
    status,
    isConnected: status === 'connected',
    error,
    sendMessage
  };
}
