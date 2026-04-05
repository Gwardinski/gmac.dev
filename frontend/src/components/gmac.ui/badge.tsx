import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import type { ButtonTheme } from './button';
import { cn } from './utils';

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

export const Badge = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>>((props, ref) => {
  const { className, variant, theme, children, ...rest } = props;

  return (
    <div ref={ref} className={cn(badgeVariants({ variant, theme }), className)} {...rest}>
      {children}
    </div>
  );
});
Badge.displayName = 'Badge';

// ------------------------------------------------------------
// THEMING (subset of Button variants; static — no interactive states)
// ------------------------------------------------------------

export const badgeVariantOptions = ['primary', 'outline', 'glass'] as const;
export type BadgeVariantOption = (typeof badgeVariantOptions)[number];

export { buttonThemeOptions as badgeThemeOptions, type ButtonTheme as BadgeThemeOption } from './button';

const badgeVariantClasses = {
  primary: 'border',
  outline: 'border',
  glass: 'backdrop-blur-sm glass-border dark:dark-glass-border'
} satisfies Record<BadgeVariantOption, string>;

const badgeThemeClasses = {
  gray: '',
  blue: '',
  green: '',
  yellow: '',
  orange: '',
  red: '',
  purple: ''
} satisfies Record<ButtonTheme, string>;

export const badgeVariants = cva(
  'inline-flex h-6 max-h-6 max-w-fit min-w-fit flex-row items-center gap-1 rounded-full px-2 text-sm font-medium uppercase transition-colors [&_svg]:shrink-0',
  {
    variants: {
      variant: badgeVariantClasses,
      theme: badgeThemeClasses
    },
    compoundVariants: [
      // primary
      {
        variant: 'primary',
        theme: 'gray',
        class: 'border-gray-500 bg-gray-500 text-white [&_svg]:text-white'
      },
      {
        variant: 'primary',
        theme: 'blue',
        class: 'border-blue-500 bg-blue-500 text-white [&_svg]:text-white dark:border-blue-600/80 dark:bg-blue-500/80'
      },
      {
        variant: 'primary',
        theme: 'green',
        class: 'border-green-500 bg-green-500 text-white [&_svg]:text-white dark:border-green-600/80 dark:bg-green-500/80'
      },
      {
        variant: 'primary',
        theme: 'yellow',
        class: 'border-yellow-500 bg-yellow-500 text-white [&_svg]:text-white dark:border-yellow-600/80 dark:bg-yellow-500/80'
      },
      {
        variant: 'primary',
        theme: 'orange',
        class: 'border-orange-500 bg-orange-500 text-white [&_svg]:text-white dark:border-orange-600/80 dark:bg-orange-500/80'
      },
      {
        variant: 'primary',
        theme: 'red',
        class: 'border-red-500 bg-red-500 text-white [&_svg]:text-white dark:border-red-600/80 dark:bg-red-500/80'
      },
      {
        variant: 'primary',
        theme: 'purple',
        class: 'border-purple-500 bg-purple-500 text-white [&_svg]:text-white dark:border-purple-600/80 dark:bg-purple-500/80'
      },
      // outline
      {
        variant: 'outline',
        theme: 'gray',
        class: 'border-gray-200 bg-transparent text-gray-700 [&_svg]:text-gray-700 dark:border-gray-600 dark:text-gray-200 dark:[&_svg]:text-gray-200'
      },
      {
        variant: 'outline',
        theme: 'blue',
        class: 'border-blue-200 bg-transparent text-blue-700 [&_svg]:text-blue-700 dark:border-blue-600 dark:text-blue-300 dark:[&_svg]:text-blue-300'
      },
      {
        variant: 'outline',
        theme: 'green',
        class: 'border-green-200 bg-transparent text-green-700 [&_svg]:text-green-700 dark:border-green-600 dark:text-green-300 dark:[&_svg]:text-green-300'
      },
      {
        variant: 'outline',
        theme: 'yellow',
        class: 'border-yellow-200 bg-transparent text-yellow-700 [&_svg]:text-yellow-700 dark:border-yellow-600 dark:text-yellow-300 dark:[&_svg]:text-yellow-300'
      },
      {
        variant: 'outline',
        theme: 'orange',
        class: 'border-orange-200 bg-transparent text-orange-700 [&_svg]:text-orange-700 dark:border-orange-600 dark:text-orange-300 dark:[&_svg]:text-orange-300'
      },
      {
        variant: 'outline',
        theme: 'red',
        class: 'border-red-200 bg-transparent text-red-700 [&_svg]:text-red-700 dark:border-red-600 dark:text-red-300 dark:[&_svg]:text-red-300'
      },
      {
        variant: 'outline',
        theme: 'purple',
        class: 'border-purple-200 bg-transparent text-purple-700 [&_svg]:text-purple-700 dark:border-purple-600 dark:text-purple-300 dark:[&_svg]:text-purple-300'
      },
      // glass
      {
        variant: 'glass',
        theme: 'gray',
        class: 'bg-zinc-500/10 text-gray-900 dark:bg-zinc-800/30 dark:text-gray-50 [&_svg]:text-current'
      },
      {
        variant: 'glass',
        theme: 'blue',
        class: 'bg-blue-500/10 text-blue-950 dark:bg-blue-800/30 dark:text-blue-50 [&_svg]:text-current'
      },
      {
        variant: 'glass',
        theme: 'green',
        class: 'bg-green-500/10 text-green-950 dark:bg-green-800/30 dark:text-green-50 [&_svg]:text-current'
      },
      {
        variant: 'glass',
        theme: 'yellow',
        class: 'bg-yellow-500/12 text-yellow-950 dark:bg-yellow-800/30 dark:text-yellow-50 [&_svg]:text-current'
      },
      {
        variant: 'glass',
        theme: 'orange',
        class: 'bg-orange-500/10 text-orange-950 dark:bg-orange-800/30 dark:text-orange-50 [&_svg]:text-current'
      },
      {
        variant: 'glass',
        theme: 'red',
        class: 'bg-red-500/10 text-red-950 dark:bg-red-800/30 dark:text-red-50 [&_svg]:text-current'
      },
      {
        variant: 'glass',
        theme: 'purple',
        class: 'bg-purple-500/10 text-purple-950 dark:bg-purple-800/30 dark:text-purple-50 [&_svg]:text-current'
      }
    ],
    defaultVariants: {
      variant: 'primary',
      theme: 'gray'
    }
  }
);
