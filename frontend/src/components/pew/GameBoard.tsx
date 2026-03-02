import { useEffect, useRef } from 'react';
import { type Bearing } from './client-copies';
import { GameCanvas } from './GameCanvas';
import { useGameKeyPress } from './useGameKeyPress';
import { FRAME_TIME, useGameActions, useLocalGameState } from './useGetGameState';

// 0=right, 90=down, 180=left, 270=up. Combine keys for diagonal (e.g. w+d → 315°).
const MOVEMENT_MAP: Record<string, { dx: number; dy: number }> = {
  w: { dx: 0, dy: -1 },
  s: { dx: 0, dy: 1 },
  a: { dx: -1, dy: 0 },
  d: { dx: 1, dy: 0 }
};
const AIM_MAP: Record<string, { dx: number; dy: number }> = {
  ArrowUp: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 },
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 }
};

function keysToBearing(keys: Set<string>, map: Record<string, { dx: number; dy: number }>): Bearing | null {
  let dx = 0,
    dy = 0;
  keys.forEach((k) => {
    const v = map[k];
    if (v) {
      dx += v.dx;
      dy += v.dy;
    }
  });
  if (dx === 0 && dy === 0) return null;
  return Math.round((Math.atan2(dy, dx) * (180 / Math.PI) + 360) % 360) as Bearing;
}

export const GameBoard = () => {
  const { roomId, playerId, level, playerClient } = useLocalGameState();
  const { updatePlayerClientPosition, updatePlayerClientFire } = useGameActions();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const movementKeysRef = useRef<Set<string>>(new Set());
  const aimKeysRef = useRef<Set<string>>(new Set());
  const lastMovementFrameRef = useRef(0);
  const lastFireFrameRef = useRef(0);

  useEffect(() => {
    if (!roomId || !playerId) return;
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, [roomId, playerId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== canvasRef.current) return;
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) movementKeysRef.current.add(k);
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        aimKeysRef.current.add(e.key);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      movementKeysRef.current.delete(e.key.toLowerCase());
      aimKeysRef.current.delete(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useGameKeyPress(
    [
      { key: 'w', callback: () => handleMovement() },
      { key: 'a', callback: () => handleMovement() },
      { key: 's', callback: () => handleMovement() },
      { key: 'd', callback: () => handleMovement() },
      { key: 'ArrowUp', callback: () => handleFire() },
      { key: 'ArrowLeft', callback: () => handleFire() },
      { key: 'ArrowDown', callback: () => handleFire() },
      { key: 'ArrowRight', callback: () => handleFire() }
    ],
    canvasRef
  );

  function handleMovement() {
    if (!roomId || !playerId || !level || playerClient?.isSpawning) return;
    const now = performance.now();
    if (now - lastMovementFrameRef.current < FRAME_TIME - 1) return;
    lastMovementFrameRef.current = now;
    const bearing = keysToBearing(movementKeysRef.current, MOVEMENT_MAP);
    if (bearing !== null) updatePlayerClientPosition(bearing, level);
  }

  function handleFire() {
    if (!roomId || !playerId || !level || playerClient?.isSpawning) return;
    const now = performance.now();
    if (now - lastFireFrameRef.current < FRAME_TIME - 1) return;
    lastFireFrameRef.current = now;
    const bearing = keysToBearing(aimKeysRef.current, AIM_MAP);
    if (bearing !== null) updatePlayerClientFire(bearing);
  }

  if (!roomId || !playerId || !level) {
    return null;
  }

  return <GameCanvas canvasRef={canvasRef} />;
};
