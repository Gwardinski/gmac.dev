import { useEffect, useRef, useState } from 'react';
import type { GameState, Message } from './client-copies';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const WS_URL = BACKEND_URL.replace('http', 'ws');

// WebSocket message types - matches backend structure
type WSMessage = { type: 'game-state'; data: GameState } | { type: 'new-chat'; data: Message } | { error: string };

// WebSocket connection states
type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useGetGameState(roomId: string | null, playerId: string | null) {
  const [gameState, setGameState] = useState<GameState>({ players: [], bullets: [] });
  const [chats, setChats] = useState<Message[]>([]);
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

  // Function to send chat messages
  const sendChat = (chatContent: string) => {
    return sendMessage({
      type: 'send-chat',
      data: { chatContent }
    });
  };

  // WebSocket effect for game state
  useEffect(() => {
    if (!roomId || !playerId) {
      setStatus('disconnected');
      return;
    }

    setStatus('connecting');

    // race conditions when joining a room
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
            setGameState(message.data);
            setError(null);
          }

          if (message.type === 'new-chat') {
            setChats((prev) => [...prev, message.data]);
            setError(null);
          }
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
      setChats([]); // Clear chats on disconnect
      // Don't set status here - it causes state updates during cleanup
    };
  }, [roomId, playerId]);

  return {
    gameState,
    chats,
    status,
    isConnected: status === 'connected',
    error,
    sendMessage,
    sendChat
  };
}
