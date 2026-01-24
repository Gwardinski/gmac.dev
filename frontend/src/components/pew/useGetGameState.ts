import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameState } from './game-state';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const WS_URL = BACKEND_URL.replace('http', 'ws');

// WebSocket message types - matches backend structure
type WSMessage = { type: 'game-state'; data: GameState } | { type: 'echo'; data: unknown } | { error: string };

// WebSocket connection states
type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * Hook to manage WebSocket connection and game state
 * @param roomId - The room ID to connect to
 * @returns Game state, connection status, error, and sendMessage function
 */
export function useGetGameState(roomId: string | null) {
  const [gameState, setGameState] = useState<GameState>({ players: [] });
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);

  // Use ref to store WebSocket instance so we can send messages
  const wsRef = useRef<WebSocket | null>(null);

  // Function to send messages to the server
  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    console.warn('WebSocket is not connected. Cannot send message.');
    return false;
  }, []);

  useEffect(() => {
    // Don't connect if no roomId
    if (!roomId) {
      setStatus('disconnected');
      return;
    }

    console.log(`Connecting to WebSocket: ${WS_URL}/pew/game?roomId=${roomId}`);
    setStatus('connecting');

    // Create WebSocket connection
    const ws = new WebSocket(`${WS_URL}/pew/game?roomId=${roomId}`);
    wsRef.current = ws;

    // Connection opened
    ws.onopen = () => {
      console.log('WebSocket connected');
      setStatus('connected');
      setError(null);
    };

    // Listen for messages
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WSMessage;
        console.log('Received WebSocket message:', message);

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
    ws.onclose = (event) => {
      console.log('WebSocket disconnected', event.code, event.reason);
      setStatus('disconnected');
      wsRef.current = null;
    };

    // Connection error
    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('WebSocket connection error');
      setStatus('error');
    };

    // Cleanup on unmount or roomId change
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, 'Component unmounted');
      }
      wsRef.current = null;
    };
  }, [roomId]);

  return {
    gameState,
    status,
    isConnected: status === 'connected',
    error,
    sendMessage
  };
}
