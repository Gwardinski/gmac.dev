import { GameChat } from '@/components/game/GameChat';
import { GameControls } from '@/components/game/GameControls';
import { GameJoinForm } from '@/components/game/GameJoinForm';
import { GamePlayerStats } from '@/components/game/GamePlayerStats';
import { GameRoomDetails } from '@/components/game/GameRoomDetails';
import { useGameChat, useGetGameState, useGetSocketId, usePlayerMove, usePlayerShoot } from '@/components/game/useGetGameState';
import { Page, PageHeader, PageHeading, PageSection } from '@/components/layout';
import { H1, H1Description } from '@/components/ui/typography';
import { useKeyPress } from '@/useKeyPress';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useRef } from 'react';

export const Route = createFileRoute('/pew/')({
  component: RouteComponent
});

function RouteComponent() {
  const gameState = useGetGameState();
  const messages = useGameChat(); // Move this up so listener is always active

  const socketId = useGetSocketId();
  const { playerMove } = usePlayerMove(socketId);
  const { playerShoot } = usePlayerShoot(socketId);

  const keyEvents = useMemo(
    () => [
      { key: 'w', callback: () => playerMove('UP') },
      { key: 'a', callback: () => playerMove('LEFT') },
      { key: 'd', callback: () => playerMove('RIGHT') },
      { key: 's', callback: () => playerMove('DOWN') },
      { key: 'ARROW_UP', callback: () => playerShoot('UP') },
      { key: 'ARROW_LEFT', callback: () => playerShoot('LEFT') },
      { key: 'ARROW_RIGHT', callback: () => playerShoot('RIGHT') },
      { key: 'ARROW_DOWN', callback: () => playerShoot('DOWN') }
    ],
    [playerMove, playerShoot, socketId]
  );

  useKeyPress(keyEvents);

  const playerActive = gameState.players.some((player) => player.socketId === socketId);

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Pew</H1>
          <H1Description>Work-in-Progress. Websockets are hard</H1Description>
        </PageHeading>
      </PageHeader>

      <PageSection className="flex flex-col items-center justify-center gap-4 font-mono">
        <GameControls />

        {!playerActive && <GameJoinForm />}

        {playerActive && (
          <>
            <div className="flex h-full gap-2">
              <GameBoard />
              <aside className="flex min-h-full flex-col gap-2">
                <GameRoomDetails />
                <GameChat messages={messages} />
              </aside>
            </div>
            <GamePlayerStats />
          </>
        )}
      </PageSection>
    </Page>
  );
}

const GameBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gameState = useGetGameState();
  const { players } = gameState;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Clear the entire canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all players
    players.forEach((player) => {
      ctx.fillStyle = player.color.toLowerCase();
      ctx.fillRect(player.x, player.y, 40, 40);
      ctx.fillStyle = 'white';
      ctx.fillText(player.name, player.x, player.y + 64);
    });
  }); // No dependencies - run on every render to ensure canvas is always up to date

  return <canvas ref={canvasRef} id="game-canvas" width={800} height={600} className="mx-auto w-full max-w-2xl bg-black" />;
};
