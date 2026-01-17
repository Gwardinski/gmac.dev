import { createFileRoute } from "@tanstack/react-router";
import {
  Page,
  PageHeader,
  PageHeading,
  PageSection,
} from "@/components/layout";
import { H1, H1Description, H3 } from "@/components/ui/typography";
import { io } from "socket.io-client";
import { useKeyPress } from "@/useKeyPress";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";

const socket = io("http://localhost:8080");

export const Route = createFileRoute("/online/")({
  component: RouteComponent,
});

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const COLORS = [
  'RED',
  'BLUE',
  'GREEN',
  'YELLOW',
  'PURPLE',
  'ORANGE',
  'BROWN',
];
type Color = typeof COLORS[number];

type Player = {
  id: string;
  name: string;
  color: Color;
  x: number;
  y: number;
};

type GameState = {
  players: Player[];
};

const GAME_STATE: GameState = {
  players: [],
};

function RouteComponent() {
  const [playerName, setPlayerName] = useState<string>("");
  const [playerColor, setPlayerColor] = useState<Color>("RED");
  const updatePosition = useUpdatePosition();
  const playerId = useGetPlayerId(playerName);

  useKeyPress([
    { key: "ArrowUp", callback: () => updatePosition(playerId, "UP") },
    { key: "ArrowLeft", callback: () => updatePosition(playerId, "LEFT") },
    { key: "ArrowRight", callback: () => updatePosition(playerId, "RIGHT") },
    { key: "ArrowDown", callback: () => updatePosition(playerId, "DOWN") },
  ]);

  function onCreatePlayer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("player-name") as string;
    if (name.length < 3 || name.length > 10) {
      return;
    }
    setPlayerName(name);
    createPlayer(name);
  }

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Socket.io Play</H1>
          <H1Description>shooty shooty?</H1Description>
        </PageHeading>
      </PageHeader>

      <PageSection>
        

        <form onSubmit={onCreatePlayer} className="flex flex-col w-full max-w-md mx-auto gap-2 bg-black/50 p-4 rounded-md">
          <Input type="text" placeholder="Player Name" name="player-name" />
            <span className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <Button key={color} type="button" variant={playerColor === color ? 'default' : 'glass'} className={`bg-${color.toLowerCase()}-500`} onClick={() => setPlayerColor(color)}>{color}</Button>
              ))}
            
            </span>
          <Button type="submit">Play</Button>
        </form>


        <p>your id: {playerId}</p>
        <GameBoard />
      </PageSection>
    </Page>
  );
}

const GameBoard = () => {
  const {players} = useGetGameState();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      // Clear the entire canvas before redrawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      players.forEach((player) => {
        ctx.fillStyle = player.color.toLowerCase();
        ctx.fillRect(player.x, player.y, 10, 10);
        ctx.fillText(player.name, player.x + 10, player.y + 10);
      });
    }
  }, [players]);

  return (
    <>
    
    <canvas 
      ref={canvasRef}
      id="game-canvas" 
      width={800}
      height={600}
      className="bg-black w-full max-w-2xl mx-auto" 
      />

    <div className="flex flex-col gap-2">
      <p>server output</p>
      {players.map((player) => (
        <div key={player.id}>
          <div>{player.id}</div>
          <div>{player.name}</div>
          <div>{player.color}</div>
          <div>{player.x}</div>
          <div>{player.y}</div>
        </div>
      ))}
      </div>
      </>
  );
};

const createPlayer = (name: string) => {
  socket.emit("create-player", name);
};

const useGetPlayerId = (playerName: string) => {
  const [playerId, setPlayerId] = useState<string>("");
  useEffect(() => {
    if (!playerName) return;
    socket.on(`create-player-${playerName}`, (playerId) => {
      setPlayerId(playerId);
    });
  }, [playerName]);
  return playerId;
};

const useGetGameState = () => {
  const [gameState, setGameState] = useState<GameState>(GAME_STATE);
  
  socket.on("game-state", (gameState: GameState) => {
    setGameState(gameState);
  });
  
  return gameState;
};

const useUpdatePosition = () => {
  const updatePosition = (playerId: string, direction: Direction) => {
    socket.emit("update-position", { playerId, direction });
  };
  return updatePosition;
};