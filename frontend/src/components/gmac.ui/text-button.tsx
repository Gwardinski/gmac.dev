import { Link } from '@tanstack/react-router';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { textVariants } from './typography';
import { cn } from './utils';

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

export const TextButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof textButtonVariants>>((props, ref) => {
  const { className, theme, children, ...rest } = props;

  return (
    <button ref={ref} className={cn(textButtonVariants({ theme }), className)} {...rest}>
      {children}
    </button>
  );
});
TextButton.displayName = 'TextButton';

export const TextAnchor = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof textButtonVariants>>((props, ref) => {
  const { className, theme, children, ...rest } = props;

  return (
    <a ref={ref} className={cn(textButtonVariants({ theme }), className)} {...rest}>
      {children}
    </a>
  );
});
TextAnchor.displayName = 'TextAnchor';

export const TextLink = forwardRef<React.ComponentRef<typeof Link>, React.ComponentProps<typeof Link> & VariantProps<typeof textButtonVariants>>((props, ref) => {
  const { className, theme, children, ...rest } = props;

  return (
    <Link ref={ref} className={cn(textButtonVariants({ theme }), className)} {...rest}>
      {children}
    </Link>
  );
});
TextLink.displayName = 'TextLink';

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export const textButtonThemeOptions = ['gray', 'blue', 'green', 'yellow', 'orange', 'red', 'purple'] as const;
export type TextButtonTheme = (typeof textButtonThemeOptions)[number];

const textButtonThemeClasses = {
  gray: 'text-gray-800 dark:text-gray-100 focus-visible:ring-gray-800/50 dark:focus-visible:ring-gray-100/50',
  blue: 'text-blue-600 dark:text-blue-400 focus-visible:ring-blue-600/50 dark:focus-visible:ring-blue-400/50',
  green: 'text-green-600 dark:text-green-400 focus-visible:ring-green-600/50 dark:focus-visible:ring-green-400/50',
  yellow: 'text-yellow-600 dark:text-yellow-400 focus-visible:ring-yellow-600/50 dark:focus-visible:ring-yellow-400/50',
  orange: 'text-orange-600 dark:text-orange-400 focus-visible:ring-orange-600/50 dark:focus-visible:ring-orange-400/50',
  red: 'text-red-600 dark:text-red-400 focus-visible:ring-red-600/50 dark:focus-visible:ring-red-400/50',
  purple: 'text-purple-600 dark:text-purple-400 focus-visible:ring-purple-600/50 dark:focus-visible:ring-purple-400/50'
} satisfies Record<TextButtonTheme, string>;

export const textButtonVariants = cva(
  `${textVariants({ size: 'md' })} gap-2 min-w-fit w-fit inline-flex items-center underline underline-offset-2 hover:underline-offset-4
   whitespace-nowrap transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50
   outline-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:rounded`,
  {
    variants: {
      theme: textButtonThemeClasses
    },
    defaultVariants: {
      theme: 'gray'
    }
  }
);
