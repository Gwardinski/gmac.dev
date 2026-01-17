import { useGetGameState } from "./useGetGameState";

export const GamePlayerStats = () => {
  const gameState = useGetGameState();
  const { players } = gameState;

  return (
    <div className="flex flex-col gap-2 glass dark:dark-glass p-4 rounded-md min-w-sm">
      <p>server output</p>
      {players.map((player) => (
        <div key={player.socketId}>
          <div>{player.socketId}</div>
          <div>{player.name}</div>
          <div>{player.color}</div>
          <div>{player.x}</div>
          <div>{player.y}</div>
        </div>
      ))}
    </div>
  );
};