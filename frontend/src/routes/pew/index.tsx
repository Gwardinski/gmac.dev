import { Card, CardHeader, H1, H1Description } from '@/components/gmac.ui';
import { Page } from '@/components/layout';
import { GameBoard } from '@/components/pew/GameBoard';
import { GameChat } from '@/components/pew/GameChat';
import { GameControls } from '@/components/pew/GameControls';
import { GameDebugButton } from '@/components/pew/GameDebugButton';
import { GameJoinForm } from '@/components/pew/GameJoinForm';
import { GameLeaveButton } from '@/components/pew/GameLeaveButton';
import { GameRoomsActive } from '@/components/pew/GameRoomsActive';
import { GameScore } from '@/components/pew/GameScore';
import { GameShareButton } from '@/components/pew/GameShareButton';
import { GameStateProvider, useLocalGameState } from '@/components/pew/useGetGameState';
import { useVariantState } from '@/components/VariantToggle';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/pew/')({
  component: RouteComponent
});

function RouteComponent() {
  const { variant } = useVariantState();
  return (
    <Page>
      <Card as="header" variant={variant} theme="gray">
        <CardHeader column>
          <H1>Pew</H1>
          <H1Description>Has free access to professional game engines</H1Description>
          <H1Description>uses Javascript</H1Description>
        </CardHeader>
      </Card>

      <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
        <GameStateProvider>
          <GameContent />
        </GameStateProvider>
      </div>
    </Page>
  );
}

function GameContent() {
  const roomId = useLocalGameState((s) => s.roomId);
  const status = useLocalGameState((s) => s.status);
  const hasRoom = Boolean(roomId);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <GameControls />
        {hasRoom && <GameScore />}
        <div className="flex h-[88px] flex-col justify-between">
          {hasRoom && <GameShareButton />}
          {hasRoom && <GameLeaveButton />}
        </div>
      </div>
      {!hasRoom && <GameJoinForm />}
      {!hasRoom && <GameRoomsActive />}
      {hasRoom && (
        <div className="flex w-full flex-col items-center gap-4">
          {status === 'connecting' && <p className="text-center text-amber-500">Establishing battlefield control, stand by...</p>}
          {status === 'disconnected' && <p className="text-center text-amber-500">Disconnected. Refresh page, and re-join game.</p>}
          {status === 'error' && <p className="text-center text-red-500">Connection failed. Refresh Page.</p>}
          {status === 'connected' && (
            <div className="flex flex-wrap items-stretch gap-4">
              <GameBoard />
              <GameChat />
            </div>
          )}
          {hasRoom && <GameDebugButton />}
        </div>
      )}
    </>
  );
}
