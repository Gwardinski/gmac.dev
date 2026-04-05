import { IconBug } from '@tabler/icons-react';
import { IconButton } from '../gmac.ui';
import { useLocalGameState } from './useGetGameState';

export const GameDebugButton = () => {
  const debugEnabled = useLocalGameState((s) => s.debugEnabled);
  const setDebugEnabled = useLocalGameState((s) => s.setDebugEnabled);

  return (
    <span className="flex items-center gap-2">
      <IconButton onClick={() => setDebugEnabled(!debugEnabled)} variant={debugEnabled ? 'outline' : 'ghost'} theme={debugEnabled ? 'red' : 'gray'}>
        <IconBug />
      </IconButton>
      {debugEnabled && <p className="text-xs text-black dark:text-white">Debug Mode</p>}
    </span>
  );
};
