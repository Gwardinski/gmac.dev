import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { useForm } from '@tanstack/react-form';
import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { COLORS, colorToHex, type Color } from './client-copies';
import { mapAPIErrorsToForm } from './form-utils';
import { joinGameSchema, useJoinRoom, type JoinRoomResponse } from './useJoinRoom';

const savedPlayerName = localStorage.getItem('player-name') || '';
const savedPlayerColor = (localStorage.getItem('player-color') as Color) || 'RED';
const savedRoomCode = localStorage.getItem('room-code') || '';
const savedRoomName = localStorage.getItem('room-name') || '';

const route = getRouteApi('/pew/');

interface GameJoinFormProps {
  onJoinSuccess: (response: JoinRoomResponse) => void;
}

function createNewPlayerDeviceId() {
  return `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function GameJoinForm({ onJoinSuccess }: GameJoinFormProps) {
  const { mutate, isPending } = useJoinRoom();
  const [globalError, setGlobalError] = useState<string>('');

  const searchParams = route.useSearch();

  const sharedRoomCode = (searchParams as any)?.code?.toString().trim() ?? '';
  const sharedRoomName = (searchParams as any)?.room?.toString().trim() ?? '';

  const form = useForm({
    defaultValues: {
      playerName: (searchParams as any)?.playerName || savedPlayerName,
      roomCode: sharedRoomCode || savedRoomCode,
      roomName: sharedRoomName || savedRoomName,
      playerColour: (searchParams as any)?.playerColour || savedPlayerColor,
      playerId: localStorage.getItem('player-id') || null,
      playerDeviceId: localStorage.getItem('player-device-id') || createNewPlayerDeviceId()
    },
    validators: {
      onSubmit: joinGameSchema
    },
    onSubmit: async ({ value, formApi }) => {
      localStorage.setItem('player-name', value.playerName);
      localStorage.setItem('player-color', value.playerColour);
      localStorage.setItem('room-code', value.roomCode);
      localStorage.setItem('room-name', value.roomName);
      localStorage.setItem('player-device-id', value.playerDeviceId);
      mutate(value, {
        onSuccess: ({ validationErrors, error, value }) => {
          if (mapAPIErrorsToForm(validationErrors, formApi)) {
            return;
          }
          if (error) {
            console.error(error);
            setGlobalError(error);
            return;
          }
          if (!value?.playerId || !value?.roomId) {
            setGlobalError('Failed to join room. Please refresh the page and try again.');
            return;
          }
          localStorage.setItem('player-id', value.playerId);
          onJoinSuccess?.({ roomId: value.roomId, playerId: value.playerId, level: value.level });
        },
        onError: (error) => {
          setGlobalError(error.message);
        }
      });
    }
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardContent>
        <form
          id="game-join-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>
          <FieldGroup>
            <form.Field
              name="playerName"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Player Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Player Name"
                      autoComplete="off"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />
            <form.Field name="playerColour">
              {(field) => (
                <RadioGroup value={field.state.value} onValueChange={(value) => field.handleChange(value as Color)} className="flex flex-wrap justify-center gap-2">
                  {COLORS.filter((color) => color !== 'YELLOW').map((color) => (
                    <label key={color} className="relative cursor-pointer" title={color}>
                      <RadioGroupItem
                        value={color}
                        className={`size-10 border-2 ${field.state.value === color ? 'ring-offset-background ring-2 ring-offset-2' : ''}`}
                        style={{
                          backgroundColor: colorToHex(color)
                        }}
                      />
                    </label>
                  ))}
                  <FieldError errors={field.state.meta.errors} />
                </RadioGroup>
              )}
            </form.Field>
            <form.Field
              name="roomName"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Room Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      maxLength={20}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Room Name"
                      autoComplete="off"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />
            <form.Field
              name="roomCode"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Room Code</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      maxLength={4}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Room Code"
                      autoComplete="off"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field>
          <Button type="submit" form="game-join-form" disabled={isPending}>
            Join Game
          </Button>
          <FieldError className="text-center" errors={[{ message: globalError }]} />
        </Field>
      </CardFooter>
    </Card>
  );
}
