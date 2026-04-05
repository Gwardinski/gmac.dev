import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cn } from './utils';

function Separator({ className, orientation = 'horizontal', ...props }: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn('shrink-0 bg-gray-300 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch dark:bg-gray-600', className)}
      {...props}
    />
  );
}

export { Separator };
