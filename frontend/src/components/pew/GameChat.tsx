import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { Card, CardBody, CardFooter, Input } from '../gmac.ui';
import { useVariantState } from '../VariantToggle';
import { colorToHex } from './client-copies';
import { useGameActions, useLocalGameState } from './useGetGameState';

const inputFormSchema = z.object({
  chatContent: z.string().min(1, 'Message cannot be empty')
});

export const GameChat = () => {
  const { variant } = useVariantState();
  const chats = useLocalGameState((s) => s.chats);
  const { sendChat } = useGameActions();

  const form = useForm({
    defaultValues: {
      chatContent: ''
    },
    validators: {
      onSubmit: inputFormSchema
    },
    onSubmit: async ({ value, formApi }) => {
      const message = value.chatContent;
      sendChat(message);
      formApi.reset();
    }
  });

  return (
    <Card variant={variant} className="max-h-[640px] w-fit min-w-sm">
      <CardBody>
        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
          {chats.length === 0 && <p className="text-sm text-gray-400">No messages yet...</p>}
          {chats
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((chat) => (
              <p key={chat.chatId} className={`text-sm ${chat.isSystem ? 'pl-[2px] uppercase' : ''}`} style={{ color: colorToHex(chat.playerColour) || 'gray' }}>
                {chat.isSystem ? chat.content : `[${chat.playerName}] ${chat.content}`}
              </p>
            ))}
        </div>
      </CardBody>
      <CardFooter column>
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>
          <form.Field name="chatContent">
            {(field) => (
              <Input
                type="text"
                placeholder="..."
                className="mt-auto w-full rounded-md p-2 text-left"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <input type="submit" className="hidden" />
        </form>
      </CardFooter>
    </Card>
  );
};
