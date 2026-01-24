import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { useForm } from '@tanstack/react-form';
import { COLORS, type Color } from './game-state';
import { joinGameSchema, useJoinRoom } from './useJoinRoom';

const savedPlayerName = localStorage.getItem('player-name') || '';
const savedPlayerColor = (localStorage.getItem('player-color') as Color) || 'RED';
const savedRoomCode = localStorage.getItem('room-code') || '';
const savedRoomName = localStorage.getItem('room-name') || '';

interface GameJoinFormProps {
  onJoinSuccess: (roomId: string) => void;
}

export function GameJoinForm({ onJoinSuccess }: GameJoinFormProps) {
  const { mutate, isPending } = useJoinRoom();

  const form = useForm({
    defaultValues: {
      playerName: savedPlayerName,
      roomCode: savedRoomCode,
      roomName: savedRoomName,
      playerColor: savedPlayerColor
    },
    validators: {
      onSubmit: joinGameSchema
    },
    onSubmit: async ({ value }) => {
      localStorage.setItem('player-name', value.playerName);
      localStorage.setItem('player-color', value.playerColor);
      localStorage.setItem('room-code', value.roomCode);
      localStorage.setItem('room-name', value.roomName);
      mutate(value, {
        onSuccess: ({ value }) => {
          localStorage.setItem('room-id', value.roomId);
          onJoinSuccess?.(value.roomId);
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
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <form.Field name="playerColor">
              {(field) => (
                <RadioGroup value={field.state.value} onValueChange={(value) => field.handleChange(value as Color)} className="flex flex-wrap justify-center gap-2">
                  {COLORS.map((color) => (
                    <label key={color} className="relative cursor-pointer" title={color}>
                      <RadioGroupItem
                        value={color}
                        className={`size-10 border-2 ${field.state.value === color ? 'ring-offset-background ring-2 ring-offset-2' : ''}`}
                        style={{
                          backgroundColor: color.toLowerCase()
                        }}
                      />
                    </label>
                  ))}
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
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex w-full justify-evenly">
          <Button className="flex-1" type="submit" form="game-join-form" disabled={isPending}>
            Join Game
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
