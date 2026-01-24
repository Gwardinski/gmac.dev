import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { BACKEND_URL, type APIResponse } from './game-api';
import { COLORS } from './game-state';

export const joinGameSchema = z.object({
  playerName: z.string().min(3, 'Player name must be at least 3 characters.').max(20, 'Player name must be at most 20 characters.'),
  playerColor: z.enum(COLORS),
  roomCode: z.string().min(4, 'Room code must be at least 4 characters.').max(4, 'Room code must be at most 4 characters.'),
  roomName: z.string().min(3, 'Room name must be at least 3 characters.').max(20, 'Room name must be at most 20 characters.')
});

export type JoinGameFormData = z.infer<typeof joinGameSchema>;

type JoinRoomResponse = {
  roomId: string;
};

export const useJoinRoom = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: joinRoom
  });

  return { mutate, isPending, error };
};

async function joinRoom(request: JoinGameFormData): Promise<APIResponse<JoinRoomResponse>> {
  const response = await fetch(`${BACKEND_URL}/pew/join-room`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  console.log('response', response);

  if (!response.ok) {
    throw new Error('Failed to join room');
  }

  const data: APIResponse<JoinRoomResponse> = await response.json();

  return data;
}
