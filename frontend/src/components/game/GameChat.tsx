export const GameChat = ({ messages }: { messages: string[] }) => {



  
  return (
    <div className="flex flex-col gap-2 glass dark:dark-glass p-4 rounded-md min-w-sm">
      {messages.map((message, index) => (
        <p key={index} className="text-sm">{message}</p>
      ))}
    </div>
  );
};