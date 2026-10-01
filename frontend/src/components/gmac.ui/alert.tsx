import { IconX } from '@tabler/icons-react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonTheme } from './button';
import { IconButton } from './icon-button';
import { H5, P3 } from './typography';
import { cn } from './utils';

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

export function Alert({
  className,
  variant,
  theme,
  onDismiss,
  dismissAriaLabel = 'Close',
  width,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onDismiss?: () => void; dismissAriaLabel?: string } & VariantProps<typeof alertVariants>) {
  const resolvedTheme = (theme ?? 'gray') as ButtonTheme;
  return (
    <div role="alert" className={cn('relative', alertVariants({ variant, theme: resolvedTheme, width }), className)} {...props}>
      {onDismiss && (
        <IconButton className="absolute -top-2 right-0" variant="ghost" theme={resolvedTheme} onClick={onDismiss} aria-label={dismissAriaLabel}>
          <IconX />
        </IconButton>
      )}
      {children}
    </div>
  );
}

export function AlertHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('alert-header flex flex-row gap-2', className)} {...props} />;
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <H5 as="p" className={cn('alert-title pr-12', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <P3 className={cn('alert-description text-inherit', className)} {...props} />;
}

export function AlertActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-2 ml-auto flex flex-row flex-wrap gap-2', className)} {...props} />;
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export const alertVariantOptions = ['solid', 'secondary', 'glass'] as const;
export type AlertVariantOption = (typeof alertVariantOptions)[number];

export { buttonThemeOptions as alertThemeOptions, type ButtonTheme as AlertTheme } from './button';

export const alertWidthOptions = ['full', 'fit'] as const;
export type AlertWidthOption = (typeof alertWidthOptions)[number];

const alertVariantClasses = {
  solid: 'border',
  secondary: 'border',
  glass: 'border border-transparent backdrop-blur-sm glass-border dark:dark-glass-border'
} satisfies Record<AlertVariantOption, string>;

const alertThemeClasses = {
  gray: '',
  blue: '',
  green: '',
  yellow: '',
  orange: '',
  red: '',
  purple: ''
} satisfies Record<ButtonTheme, string>;

const alertWidthClasses = {
  full: 'w-full',
  fit: 'w-fit'
} satisfies Record<AlertWidthOption, string>;

export const alertVariants = cva(
  [
    'relative w-fit rounded-lg px-4 pt-3.5 pb-4 flex flex-col items-start gap-1',
    '[&>button]:ml-auto [&>button]:mt-2',
    '[&>svg]:absolute [&_svg]:size-5 [&>svg]:left-3 [&>svg]:top-[18px]',
    '[&>.alert-header:has(svg)+.alert-description]:pl-8',
    '[&>.alert-header>svg]:min-w-fit [&>.alert-header>svg]:pr-1 [&>.alert-header>svg]:mt-0.75'
  ].join(' '),
  {
    variants: {
      variant: alertVariantClasses,
      theme: alertThemeClasses,
      width: alertWidthClasses
    },
    compoundVariants: [
      // solid
      {
        variant: 'solid',
        theme: 'gray',
        class: 'border-gray-500 bg-gray-500 text-white [&_.alert-title]:text-white [&>.alert-header>svg]:text-white dark:border-gray-600 dark:bg-gray-600'
      },
      {
        variant: 'solid',
        theme: 'blue',
        class: 'border-blue-500 bg-blue-500 text-white [&_.alert-title]:text-white [&>.alert-header>svg]:text-white dark:border-blue-600/80 dark:bg-blue-500/80'
      },
      {
        variant: 'solid',
        theme: 'green',
        class: 'border-green-500 bg-green-500 text-gray-900 [&_.alert-title]:text-gray-900 [&_.alert-description]:text-gray-900 [&>.alert-header>svg]:text-gray-900 dark:border-green-600/80 dark:bg-green-500/80'
      },
      {
        variant: 'solid',
        theme: 'yellow',
        class: 'border-yellow-500 bg-yellow-500 text-gray-900 [&_.alert-title]:text-gray-900 [&_.alert-description]:text-gray-900 [&>.alert-header>svg]:text-gray-900 dark:border-yellow-600/80 dark:bg-yellow-500/80'
      },
      {
        variant: 'solid',
        theme: 'orange',
        class: 'border-orange-500 bg-orange-500 text-white [&_.alert-title]:text-white [&>.alert-header>svg]:text-white dark:border-orange-600/80 dark:bg-orange-500/80'
      },
      {
        variant: 'solid',
        theme: 'red',
        class: 'border-red-500 bg-red-500 text-white [&_.alert-title]:text-white [&>.alert-header>svg]:text-white dark:border-red-600/80 dark:bg-red-500/80'
      },
      {
        variant: 'solid',
        theme: 'purple',
        class: 'border-purple-500 bg-purple-500 text-white [&_.alert-title]:text-white [&>.alert-header>svg]:text-white dark:border-purple-600/80 dark:bg-purple-500/80'
      },
      // secondary — solid at /40 with themed text
      {
        variant: 'secondary',
        theme: 'gray',
        class:
          'border-gray-500/40 bg-gray-500/40 text-gray-900 [&_.alert-title]:text-gray-900 [&>.alert-header>svg]:text-gray-900 dark:border-gray-600/40 dark:bg-gray-600/40 dark:text-gray-50 dark:[&_.alert-title]:text-gray-50 dark:[&>.alert-header>svg]:text-gray-50'
      },
      {
        variant: 'secondary',
        theme: 'blue',
        class:
          'border-blue-500/40 bg-blue-500/40 text-blue-700 [&_.alert-title]:text-blue-700 [&>.alert-header>svg]:text-blue-700 dark:border-blue-600/40 dark:bg-blue-600/40 dark:text-blue-50 dark:[&_.alert-title]:text-blue-50 dark:[&>.alert-header>svg]:text-blue-50'
      },
      {
        variant: 'secondary',
        theme: 'green',
        class:
          'border-green-500/40 bg-green-500/40 text-green-700 [&_.alert-title]:text-green-700 [&>.alert-header>svg]:text-green-700 dark:border-green-600/40 dark:bg-green-600/40 dark:text-green-50 dark:[&_.alert-title]:text-green-50 dark:[&>.alert-header>svg]:text-green-50'
      },
      {
        variant: 'secondary',
        theme: 'yellow',
        class:
          'border-yellow-500/40 bg-yellow-500/40 text-yellow-700 [&_.alert-title]:text-yellow-700 [&>.alert-header>svg]:text-yellow-700 dark:border-yellow-600/40 dark:bg-yellow-600/40 dark:text-yellow-50 dark:[&_.alert-title]:text-yellow-50 dark:[&>.alert-header>svg]:text-yellow-50'
      },
      {
        variant: 'secondary',
        theme: 'orange',
        class:
          'border-orange-500/40 bg-orange-500/40 text-orange-700 [&_.alert-title]:text-orange-700 [&>.alert-header>svg]:text-orange-700 dark:border-orange-600/40 dark:bg-orange-600/40 dark:text-orange-50 dark:[&_.alert-title]:text-orange-50 dark:[&>.alert-header>svg]:text-orange-50'
      },
      {
        variant: 'secondary',
        theme: 'red',
        class:
          'border-red-500/40 bg-red-500/40 text-red-700 [&_.alert-title]:text-red-700 [&>.alert-header>svg]:text-red-700 dark:border-red-600/40 dark:bg-red-600/40 dark:text-red-50 dark:[&_.alert-title]:text-red-50 dark:[&>.alert-header>svg]:text-red-50'
      },
      {
        variant: 'secondary',
        theme: 'purple',
        class:
          'border-purple-500/40 bg-purple-500/40 text-purple-700 [&_.alert-title]:text-purple-700 [&>.alert-header>svg]:text-purple-700 dark:border-purple-600/40 dark:bg-purple-600/40 dark:text-purple-50 dark:[&_.alert-title]:text-purple-50 dark:[&>.alert-header>svg]:text-purple-50'
      },
      // glass
      {
        variant: 'glass',
        theme: 'gray',
        class:
          'bg-gray-500/10 text-gray-900 [&_.alert-title]:text-gray-900 [&>.alert-header>svg]:text-gray-900 dark:bg-gray-800/30 dark:text-gray-50 dark:[&_.alert-title]:text-gray-50 dark:[&>.alert-header>svg]:text-gray-50'
      },
      {
        variant: 'glass',
        theme: 'blue',
        class:
          'bg-blue-500/10 text-blue-950 [&_.alert-title]:text-blue-950 [&>.alert-header>svg]:text-blue-950 dark:bg-blue-800/30 dark:text-blue-50 dark:[&_.alert-title]:text-blue-50 dark:[&>.alert-header>svg]:text-blue-50'
      },
      {
        variant: 'glass',
        theme: 'green',
        class:
          'bg-green-500/10 text-green-950 [&_.alert-title]:text-green-950 [&>.alert-header>svg]:text-green-950 dark:bg-green-800/30 dark:text-green-50 dark:[&_.alert-title]:text-green-50 dark:[&>.alert-header>svg]:text-green-50'
      },
      {
        variant: 'glass',
        theme: 'yellow',
        class:
          'bg-yellow-500/12 text-yellow-950 [&_.alert-title]:text-yellow-950 [&>.alert-header>svg]:text-yellow-950 dark:bg-yellow-800/30 dark:text-yellow-50 dark:[&_.alert-title]:text-yellow-50 dark:[&>.alert-header>svg]:text-yellow-50'
      },
      {
        variant: 'glass',
        theme: 'orange',
        class:
          'bg-orange-500/10 text-orange-950 [&_.alert-title]:text-orange-950 [&>.alert-header>svg]:text-orange-950 dark:bg-orange-800/30 dark:text-orange-50 dark:[&_.alert-title]:text-orange-50 dark:[&>.alert-header>svg]:text-orange-50'
      },
      {
        variant: 'glass',
        theme: 'red',
        class:
          'bg-red-500/10 text-red-950 [&_.alert-title]:text-red-950 [&>.alert-header>svg]:text-red-950 dark:bg-red-800/30 dark:text-red-50 dark:[&_.alert-title]:text-red-50 dark:[&>.alert-header>svg]:text-red-50'
      },
      {
        variant: 'glass',
        theme: 'purple',
        class:
          'bg-purple-500/10 text-purple-950 [&_.alert-title]:text-purple-950 [&>.alert-header>svg]:text-purple-950 dark:bg-purple-800/30 dark:text-purple-50 dark:[&_.alert-title]:text-purple-50 dark:[&>.alert-header>svg]:text-purple-50'
      }
    ],
    defaultVariants: {
      variant: 'secondary',
      theme: 'gray',
      width: 'fit'
    }
  }
);
