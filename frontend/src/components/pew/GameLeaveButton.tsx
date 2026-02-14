import { Button } from '../ui';

export const GameLeaveButton = ({ onLeave }: { onLeave: () => void }) => {
  return (
    <Button onClick={onLeave} className="w-[180px]" variant="glass-danger">
      Leave Game
    </Button>
  );
};
