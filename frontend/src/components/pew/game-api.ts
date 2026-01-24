import { useQuery } from '@tanstack/react-query';
import type { Color } from './game-state';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface APIResponse<T> {
  status: number;
  value: T;
  error?: string;
  validationErrors?: any[]; // todo: replace with zod4 validation error model
}

type RoomListItem = {
  roomName: string;
  playerCount: number;
};

export type Room = {
  roomId: string;
  gameId: string;
  roomName: string;
  roomCode: string;
};

export type GameState = {
  roomId: string;
  gameId: string;
  roomCode: string;
  players: Array<{
    playerId: string;
    playerName: string;
    playerColour: Color;
    x: number;
    y: number;
  }>;
};

// ---------------------------------
// API FUNCTIONS
// ---------------------------------

// Get Live Rooms
async function fetchRooms(): Promise<RoomListItem[]> {
  const response = await fetch(`${BACKEND_URL}/pew/rooms`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log('response', response);

  if (!response.ok) {
    throw new Error('Failed to fetch rooms');
  }

  const data: APIResponse<RoomListItem[]> = await response.json();

  if (!data.value) {
    throw new Error(data.error || 'Failed to fetch rooms');
  }

  return data.value;
}

export const useFetchRooms = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    staleTime: 1000 * 5 // 5 seconds
  });

  return { data, isLoading, error };
};
