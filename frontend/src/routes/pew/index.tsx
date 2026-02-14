import { Page, PageHeader, PageHeading, PageSection } from '@/components/layout';
import { GameBoard } from '@/components/pew/GameBoard';
import { GameControls } from '@/components/pew/GameControls';
import { GameJoinForm } from '@/components/pew/GameJoinForm';
import { GameRoomsActive } from '@/components/pew/GameRoomsActive';
import type { JoinRoomResponse } from '@/components/pew/useJoinRoom';
import { H1, H1Description } from '@/components/ui/typography';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/pew/')({
  component: RouteComponent
});

function RouteComponent() {
  const [roomId, setRoomId] = useState<string | null>(localStorage.getItem('room-id') || null);
  const [playerId, setPlayerId] = useState<string | null>(localStorage.getItem('player-id') || null);
  const [level, setLevel] = useState<number[][] | null>(null);

  const showLoginForm = !roomId || !playerId;

  function onJoinSuccess({ roomId, playerId, level }: JoinRoomResponse) {
    setRoomId(roomId);
    setPlayerId(playerId);
    setLevel(level);
  }

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>Pew</H1>
          <H1Description>Has free access to professional grade, state-of-the-art game engines</H1Description>
          <H1Description>uses Javascript</H1Description>
        </PageHeading>
      </PageHeader>

      <PageSection className="flex flex-col items-center justify-center gap-4 font-mono">
        <GameControls />
        {showLoginForm && <GameJoinForm onJoinSuccess={onJoinSuccess} />}
        <GameBoard roomId={roomId ?? ''} playerId={playerId ?? ''} level={level ?? []} />
        <GameRoomsActive />
      </PageSection>
    </Page>
  );
}
