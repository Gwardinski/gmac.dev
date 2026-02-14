import { useState } from 'react';
import { Button } from '../ui';

export const GameShareButton = () => {
  const savedRoomName = localStorage.getItem('room-name') || '';
  const savedRoomCode = localStorage.getItem('room-code') || '';
  const [isCopied, setIsCopied] = useState(false);

  if (!savedRoomName || !savedRoomCode) {
    return null;
  }

  function onCopy() {
    copyToClipboard(getGameLink(savedRoomName, savedRoomCode));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <Button onClick={onCopy} disabled={isCopied} className="w-[180px]">
      {isCopied ? 'Copied!' : 'Share Room Link'}
    </Button>
  );
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function getGameLink(roomName: string, roomCode: string) {
  return `Join me for a game of Pew! 
Room Name: ${roomName}
Room Code: ${roomCode}
${window.location.origin}/pew?room=${roomName}&code=${roomCode}
`;
}
