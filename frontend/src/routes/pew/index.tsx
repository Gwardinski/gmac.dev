import { Page, PageHeader, PageHeading, PageSection } from '@/components/layout';
import { GameControls } from '@/components/pew/GameControls';
import { GameJoinForm } from '@/components/pew/GameJoinForm';
import { GameRoomsActive } from '@/components/pew/GameRoomsActive';
import { useGetGameState } from '@/components/pew/useGetGameState';
import { H1, H1Description } from '@/components/ui/typography';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

export const Route = createFileRoute('/pew/')({
  component: RouteComponent
});

function RouteComponent() {
  const [roomId, setRoomId] = useState<string | null>();

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
        {!roomId && <GameJoinForm onJoinSuccess={setRoomId} />}
        {roomId && <GameBoard roomId={roomId} />}

        <GameRoomsActive />
      </PageSection>
    </Page>
  );
}

const GameBoard = ({ roomId }: { roomId: string }) => {
  const { gameState } = useGetGameState(roomId);
  const { players } = gameState;

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    players?.forEach((player) => {
      ctx.fillStyle = player.playerColour.toLowerCase();
      ctx.fillRect(player.x, player.y, 40, 40);
      ctx.fillStyle = 'white';
      ctx.fillText(player.playerName, player.x, player.y + 64);
    });
  }); // No dependencies - run on every render to ensure canvas is always up to date

  return <canvas ref={canvasRef} id="game-canvas" width={800} height={600} className="mx-auto w-full max-w-2xl bg-black" />;
};
