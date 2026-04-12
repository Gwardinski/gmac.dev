import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Button } from './button';
import { IconButton } from './icon-button';
import { cn } from './utils';

// Parent component for the Input
// Note: Styling must be kept consistent with the default Input component
export function InputGroup({ className, variant = 'group', ...props }: React.ComponentProps<'div'> & VariantProps<typeof inputGroupVariants>) {
  return <div data-slot="input-group" role="group" className={cn(inputGroupVariants({ variant }), className)} {...props} />;
}

export function InputAddon({ className, align = 'left', ...props }: React.ComponentProps<'div'> & VariantProps<typeof inputAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputAddonVariants({ align }), className)}
      // Note: Some accessibility concerns here with using an onClick on a non-interactive element.
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

export function TextareaAddon({ className, align = 'top', ...props }: React.ComponentProps<'div'> & VariantProps<typeof textareaAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(textareaAddonVariants({ align }), className)}
      // Note: Some accessibility concerns here with using an onClick on a non-interactive element.
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

const inputGroupVariants = cva(
  'group/input-group relative flex h-10 w-full max-w-xl min-w-0 items-center rounded-lg border border-gray-300 transition-colors outline-none has-disabled:bg-gray-300 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-purple-500  has-[[data-slot][aria-invalid=true]]:border-red-700 has-[[data-slot][aria-invalid=true]]:ring-[3px] has-[[data-slot][aria-invalid=true]]:ring-red-700 has-[>[data-align=bottom]]:h-auto has-[>[data-align=bottom]]:flex-col has-[>[data-align=top]]:h-auto has-[>[data-align=top]]:flex-col has-[>textarea]:h-auto dark:border-gray-700/40 dark:bg-transparent dark:has-disabled:bg-gray-700/40 dark:has-[[data-slot][aria-invalid=true]]:border-red-500 has-[>[data-align=bottom]]:[&>input]:pt-2 has-[>[data-align=left]]:[&>input]:pl-3 has-[>[data-align=right]]:[&>input]:pr-3 has-[>[data-align=top]]:[&>input]:pb-2 [[data-slot=combobox-content]_&]:focus-within:border-inherit [[data-slot=combobox-content]_&]:focus-within:ring-0',
  {
    variants: {
      variant: {
        group: 'has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-purple-200',
        search:
          'rounded-xl has-[[data-slot=input-group-control]:focus-visible]:ring-[1px] has-[[data-slot=input-group-control]:focus-visible]:ring-purple-700 [&_button]:rounded-xl'
      }
    },
    defaultVariants: {
      variant: 'group'
    }
  }
);

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

const textareaAddonVariants = cva(
  "text-gray-700 h-auto gap-2 group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none [&>button:first-child]:-ml-3 [&>button:last-child]:-mr-3",
  {
    variants: {
      align: {
        top: 'px-3 [.border-b]:pb-2 order-first w-full justify-start',
        bottom: 'px-3 [.border-t]:pt-2 order-last w-full justify-start',
        right: 'pr-3 has-[>button]:mr-[-12px] h-full order-last items-center justify-end'
      }
    },
    defaultVariants: {
      align: 'top'
    }
  }
);
