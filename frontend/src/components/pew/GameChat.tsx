import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { Input } from '../ui';
import type { Message } from './client-copies';

const inputFormSchema = z.object({
  messageContent: z.string().min(1, 'Message cannot be empty')
});

export const GameChat = ({ messages, onSendMessage }: { messages: Message[]; onSendMessage: (message: string) => void }) => {
  const form = useForm({
    defaultValues: {
      messageContent: ''
    },
    validators: {
      onSubmit: inputFormSchema
    },
    onSubmit: async ({ value, formApi }) => {
      const message = value.messageContent;
      onSendMessage(message);
      formApi.reset();
    }
  });

  return (
    <section className="flex max-h-[640px] min-w-sm flex-col gap-2 self-stretch rounded-md glass p-2 dark:dark-glass">
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
        {messages
          ?.sort((a, b) => b.timestamp - a.timestamp)
          .map((message) => (
            <p key={message.timestamp} className="text-sm" style={{ color: message.playerColour.toLowerCase() }}>
              {message.isGameMessage ? message.messageContent : `[${message.playerName}] ${message.messageContent}`}
            </p>
          ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <form.Field name="messageContent">
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
    </section>
  );
};
