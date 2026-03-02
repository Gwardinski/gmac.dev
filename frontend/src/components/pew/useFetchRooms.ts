import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL, type APIResponse } from './api-models';

type RoomListItem = {
  roomName: string;
  playerCount: number;
};

async function fetchRooms(): Promise<RoomListItem[]> {
  const response = await fetch(`${BACKEND_URL}/pew/rooms`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

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
    staleTime: 1000 * 5,
    refetchInterval: 1000 * 3,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true
  });

  return { data, isLoading, error };
};
