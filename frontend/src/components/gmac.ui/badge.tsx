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
  primary: 'text-white border ',
  outline: ' border bg-transparent dark:bg-transparent ',
  glass: 'backdrop-blur dark:backdrop-blur-[32px] glass-border dark:dark-glass-border '
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
      // primary — Button primary at rest (no hover/active/focus)
      {
        variant: 'primary',
        theme: 'blue',
        class: 'border-blue-500 bg-blue-500 dark:border-blue-600 dark:bg-blue-600 [&_svg]:text-inherit'
      },
      {
        variant: 'primary',
        theme: 'green',
        class: 'border-green-500 bg-green-500 dark:border-green-600 dark:bg-green-600 [&_svg]:text-inherit'
      },
      {
        variant: 'primary',
        theme: 'yellow',
        class: 'border-yellow-500 bg-yellow-500 dark:border-yellow-600 dark:bg-yellow-600 text-black dark:text-black [&_svg]:text-inherit'
      },
      {
        variant: 'primary',
        theme: 'orange',
        class: 'border-orange-500 bg-orange-500 dark:border-orange-600 dark:bg-orange-600 [&_svg]:text-inherit'
      },
      {
        variant: 'primary',
        theme: 'red',
        class: 'border-red-500 bg-red-500 dark:border-red-600 dark:bg-red-600 [&_svg]:text-inherit'
      },
      {
        variant: 'primary',
        theme: 'purple',
        class: 'border-purple-500 bg-purple-500 dark:border-purple-600 dark:bg-purple-600 [&_svg]:text-inherit'
      },
      {
        variant: 'primary',
        theme: 'gray',
        class: 'border-gray-800 bg-gray-800 dark:border-gray-300 dark:bg-gray-300 text-white dark:text-black [&_svg]:text-inherit'
      },
      // outline — Button outline at rest (no hover/active/focus)
      {
        variant: 'outline',
        theme: 'blue',
        class: 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 [&_svg]:text-inherit'
      },
      {
        variant: 'outline',
        theme: 'green',
        class: 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 [&_svg]:text-inherit'
      },
      {
        variant: 'outline',
        theme: 'yellow',
        class: 'border-yellow-600 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400 [&_svg]:text-inherit'
      },
      {
        variant: 'outline',
        theme: 'orange',
        class: 'border-orange-600 text-orange-600 dark:border-orange-400 dark:text-orange-400 [&_svg]:text-inherit'
      },
      {
        variant: 'outline',
        theme: 'red',
        class: 'border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 [&_svg]:text-inherit'
      },
      {
        variant: 'outline',
        theme: 'purple',
        class: 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 [&_svg]:text-inherit'
      },
      {
        variant: 'outline',
        theme: 'gray',
        class: 'border-gray-800 text-gray-800 dark:border-gray-100 dark:text-gray-100 [&_svg]:text-inherit'
      },
      // glass — Button glass tints at rest; text matches outline for contrast
      {
        variant: 'glass',
        theme: 'gray',
        class: 'bg-gray-50/25 dark:bg-gray-950/25 text-gray-800 dark:text-gray-100 [&_svg]:text-inherit'
      },
      {
        variant: 'glass',
        theme: 'blue',
        class: 'bg-blue-50/25 dark:bg-blue-950/25 text-blue-600 dark:text-blue-400 [&_svg]:text-inherit'
      },
      {
        variant: 'glass',
        theme: 'green',
        class: 'bg-green-50/25 dark:bg-green-950/25 text-green-600 dark:text-green-400 [&_svg]:text-inherit'
      },
      {
        variant: 'glass',
        theme: 'yellow',
        class: 'bg-yellow-50/25 dark:bg-yellow-950/25 text-yellow-600 dark:text-yellow-400 [&_svg]:text-inherit'
      },
      {
        variant: 'glass',
        theme: 'orange',
        class: 'bg-orange-50/25 dark:bg-orange-950/25 text-orange-600 dark:text-orange-400 [&_svg]:text-inherit'
      },
      {
        variant: 'glass',
        theme: 'red',
        class: 'bg-red-50/25 dark:bg-red-950/25 text-red-600 dark:text-red-400 [&_svg]:text-inherit'
      },
      {
        variant: 'glass',
        theme: 'purple',
        class: 'bg-purple-50/25 dark:bg-purple-950/25 text-purple-600 dark:text-purple-400 [&_svg]:text-inherit'
      }
    ],
    defaultVariants: {
      variant: 'primary',
      theme: 'gray'
    }
  }
);
