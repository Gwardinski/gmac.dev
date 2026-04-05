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
  gray: 'text-gray-900 dark:text-gray-50',
  blue: 'text-blue-700 dark:text-blue-500',
  green: 'text-green-700 dark:text-green-500',
  yellow: 'text-yellow-700 dark:text-yellow-500',
  orange: 'text-orange-700 dark:text-orange-500',
  red: 'text-red-700 dark:text-red-500',
  purple: 'text-purple-700 dark:text-purple-500'
} satisfies Record<TextButtonTheme, string>;

export const textButtonVariants = cva(
  `${textVariants({ size: 'md' })} gap-2 min-w-fit w-fit inline-flex items-center underline underline-offset-2 hover:underline-offset-4 rounded-sm _focus-primary
   whitespace-nowrap ring-offset-white transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-900`,
  {
    variants: {
      theme: textButtonThemeClasses
    },
    defaultVariants: {
      theme: 'gray'
    }
  }
);
