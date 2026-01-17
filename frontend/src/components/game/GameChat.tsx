import { Input } from '../ui';

export const GameChat = ({ messages }: { messages: string[] }) => {
  return (
    <section className="flex h-full min-w-sm flex-col gap-2 rounded-md glass p-2 dark:dark-glass">
      <div className="flex-1 flex-col gap-1 p-2">
        {messages.map((message, index) => (
          <p key={index} className="text-sm">
            {message}
          </p>
        ))}
      </div>
      <Input type="text" placeholder="..." className="mt-auto w-full rounded-md p-2" />
    </section>
  );
};
