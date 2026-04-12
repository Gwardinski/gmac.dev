import { Link } from '@tanstack/react-router';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import type { ButtonTheme } from './button';
import { H4, P3 } from './typography';
import { cn } from './utils';

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

function Card({
  className,
  variant,
  theme,
  as = 'article',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants> & { as?: 'article' | 'div' | 'section' | 'header' }) {
  const Comp = as;
  return <Comp data-slot="card" className={cn(cardVariants({ variant, theme }), className)} {...props} />;
}

function CardButton({ className, variant, theme, type = 'button', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof cardVariants>) {
  return (
    <button
      type={type}
      data-slot="card"
      className={cn(
        cardVariants({ variant, theme }),
        cardInteractiveVariants({ variant, theme }),
        'cursor-pointer text-left disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function CardLink({ className, variant, theme, ...props }: React.ComponentProps<typeof Link> & VariantProps<typeof cardVariants>) {
  return (
    <Link
      data-slot="card"
      className={cn(cardVariants({ variant, theme }), cardInteractiveVariants({ variant, theme }), 'cursor-pointer text-left disabled:opacity-50', className)}
      {...props}
    />
  );
}

function CardHeader({ className, column = false, ...props }: React.ComponentProps<'div'> & { column?: boolean }) {
  return (
    <header
      data-slot="card-header"
      className={cn(
        'flex w-full gap-x-4 px-4 pb-4 group-has-data-[slot=card-body]:pb-5 [&_svg]:text-purple-500',
        column ? 'flex-col' : 'flex-row flex-wrap items-center',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <H4 data-slot="card-title" className={cn('', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <P3 data-slot="card-description" className={cn('w-full basis-full', className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />;
}

function CardBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-body" className={cn('flex flex-col gap-4 px-4 pb-4', className)} {...props} />;
}

function CardFooter({ className, column = false, ...props }: React.ComponentProps<'div'> & { column?: boolean }) {
  return (
    <div
      data-slot="card-footer"
      className={cn('mt-auto flex items-center justify-end gap-2 rounded-b-xl px-4 pt-4 pb-4', column ? 'w-full flex-col' : 'flex-row justify-end', className)}
      {...props}
    />
  );
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export { buttonThemeOptions as cardThemeOptions, type ButtonTheme as CardTheme } from './button';

export const cardVariantOptions = ['solid', 'outline', 'glass'] as const;
export type CardVariantOption = (typeof cardVariantOptions)[number];

const cardVariantClasses = {
  solid: '',
  outline: '',
  glass: 'backdrop-blur dark:backdrop-blur-[32px] glass-border dark:dark-glass-border'
} satisfies Record<CardVariantOption, string>;

const cardThemeClasses = {
  gray: '',
  blue: '',
  green: '',
  yellow: '',
  orange: '',
  red: '',
  purple: ''
} satisfies Record<ButtonTheme, string>;

/** Static surface (border / background / text). Used by `Card`; no hover or focus affordances. */
export const cardVariants = cva(
  'group relative flex max-h-fit w-full flex-col rounded-lg border border-gray-300 px-4 pt-4 pb-4 has-data-[slot=card-body]:px-0 has-data-[slot=card-body]:pb-0 has-data-[slot=card-header]:px-0 has-data-[slot=card-header]:pb-0 has-data-[slot=card-image]:pt-0',
  {
    variants: {
      variant: cardVariantClasses,
      theme: cardThemeClasses
    },
    compoundVariants: [
      // solid
      { variant: 'solid', theme: 'gray', class: 'border-gray-200 bg-gray-50 text-black dark:bg-gray-950 dark:text-white' },
      { variant: 'solid', theme: 'blue', class: 'border-blue-500 bg-blue-500 text-white dark:border-blue-600/80 dark:bg-blue-500/80' },
      { variant: 'solid', theme: 'green', class: 'border-green-500 bg-green-500 text-white dark:border-green-600/80 dark:bg-green-500/80' },
      { variant: 'solid', theme: 'yellow', class: 'border-yellow-500 bg-yellow-500 text-white dark:border-yellow-600/80 dark:bg-yellow-500/80' },
      { variant: 'solid', theme: 'orange', class: 'border-orange-500 bg-orange-500 text-white dark:border-orange-600/80 dark:bg-orange-500/80' },
      { variant: 'solid', theme: 'red', class: 'border-red-500 bg-red-500 text-white dark:border-red-600/80 dark:bg-red-500/80' },
      { variant: 'solid', theme: 'purple', class: 'border-purple-500 bg-purple-500 text-white dark:border-purple-600/80 dark:bg-purple-500/80' },
      // outline
      {
        variant: 'outline',
        theme: 'gray',
        class: 'border-gray-200 bg-transparent text-gray-900 dark:border-gray-700 dark:text-gray-50'
      },
      {
        variant: 'outline',
        theme: 'blue',
        class: 'border-blue-200 bg-transparent text-blue-800 dark:border-blue-700 dark:text-blue-200'
      },
      {
        variant: 'outline',
        theme: 'green',
        class: 'border-green-200 bg-transparent text-green-800 dark:border-green-700 dark:text-green-200'
      },
      {
        variant: 'outline',
        theme: 'yellow',
        class: 'border-yellow-200 bg-transparent text-yellow-900 dark:border-yellow-700 dark:text-yellow-200'
      },
      {
        variant: 'outline',
        theme: 'orange',
        class: 'border-orange-200 bg-transparent text-orange-900 dark:border-orange-700 dark:text-orange-200'
      },
      {
        variant: 'outline',
        theme: 'red',
        class: 'border-red-200 bg-transparent text-red-800 dark:border-red-700 dark:text-red-200'
      },
      {
        variant: 'outline',
        theme: 'purple',
        class: 'border-purple-200 bg-transparent text-purple-900 dark:border-purple-700 dark:text-purple-200'
      },
      // glass
      { variant: 'glass', theme: 'gray', class: 'bg-gray-50/25 text-black dark:bg-gray-950/25 dark:text-white' },
      { variant: 'glass', theme: 'blue', class: 'bg-purple-50/25 text-blue-950 dark:bg-gray-950/25 dark:text-blue-50' },
      { variant: 'glass', theme: 'green', class: 'bg-purple-50/25 text-green-950 dark:bg-gray-950/25 dark:text-green-50' },
      { variant: 'glass', theme: 'yellow', class: 'bg-purple-50/25 text-yellow-950 dark:bg-gray-950/25 dark:text-yellow-50' },
      { variant: 'glass', theme: 'orange', class: 'bg-purple-50/25 text-orange-950 dark:bg-gray-950/25 dark:text-orange-50' },
      { variant: 'glass', theme: 'red', class: 'bg-purple-50/25 text-red-950 dark:bg-gray-950/25 dark:text-red-50' },
      { variant: 'glass', theme: 'purple', class: 'bg-purple-50/25 text-purple-950 dark:bg-gray-950/25 dark:text-purple-50' }
    ],
    defaultVariants: {
      variant: 'solid',
      theme: 'gray'
    }
  }
);

/** Hover / active / focus-visible / disabled — only composed on `CardButton` and `CardLink`. */
const cardInteractiveVariants = cva('transition-colors', {
  variants: {
    variant: cardVariantClasses,
    theme: cardThemeClasses
  },
  compoundVariants: [
    {
      variant: 'solid',
      theme: 'gray',
      class:
        'hover:border-gray-700 hover:bg-gray-700 active:border-gray-700 active:bg-gray-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-gray-200 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-gray-600 dark:hover:bg-gray-600 dark:focus-visible:ring-gray-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40'
    },
    {
      variant: 'solid',
      theme: 'blue',
      class:
        'hover:border-blue-700 hover:bg-blue-700 active:border-blue-700 active:bg-blue-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:focus-visible:ring-blue-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40'
    },
    {
      variant: 'solid',
      theme: 'green',
      class:
        'hover:border-green-700 hover:bg-green-700 active:border-green-700 active:bg-green-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-green-200 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-green-600 dark:hover:bg-green-600 dark:focus-visible:ring-green-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40'
    },
    {
      variant: 'solid',
      theme: 'yellow',
      class:
        'hover:border-yellow-700 hover:bg-yellow-700 active:border-yellow-700 active:bg-yellow-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-yellow-200 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-yellow-600 dark:hover:bg-yellow-600 dark:focus-visible:ring-yellow-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40'
    },
    {
      variant: 'solid',
      theme: 'orange',
      class:
        'hover:border-orange-700 hover:bg-orange-700 active:border-orange-700 active:bg-orange-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-orange-200 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-orange-600 dark:hover:bg-orange-600 dark:focus-visible:ring-orange-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40'
    },
    {
      variant: 'solid',
      theme: 'red',
      class:
        'hover:border-red-700 hover:bg-red-700 active:border-red-700 active:bg-red-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-red-200 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-red-600 dark:hover:bg-red-600 dark:focus-visible:ring-red-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40'
    },
    {
      variant: 'solid',
      theme: 'purple',
      class:
        'hover:border-purple-700 hover:bg-purple-700 active:border-purple-700 active:bg-purple-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-200 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-purple-600 dark:hover:bg-purple-600 dark:focus-visible:ring-purple-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40'
    },
    {
      variant: 'outline',
      theme: 'gray',
      class:
        'hover:border-gray-400 active:border-gray-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-gray-200 focus-visible:border-gray-500 disabled:cursor-default disabled:text-gray-500 disabled:border-gray-300 dark:hover:border-gray-500 dark:active:border-gray-500 dark:focus-visible:ring-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40'
    },
    {
      variant: 'outline',
      theme: 'blue',
      class:
        'hover:border-blue-400 active:border-blue-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:border-blue-500 disabled:cursor-default disabled:text-gray-500 disabled:border-gray-300 dark:hover:border-blue-500 dark:active:border-blue-500 dark:focus-visible:ring-blue-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40'
    },
    {
      variant: 'outline',
      theme: 'green',
      class:
        'hover:border-green-400 active:border-green-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-green-200 focus-visible:border-green-500 disabled:cursor-default disabled:text-gray-500 disabled:border-gray-300 dark:hover:border-green-500 dark:active:border-green-500 dark:focus-visible:ring-green-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40'
    },
    {
      variant: 'outline',
      theme: 'yellow',
      class:
        'hover:border-yellow-400 active:border-yellow-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-yellow-200 focus-visible:border-yellow-500 disabled:cursor-default disabled:text-gray-500 disabled:border-gray-300 dark:hover:border-yellow-500 dark:active:border-yellow-500 dark:focus-visible:ring-yellow-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40'
    },
    {
      variant: 'outline',
      theme: 'orange',
      class:
        'hover:border-orange-400 active:border-orange-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-orange-200 focus-visible:border-orange-500 disabled:cursor-default disabled:text-gray-500 disabled:border-gray-300 dark:hover:border-orange-500 dark:active:border-orange-500 dark:focus-visible:ring-orange-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40'
    },
    {
      variant: 'outline',
      theme: 'red',
      class:
        'hover:border-red-400 active:border-red-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-red-200 focus-visible:border-red-500 disabled:cursor-default disabled:text-gray-500 disabled:border-gray-300 dark:hover:border-red-500 dark:active:border-red-500 dark:focus-visible:ring-red-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40'
    },
    {
      variant: 'outline',
      theme: 'purple',
      class:
        'hover:border-purple-400 active:border-purple-700 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-200 focus-visible:border-purple-500 disabled:cursor-default disabled:text-gray-500 disabled:border-gray-300 dark:hover:border-purple-500 dark:active:border-purple-500 dark:focus-visible:ring-purple-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40'
    },
    {
      variant: 'glass',
      theme: 'gray',
      class:
        'hover:bg-purple-50/35 active:bg-purple-50/40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-gray-400/60 dark:hover:bg-gray-950/65 dark:active:bg-gray-950/80 dark:focus-visible:ring-gray-500/50'
    },
    {
      variant: 'glass',
      theme: 'blue',
      class:
        'hover:bg-purple-50/35 active:bg-purple-50/40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-blue-400/50 dark:hover:bg-gray-950/65 dark:active:bg-gray-950/80 dark:focus-visible:ring-blue-500/40'
    },
    {
      variant: 'glass',
      theme: 'green',
      class:
        'hover:bg-purple-50/35 active:bg-purple-50/40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-green-400/50 dark:hover:bg-gray-950/65 dark:active:bg-gray-950/80 dark:focus-visible:ring-green-500/40'
    },
    {
      variant: 'glass',
      theme: 'yellow',
      class:
        'hover:bg-purple-50/38 active:bg-purple-50/42 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-yellow-400/50 dark:hover:bg-gray-950/65 dark:active:bg-gray-950/80 dark:focus-visible:ring-yellow-500/40'
    },
    {
      variant: 'glass',
      theme: 'orange',
      class:
        'hover:bg-purple-50/35 active:bg-purple-50/40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-orange-400/50 dark:hover:bg-gray-950/65 dark:active:bg-gray-950/80 dark:focus-visible:ring-orange-500/40'
    },
    {
      variant: 'glass',
      theme: 'red',
      class:
        'hover:bg-purple-50/35 active:bg-purple-50/40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-red-400/50 dark:hover:bg-gray-950/65 dark:active:bg-gray-950/80 dark:focus-visible:ring-red-500/40'
    },
    {
      variant: 'glass',
      theme: 'purple',
      class:
        'hover:bg-purple-50/35 active:bg-purple-50/40 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-400/50 dark:hover:bg-gray-950/65 dark:active:bg-gray-950/80 dark:focus-visible:ring-purple-500/40'
    }
  ],
  defaultVariants: {
    variant: 'outline',
    theme: 'gray'
  }
});

export { Card, CardAction, CardBody, CardButton, CardDescription, CardFooter, CardHeader, CardLink, CardTitle };
