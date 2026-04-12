import { Card, CardHeader, Kbd } from '@/components/gmac.ui';
import { useVariantState } from '../VariantToggle';

export const GameControls = () => {
  const { variant } = useVariantState();
  return (
    <Card variant={variant} className="h-[106px] w-fit">
      <CardHeader>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="flex flex-wrap gap-1">
            <Kbd>W</Kbd>
            <Kbd>A</Kbd>
            <Kbd>S</Kbd>
            <Kbd>D</Kbd>
          </span>
          MOVE
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="flex flex-wrap gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <Kbd>←</Kbd>
            <Kbd>→</Kbd>
          </span>
          SHOOT
        </div>
      </CardHeader>
    </Card>
  );
};
