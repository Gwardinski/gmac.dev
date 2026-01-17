import { Button } from "../ui";
import { useGetGameState } from "./useGetGameState";


export const GameRoomDetails = () => {

  const gameState = useGetGameState();
  const currentRoom = localStorage.getItem("room-code") || "";

  return (
    <div className="flex items-center gap-4 glass dark:dark-glass px-4 py-2 rounded-md text-sm">
      <span>
        Room: <span className="font-bold tracking-wider">{currentRoom}</span> • Players: <span className="font-bold">{gameState.players.length}</span>
      </span>
      <Button
        size="sm"
        variant="glass"
        onClick={() => window.location.reload()}
      >
        Leave Room
      </Button>
    </div>
  );
}