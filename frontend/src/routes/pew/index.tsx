import { Page, PageHeader, PageHeading, PageSection } from '@/components/layout';
import type { Level } from '@/components/pew/client-copies';
import { GameBoard } from '@/components/pew/GameBoard';
import { GameChat } from '@/components/pew/GameChat';
import { GameControls } from '@/components/pew/GameControls';
import { GameJoinForm } from '@/components/pew/GameJoinForm';
import { GameLeaveButton } from '@/components/pew/GameLeaveButton';
import { GameRoomsActive } from '@/components/pew/GameRoomsActive';
import { GameScore } from '@/components/pew/GameScore';
import { GameShareButton } from '@/components/pew/GameShareButton';
import { useGetGameState } from '@/components/pew/useGetGameState';
import type { JoinRoomResponse } from '@/components/pew/useJoinRoom';
import { H1, H1Description } from '@/components/ui/typography';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/pew/')({
  component: RouteComponent
});

function RouteComponent() {
  const [roomId, setRoomId] = useState<string | null>(localStorage.getItem('room-id') || null);
  const [playerId, setPlayerId] = useState<string | null>(localStorage.getItem('player-id') || null);
  const [level, setLevel] = useState<Level | null>(null);

  const { gameState, chats, isConnected, sendMessage, sendChat } = useGetGameState(roomId, playerId);
  const showLoginForm = !isConnected;

  useEffect(() => {
    if (!isConnected) {
      setRoomId(null);
      setPlayerId(null);
      setLevel(null);
    }
  }, [isConnected]);

  function onJoinSuccess({ roomId, playerId, level }: JoinRoomResponse) {
    setRoomId(roomId);
    setPlayerId(playerId);
    setLevel(level);
  }

  function onLeave() {
    sendMessage({ type: 'leave-room' });
    setRoomId(null);
    setPlayerId(null);
    setLevel(null);
  }

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
        <div className="flex flex-wrap items-center justify-center gap-4">
          <GameControls />
          {!showLoginForm && <GameScore roomId={roomId ?? ''} playerId={playerId ?? ''} />}
          <div className="flex h-[88px] flex-col justify-between">
            {!showLoginForm && <GameShareButton />}
            {!showLoginForm && <GameLeaveButton onLeave={onLeave} />}
          </div>
        </div>
        {showLoginForm && <GameJoinForm onJoinSuccess={onJoinSuccess} />}
        {showLoginForm && <GameRoomsActive />}
        {!showLoginForm && level && (
          <div className="flex flex-wrap items-stretch gap-4">
            <GameBoard roomId={roomId ?? ''} playerId={playerId ?? ''} level={level} gameState={gameState} sendMessage={sendMessage} />
            <GameChat chats={chats} onSendChat={sendChat} />
          </div>
        )}
      </PageSection>
    </Page>
  );
}
