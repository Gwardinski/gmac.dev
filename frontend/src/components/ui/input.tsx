import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-gray-300 glass bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-gray-900 selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900 placeholder:text-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-gray-700 dark:dark-glass dark:bg-gray-800/30 dark:selection:bg-gray-200 dark:selection:text-gray-900 dark:file:text-white dark:placeholder:text-gray-400',
        'focus-visible:border-gray-400 focus-visible:ring-[3px] focus-visible:ring-gray-400/50 dark:focus-visible:border-gray-600 dark:focus-visible:ring-gray-600/50',
        'aria-invalid:border-red-600 aria-invalid:ring-red-600/20 dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-900/40',
        className
      )}
      {...props}
    />
  );
}

export { Input };
