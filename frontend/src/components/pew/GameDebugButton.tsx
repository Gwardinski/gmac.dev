import { BugIcon } from 'lucide-react';
import { Button } from '../ui';
import { useLocalGameState } from './useGetGameState';

export const GameDebugButton = () => {
  const debugEnabled = useLocalGameState((s) => s.debugEnabled);
  const setDebugEnabled = useLocalGameState((s) => s.setDebugEnabled);

  return (
    <span className="flex items-center gap-2">
      <Button size="icon" onClick={() => setDebugEnabled(!debugEnabled)} variant={debugEnabled ? 'glass-danger' : 'glass'}>
        <BugIcon />
      </Button>
      {debugEnabled && <p className="text-xs text-black dark:text-white">Debug Mode</p>}
    </span>
  );
};
