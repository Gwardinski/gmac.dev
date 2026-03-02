import { useEffect, useRef } from 'react';
import { GameCanvas } from './GameCanvas';
import { useGameInput } from './useGameInput';
import { useLocalGameState } from './useGetGameState';

export const GameBoard = () => {
  const { roomId, playerId, level } = useLocalGameState();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGameInput(canvasRef);

  useEffect(() => {
    if (!roomId || !playerId) return;
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, [roomId, playerId]);

  if (!roomId || !playerId || !level) {
    return null;
  }

  return <GameCanvas canvasRef={canvasRef} />;
};
