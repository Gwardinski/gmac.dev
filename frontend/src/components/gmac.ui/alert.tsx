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
  return <P3 className={cn('alert-description', className)} {...props} />;
}

export function AlertActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-2 ml-auto flex flex-row flex-wrap gap-2', className)} {...props} />;
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export const alertVariantOptions = ['solid', 'outline', 'glass'] as const;
export type AlertVariantOption = (typeof alertVariantOptions)[number];

export { buttonThemeOptions as alertThemeOptions, type ButtonTheme as AlertTheme } from './button';

export const alertWidthOptions = ['full', 'fit'] as const;
export type AlertWidthOption = (typeof alertWidthOptions)[number];

const alertVariantClasses = {
  solid: 'border',
  outline: 'border',
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
    'relative w-fit rounded-xl px-4 pt-3.5 pb-4 flex flex-col items-start gap-1',
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
        class: 'border-green-500 bg-green-500 text-white [&_.alert-title]:text-white [&>.alert-header>svg]:text-white dark:border-green-600/80 dark:bg-green-500/80'
      },
      {
        variant: 'solid',
        theme: 'yellow',
        class: 'border-yellow-500 bg-yellow-500 text-white [&_.alert-title]:text-white [&>.alert-header>svg]:text-white dark:border-yellow-600/80 dark:bg-yellow-500/80'
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
      // outline
      {
        variant: 'outline',
        theme: 'gray',
        class:
          'border-gray-200  text-gray-900 [&_.alert-title]:text-gray-900 [&>.alert-header>svg]:text-gray-900 dark:border-gray-600 dark:text-gray-100 dark:[&_.alert-title]:text-gray-100 dark:[&>.alert-header>svg]:text-gray-100'
      },
      {
        variant: 'outline',
        theme: 'blue',
        class:
          'border-blue-200 text-blue-800 [&_.alert-title]:text-blue-800 [&>.alert-header>svg]:text-blue-800 dark:border-blue-700 dark:text-blue-200 dark:[&_.alert-title]:text-blue-200 dark:[&>.alert-header>svg]:text-blue-200'
      },
      {
        variant: 'outline',
        theme: 'green',
        class:
          'border-green-200 text-green-800 [&_.alert-title]:text-green-800 [&>.alert-header>svg]:text-green-800 dark:border-green-700 dark:text-green-200 dark:[&_.alert-title]:text-green-200 dark:[&>.alert-header>svg]:text-green-200'
      },
      {
        variant: 'outline',
        theme: 'yellow',
        class:
          'border-yellow-200 text-yellow-900 [&_.alert-title]:text-yellow-900 [&>.alert-header>svg]:text-yellow-900 dark:border-yellow-700 dark:text-yellow-200 dark:[&_.alert-title]:text-yellow-200 dark:[&>.alert-header>svg]:text-yellow-200'
      },
      {
        variant: 'outline',
        theme: 'orange',
        class:
          'border-orange-200 text-orange-900 [&_.alert-title]:text-orange-900 [&>.alert-header>svg]:text-orange-900 dark:border-orange-700 dark:text-orange-200 dark:[&_.alert-title]:text-orange-200 dark:[&>.alert-header>svg]:text-orange-200'
      },
      {
        variant: 'outline',
        theme: 'red',
        class:
          'border-red-200 text-red-800 [&_.alert-title]:text-red-800 [&>.alert-header>svg]:text-red-800 dark:border-red-700 dark:text-red-200 dark:[&_.alert-title]:text-red-200 dark:[&>.alert-header>svg]:text-red-200'
      },
      {
        variant: 'outline',
        theme: 'purple',
        class:
          'border-purple-200 text-purple-900 [&_.alert-title]:text-purple-900 [&>.alert-header>svg]:text-purple-900 dark:border-purple-700 dark:text-purple-200 dark:[&_.alert-title]:text-purple-200 dark:[&>.alert-header>svg]:text-purple-200'
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
      variant: 'outline',
      theme: 'gray',
      width: 'fit'
    }
  }
);
