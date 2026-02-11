import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { BACKEND_URL, type APIResponse } from './game-api';
import { COLORS_SCHEMA } from './game-state';

export const joinGameSchema = z.object({
  roomName: z.string().min(3, 'Room name must be at least 3 characters.').max(20, 'Room name must be at most 20 characters.'),
  roomCode: z.string().min(4, 'Room code must be at least 4 characters.').max(4, 'Room code must be at most 4 characters.'),
  playerName: z.string().min(3, 'Player name must be at least 3 characters.').max(12, 'Player name must be at most 12 characters.'),
  playerColour: COLORS_SCHEMA,
  playerDeviceId: z.string(),
  playerId: z.string().nullable()
});

export type JoinGameFormData = z.infer<typeof joinGameSchema>;

export type JoinRoomResponse = {
  roomId: string;
  playerId: string;
  level: number[][];
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

  const data: APIResponse<JoinRoomResponse> = await response.json();

  if (data.error && (!data.validationErrors || data.validationErrors.length === 0)) {
    throw new Error(data.error);
  }

  return data;
}
