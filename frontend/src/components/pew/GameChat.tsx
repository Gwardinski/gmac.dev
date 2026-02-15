import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { Input } from '../ui';
import { colorToHex, type Message } from './client-copies';

const inputFormSchema = z.object({
  chatContent: z.string().min(1, 'Message cannot be empty')
});

export const GameChat = ({ chats, onSendChat }: { chats: Message[]; onSendChat: (message: string) => void }) => {
  const form = useForm({
    defaultValues: {
      chatContent: ''
    },
    validators: {
      onSubmit: inputFormSchema
    },
    onSubmit: async ({ value, formApi }) => {
      const message = value.chatContent;
      onSendChat(message);
      formApi.reset();
    }
  });

  return (
    <section className="flex max-h-[640px] min-w-sm flex-col gap-2 self-stretch rounded-md glass p-2 font-mono dark:dark-glass">
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
      <form
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
    </section>
  );
};
