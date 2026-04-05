import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { IconCheck } from '@tabler/icons-react';
import { cn } from './utils';

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-gray-300 transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/50 aria-invalid:border-red-700 aria-invalid:ring-3 aria-invalid:ring-red-700/20 aria-invalid:aria-checked:border-blue-600 data-checked:border-blue-600 data-checked:bg-blue-600 data-checked:text-white dark:border-gray-600 dark:bg-gray-800/30 dark:data-checked:bg-blue-600 dark:aria-invalid:border-red-500 dark:aria-invalid:ring-red-500/40 group-has-disabled/field:opacity-50 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}>
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current transition-none [&>svg]:size-3.5">
        <IconCheck />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
