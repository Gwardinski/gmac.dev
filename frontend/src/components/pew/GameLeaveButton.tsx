import { Button } from '../ui';
import { useGameActions } from './useGetGameState';

export const GameLeaveButton = () => {
  const { onLeave } = useGameActions();

  return (
    <Button onClick={onLeave} className="w-[180px]" variant="glass-danger">
      Leave Game
    </Button>
  );
};
