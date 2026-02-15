import { useCallback, useEffect, useRef, type RefObject } from 'react';

type KeyEvent = {
  key: string;
  callback: () => void;
};

function isGameFocused<T>(focusElement: RefObject<T | null>) {
  return document.activeElement === focusElement.current;
}

export function useGameKeyPress<T>(keyEvents: KeyEvent[], focusElement: RefObject<T | null>) {
  const pressedKeys = useRef<Set<string>>(new Set());
  const animationFrameId = useRef<number | undefined>(undefined);
  const keyEventsRef = useRef<KeyEvent[]>(keyEvents);
  const isAnimating = useRef<boolean>(false);
  const focusElementRef = useRef(focusElement);

  keyEventsRef.current = keyEvents;
  focusElementRef.current = focusElement;

  const animate = useCallback(() => {
    if (isGameFocused(focusElementRef.current)) {
      pressedKeys.current.forEach((key) => {
        const keyEvent = keyEventsRef.current.find((ke) => ke.key === key);
        keyEvent?.callback();
      });
    }

    // Continue the animation loop if there are still keys pressed
    if (pressedKeys.current.size > 0) {
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      isAnimating.current = false;
    }
  }, []); // No dependencies, use refs instead

  useEffect(() => {
    const abortController = new AbortController();

    const onKeyDown = (e: KeyboardEvent) => {
      const isGameKey = keyEventsRef.current.some((ke) => ke.key === e.key);
      const isFocused = isGameFocused(focusElementRef.current);

      // stop browser scrolling on arrow key press
      if (isGameKey && isFocused) {
        e.preventDefault();
      }

      // Check focus dynamically on each keydown
      if (!pressedKeys.current.has(e.key) && isFocused) {
        pressedKeys.current.add(e.key);
        if (!isAnimating.current) {
          isAnimating.current = true;
          animate();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key);
      // Animation loop will stop itself when no keys are pressed
    };

    const onBlur = () => {
      // Clear all pressed keys when focus is lost
      pressedKeys.current.clear();
      // Animation will stop on next frame when it sees no keys pressed
    };

    window.addEventListener('keydown', onKeyDown, { signal: abortController.signal });
    window.addEventListener('keyup', onKeyUp, { signal: abortController.signal });

    // Listen for blur events on the focus element
    const element = focusElementRef.current?.current;
    if (element && element instanceof EventTarget) {
      element.addEventListener('blur', onBlur, { signal: abortController.signal });
    }

    return () => {
      abortController.abort();
      // Only cancel animation frame on unmount
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        isAnimating.current = false;
      }
    };
  }, [animate]); // animate is stable now
}
