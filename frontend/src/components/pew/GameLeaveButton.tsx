import { Button } from '../gmac.ui';
import { useGameActions } from './useGetGameState';

export const GameLeaveButton = () => {
  const { onLeave } = useGameActions();

  return (
    <Button onClick={onLeave} className="w-[180px]" theme="red">
      Leave Game
    </Button>
  );
};
