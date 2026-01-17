import { useCallback, useEffect } from 'react';

type KeyEvent = {
  key: string;
  callback: () => void;
};

export const useKeyPress = (keyEvents: KeyEvent[]) => {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const keyEvent = keyEvents.find(({ key }) => key === e.key);
      keyEvent?.callback();
    },
    [keyEvents]
  );
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);
};
