import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { forwardRef } from 'react';
import { cn } from './utils';

export const Input = forwardRef<HTMLInputElement, React.ComponentProps<'input'> & VariantProps<typeof inputVariants>>(({ className, type, variant = 'default', ...props }, ref) => {
  return <input ref={ref} type={type} data-slot={variant === 'group' ? 'input-group-control' : 'input'} className={cn(inputVariants({ variant }), className)} {...props} />;
});

Input.displayName = 'Input';

const inputVariants = cva(
  'h-10 w-full min-w-0 max-w-xl bg-transparent px-3 text-base text-gray-900 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium placeholder:text-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 dark:bg-transparent dark:text-gray-50 dark:disabled:bg-gray-700',
  {
    variants: {
      variant: {
        default:
          'border border-gray-300 rounded-lg focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-200 aria-invalid:border-red-700 aria-invalid:ring-[3px] aria-invalid:ring-red-200 dark:border-gray-700/40 dark:aria-invalid:border-red-500 dark:aria-invalid:ring-red-700/40',
        group:
          'flex-1 rounded-none rounded-lg border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);
