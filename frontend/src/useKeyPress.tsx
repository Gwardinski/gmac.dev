import { useCallback, useEffect, useRef } from 'react';

type KeyEvent = {
  key: string;
  callback: () => void;
};

export const useKeyPress = (keyEvents: KeyEvent[]) => {
  const pressedKeys = useRef<Set<string>>(new Set());
  const animationFrameId = useRef<number | undefined>(undefined);

  const animateRef = useRef<(() => void) | undefined>(undefined);

  const animate = useCallback(() => {
    // Fire callbacks for all currently pressed keys
    pressedKeys.current.forEach((key) => {
      const keyEvent = keyEvents.find((ke) => ke.key === key);
      keyEvent?.callback();
    });

    // Continue the animation loop
    if (animateRef.current) {
      animationFrameId.current = requestAnimationFrame(animateRef.current);
    }
  }, [keyEvents]);

  animateRef.current = animate;

  useEffect(() => {
    const abortController = new AbortController();

    const onKeyDown = (e: KeyboardEvent) => {
      if (!pressedKeys.current.has(e.key)) {
        pressedKeys.current.add(e.key);
        // Start animation loop if this is the first key pressed
        if (pressedKeys.current.size === 1) {
          animate();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key);
      // Stop animation loop if no keys are pressed
      if (pressedKeys.current.size === 0 && animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };

    window.addEventListener('keydown', onKeyDown, { signal: abortController.signal });
    window.addEventListener('keyup', onKeyUp, { signal: abortController.signal });

    return () => {
      abortController.abort();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);
};
