import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Button } from './button';
import { IconButton } from './icon-button';
import { cn } from './utils';

// Styling must be kept consistent with the default Input component
export function InputGroup({ className, variant = 'group', ...props }: React.ComponentProps<'div'> & VariantProps<typeof inputGroupVariants>) {
  return <div data-slot="input-group" role="group" className={cn(inputGroupVariants({ variant }), className)} {...props} />;
}

const inputGroupVariants = cva(
  `group/input-group relative flex h-10 w-full max-w-xl min-w-0 items-center rounded-lg border border-gray-300 transition-colors outline-none 
  has-disabled:bg-gray-300 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-blue-500 
  has-[[data-slot][aria-invalid=true]]:border-red-700 has-[[data-slot][aria-invalid=true]]:ring-[3px] has-[[data-slot][aria-invalid=true]]:ring-red-700/50 has-[>[data-align=bottom]]:h-auto 
  has-[>[data-align=bottom]]:flex-col has-[>[data-align=top]]:h-auto has-[>[data-align=top]]:flex-col has-[>textarea]:h-auto 
  dark:border-gray-700 dark:bg-transparent dark:has-disabled:bg-gray-700/40 dark:has-[[data-slot][aria-invalid=true]]:border-red-500 dark:has-[[data-slot][aria-invalid=true]]:ring-red-500/50 
  has-[>[data-align=bottom]]:[&>input]:pt-2 has-[>[data-align=left]]:[&>input]:pl-3 has-[>[data-align=right]]:[&>input]:pr-3 
  has-[>[data-align=top]]:[&>input]:pb-2 [[data-slot=combobox-content]_&]:focus-within:border-inherit [[data-slot=combobox-content]_&]:focus-within:ring-0`,
  {
    variants: {
      variant: {
        group: `has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-blue-500/50`,
        search: `rounded-xl has-[[data-slot=input-group-control]:focus-visible]:ring-[1px] has-[[data-slot=input-group-control]:focus-visible]:ring-blue-500/50 [&_button]:rounded-xl`
      }
    },
    defaultVariants: {
      variant: 'group'
    }
  }
);

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & VariantProps<typeof inputVariants>>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    return <input ref={ref} type={type} data-slot={variant === 'group' ? 'input-group-control' : 'input'} className={cn(inputVariants({ variant }), className)} {...props} />;
  }
);
Input.displayName = 'Input';

const inputVariants = cva(
  `h-10 w-full min-w-0 max-w-xl bg-transparent px-3 text-base text-gray-900 transition-colors outline-none 
   file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium 
   placeholder:text-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 
   dark:bg-transparent dark:text-gray-50 dark:disabled:bg-gray-700`,
  {
    variants: {
      variant: {
        default: `border border-gray-300 rounded-lg 
          focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 
          aria-invalid:border-red-700 aria-invalid:ring-[3px] aria-invalid:ring-red-700/50 
          dark:border-gray-700 dark:aria-invalid:border-red-500 dark:aria-invalid:ring-red-500/50`,
        group: `flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 
          focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent`
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export function InputAddon({ className, align = 'left', ...props }: React.ComponentProps<'div'> & VariantProps<typeof inputAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputAddonVariants({ align }), className)}
      // Some accessibility concerns with using an onClick on a non-interactive element.
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

export function TextareaBottom({ className, ...props }: React.ComponentProps<'div'> & VariantProps<typeof textareaAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align="bottom"
      className={cn(
        'order-last h-auto w-full justify-start gap-2 border-t border-gray-300 px-3 text-gray-700 select-none dark:border-gray-700 [&>button:first-child]:-ml-3 [&>button:last-child]:-mr-3',
        'flex cursor-text items-center group-data-[disabled=true]/input-group:opacity-50',
        className
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

export function InputGroupButton({ className, type = 'button', ...props }: Omit<React.ComponentProps<typeof Button>, 'type'> & { type?: 'button' | 'submit' | 'reset' }) {
  return <Button variant="ghost" type={type} size="sm" className={cn('flex max-h-full items-center gap-2', className)} {...props} />;
}

export function InputGroupIconButton({ className, type = 'button', ...props }: Omit<React.ComponentProps<typeof IconButton>, 'type'> & { type?: 'button' | 'submit' | 'reset' }) {
  return <IconButton variant="ghost" type={type} size="sm" className={cn('flex items-center gap-2', className)} {...props} />;
}

export function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn("flex min-h-10 items-center gap-2 text-sm text-gray-700 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className)} {...props} />;
}

const inputAddonVariants = cva(
  "text-gray-700 h-auto gap-2 group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none",
  {
    variants: {
      align: {
        left: 'pl-3 has-[>button]:ml-[-12px] has-[>kbd]:ml-[-0.12px] order-first',
        right: 'pr-3 has-[>button]:mr-[-12px] has-[>kbd]:mr-[-0.12px] order-last'
      }
    },
    defaultVariants: {
      align: 'left'
    }
  }
);

const textareaAddonVariants = cva({
  variants: {
    align: {
      bottom: 'px-3 [.border-t]:pt-2 order-last w-full justify-start'
    }
  }
});

export function Textarea({ className, variant = 'default', ...props }: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
  return <textarea data-slot={variant === 'group' ? 'input-group-control' : 'textarea'} className={cn(textareaVariants({ variant }), className)} {...props} />;
}

const textareaVariants = cva(
  'w-full min-w-0 rounded-lg max-w-2xl min-h-24 h-fit bg-transparent px-3 py-2 text-base text-gray-900 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 dark:bg-transparent dark:text-gray-50 dark:disabled:bg-gray-700',
  {
    variants: {
      variant: {
        default:
          'border border-gray-300 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-200 aria-invalid:border-red-700 aria-invalid:ring-[3px] aria-invalid:ring-red-200 dark:aria-invalid:border-red-500 dark:aria-invalid:ring-red-700/40',
        group:
          'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);
