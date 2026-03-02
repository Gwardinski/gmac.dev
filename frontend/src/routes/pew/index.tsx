import { Page, PageHeader, PageHeading, PageSection } from '@/components/layout';
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
import { H1, H1Description } from '@/components/ui/typography';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/pew/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Pew</H1>
          <H1Description>Has free access to professional game engines</H1Description>
          <H1Description>uses Javascript</H1Description>
        </PageHeading>
      </PageHeader>
      <PageSection className="flex flex-col items-center justify-center gap-4 font-mono">
        <GameStateProvider>
          <GameContent />
        </GameStateProvider>
      </PageSection>
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
          {status === 'connecting' && <p className="text-center text-amber-500">Connecting…</p>}
          {status === 'disconnected' && <p className="text-center text-amber-500">Disconnected. Reconnecting…</p>}
          {status === 'error' && <p className="text-center text-red-500">Connection failed. Try again or leave.</p>}
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
