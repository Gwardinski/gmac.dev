import { useEffect, type RefObject } from 'react';
import { useGameActions } from './useGetGameState';

export function useGameInput(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const { registerMovementKey, registerAimKey } = useGameActions();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== canvasRef.current) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'a' || k === 's' || k === 'd') registerMovementKey(k as 'w' | 'a' | 's' | 'd', true);
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        registerAimKey(e.key, true);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'a' || k === 's' || k === 'd') registerMovementKey(k as 'w' | 'a' | 's' | 'd', false);
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        registerAimKey(e.key, false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [registerMovementKey, registerAimKey, canvasRef]);
}
