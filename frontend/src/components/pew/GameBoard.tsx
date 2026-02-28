import { useEffect, useRef } from 'react';
import { type Direction, type GameState } from './client-copies';
import { PlayerClient } from './client-copies/PlayerClient';
import { GameCanvas } from './GameCanvas';
import { useGameKeyPress } from './useGameKeyPress';
import type { JoinRoomResponse } from './useJoinRoom';

interface GameBoardProps extends JoinRoomResponse {
  gameState: GameState;
  sendMessage: (message: unknown) => boolean;
}

const DRIFT_THRESHOLD = 8;
const LERP_FACTOR = 0.3;

export const GameBoard = ({ roomId, playerId, level, gameState, sendMessage }: GameBoardProps) => {
  const { players } = gameState;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerClientRef = useRef<PlayerClient | null>(null);
  const isSpawningRef = useRef<boolean>(false);

  useEffect(() => {
    if (!playerId || playerClientRef.current) return;

    const currentPlayer = players?.find((p) => p.playerId === playerId);
    if (currentPlayer) {
      playerClientRef.current = new PlayerClient(currentPlayer.x, currentPlayer.y, currentPlayer.speed);
    }
  }, [playerId, players]);

  useEffect(() => {
    if (!playerId) return;
    const currentPlayer = players?.find((p) => p.playerId === playerId);
    isSpawningRef.current = currentPlayer?.isSpawning ?? false;
  }, [playerId, players]);

  useEffect(() => {
    if (!playerId || !playerClientRef.current) return;

    const currentPlayer = players?.find((p) => p.playerId === playerId);
    if (!currentPlayer) return;

    if (currentPlayer.isSpawning || currentPlayer.isDestroyed) {
      playerClientRef.current.setPlayerPosition(currentPlayer.x, currentPlayer.y);
      return;
    }

    const dx = Math.abs(currentPlayer.x - playerClientRef.current.x);
    const dy = Math.abs(currentPlayer.y - playerClientRef.current.y);

    if (dx > DRIFT_THRESHOLD || dy > DRIFT_THRESHOLD) {
      const newX = playerClientRef.current.x + (currentPlayer.x - playerClientRef.current.x) * LERP_FACTOR;
      const newY = playerClientRef.current.y + (currentPlayer.y - playerClientRef.current.y) * LERP_FACTOR;
      playerClientRef.current.setPlayerPosition(newX, newY);
    }
  }, [playerId, players]);

  const handleMovement = (direction: Direction) => {
    if (roomId && playerId && playerClientRef.current && !isSpawningRef.current) {
      playerClientRef.current.updatePosition(direction, level);
      sendMessage({ type: 'update-movement', data: { direction } });
    }
  };

  const handleFire = (direction: Direction) => {
    if (roomId && playerId && !isSpawningRef.current) {
      sendMessage({ type: 'fire', data: { direction } });
    }
  };

  useGameKeyPress(
    [
      { key: 'w', callback: () => handleMovement('UP') },
      { key: 'a', callback: () => handleMovement('LEFT') },
      { key: 's', callback: () => handleMovement('DOWN') },
      { key: 'd', callback: () => handleMovement('RIGHT') },
      { key: 'ArrowUp', callback: () => handleFire('UP') },
      { key: 'ArrowLeft', callback: () => handleFire('LEFT') },
      { key: 'ArrowDown', callback: () => handleFire('DOWN') },
      { key: 'ArrowRight', callback: () => handleFire('RIGHT') }
    ],
    canvasRef
  );

  useEffect(() => {
    if (!roomId || !playerId) return;
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, [roomId, playerId]);

  if (!roomId || !playerId) {
    return null;
  }

  return <GameCanvas canvasRef={canvasRef} gameState={gameState} level={level} playerId={playerId} playerClientRef={playerClientRef} />;
};
