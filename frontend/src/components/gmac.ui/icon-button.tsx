import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import type { ButtonSize, ButtonTheme, ButtonVariantOption } from './button';
import { cn } from './utils';

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

type IconButtonVariantsProps = VariantProps<typeof iconButtonVariants>;

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>, IconButtonVariantsProps {
  /** Single icon element (e.g. SVG or icon component). */
  children: React.ReactElement;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(props, ref) {
  const { className, variant, size = 'md', theme, children, ...rest } = props;

  return (
    <button ref={ref} className={cn(iconButtonVariants({ variant, size, theme }), className)} {...rest}>
      {children}
    </button>
  );
});

interface IconAnchorProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>, IconButtonVariantsProps {
  children: React.ReactElement;
}

export const IconAnchor = forwardRef<HTMLAnchorElement, IconAnchorProps>(function IconAnchor(props, ref) {
  const { className, variant, size = 'md', theme, children, ...rest } = props;

  return (
    <a ref={ref} className={cn(iconButtonVariants({ variant, size, theme }), className)} {...rest}>
      {children}
    </a>
  );
});

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export {
  buttonSizeOptions as iconButtonSizeOptions,
  buttonThemeOptions as iconButtonThemeOptions,
  buttonVariantOptions as iconButtonVariantOptions,
  type ButtonSize as IconButtonSize,
  type ButtonTheme as IconButtonTheme,
  type ButtonVariantOption as IconButtonVariantOption
} from './button';

const iconButtonSizeClasses = {
  sm: 'rounded-lg h-9 w-9 min-w-9 min-h-9 max-h-9 max-w-9 shrink-0 p-0 [&>svg]:size-4',
  md: 'rounded-lg h-10 w-10 min-w-10 min-h-10 max-h-10 max-w-10 shrink-0 p-0 [&>svg]:size-[1.125rem]'
} satisfies Record<ButtonSize, string>;

const iconButtonVariantClasses = {
  solid: 'text-white border ',
  outline: ' border bg-transparent dark:bg-transparent ',
  ghost: 'bg-transparent dark:bg-transparent border border-transparent dark:border-transparent',
  glass: 'backdrop-blur dark:backdrop-blur-[32px] glass-border dark:dark-glass-border '
} satisfies Record<ButtonVariantOption, string>;

const iconButtonThemeClasses = {
  gray: '',
  blue: '',
  green: '',
  yellow: '',
  orange: '',
  red: '',
  purple: ''
} satisfies Record<ButtonTheme, string>;

export const iconButtonVariants = cva(
  `flex inline-flex justify-center items-center whitespace-nowrap font-normal transition-colors cursor-pointer 
  focus-visible:outline-hidden focus-visible:ring-4 disabled:cursor-default
  disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40 dark:disabled:text-gray-600`,
  {
    variants: {
      size: iconButtonSizeClasses,
      variant: iconButtonVariantClasses,
      theme: iconButtonThemeClasses
    },
    compoundVariants: [
      // solid — aligned with button.tsx
      {
        variant: 'solid',
        theme: 'blue',
        class: `bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                border-blue-500 hover:border-blue-600 active:border-blue-700
                focus-visible:ring-blue-500/50
                dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800
                dark:border-blue-600 dark:hover:border-blue-700 dark:active:border-blue-800
                dark:focus-visible:ring-blue-600/50`
      },
      {
        variant: 'solid',
        theme: 'green',
        class: `bg-green-500 hover:bg-green-600 active:bg-green-700
                border-green-500 hover:border-green-600 active:border-green-700
                focus-visible:ring-green-500/50
                dark:bg-green-600 dark:hover:bg-green-700 dark:active:bg-green-800
                dark:border-green-600 dark:hover:border-green-700 dark:active:border-green-800
                dark:focus-visible:ring-green-600/50`
      },
      {
        variant: 'solid',
        theme: 'yellow',
        class: `bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
                border-yellow-500 hover:border-yellow-600 active:border-yellow-700
                focus-visible:ring-yellow-500/50
                dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-800
                dark:border-yellow-600 dark:hover:border-yellow-700 dark:active:border-yellow-800
                dark:focus-visible:ring-yellow-600/50
                text-black dark:text-black`
      },
      {
        variant: 'solid',
        theme: 'orange',
        class: `bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                border-orange-500 hover:border-orange-600 active:border-orange-700
                focus-visible:ring-orange-500/50
                dark:bg-orange-600 dark:hover:bg-orange-700 dark:active:bg-orange-800
                dark:border-orange-600 dark:hover:border-orange-700 dark:active:border-orange-800
                dark:focus-visible:ring-orange-600/50`
      },
      {
        variant: 'solid',
        theme: 'red',
        class: `bg-red-500 hover:bg-red-600 active:bg-red-700
                border-red-500 hover:border-red-600 active:border-red-700
                focus-visible:ring-red-500/50
                dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800
                dark:border-red-600 dark:hover:border-red-700 dark:active:border-red-800
                dark:focus-visible:ring-red-600/50`
      },
      {
        variant: 'solid',
        theme: 'purple',
        class: `bg-purple-500 hover:bg-purple-600 active:bg-purple-700
                border-purple-500 hover:border-purple-600 active:border-purple-700
                focus-visible:ring-purple-500/50
                dark:bg-purple-600 dark:hover:bg-purple-700 dark:active:bg-purple-800
                dark:border-purple-600 dark:hover:border-purple-700 dark:active:border-purple-800
                dark:focus-visible:ring-purple-600/50`
      },
      {
        variant: 'solid',
        theme: 'gray',
        class: `bg-gray-800 hover:bg-gray-900 active:bg-gray-950 
                border-gray-800 hover:border-gray-900 active:border-gray-950
                focus-visible:ring-gray-500/50
                dark:bg-gray-300 dark:hover:bg-gray-400 dark:active:bg-gray-500
                dark:border-gray-300 dark:hover:border-gray-400 dark:active:border-gray-500
                dark:focus-visible:ring-gray-600/50
                text-white dark:text-black`
      },
      // OUTLINE
      {
        variant: 'outline',
        theme: 'blue',
        class: `hover:bg-blue-600/10 active:bg-blue-600/20
                text-blue-600 border-blue-600
                focus-visible:ring-blue-600/50
                dark:hover:bg-blue-600/10 dark:active:bg-blue-600/20
                dark:text-blue-400 dark:border-blue-400
                dark:focus-visible:ring-blue-400/50`
      },
      {
        variant: 'outline',
        theme: 'green',
        class: `hover:bg-green-600/10 active:bg-green-600/20
                text-green-600 border-green-600
                focus-visible:ring-green-600/50
                dark:hover:bg-green-600/10 dark:active:bg-green-600/20
                dark:text-green-400 dark:border-green-400
                dark:focus-visible:ring-green-400/50`
      },
      {
        variant: 'outline',
        theme: 'yellow',
        class: `hover:bg-yellow-600/10 active:bg-yellow-600/20
                text-yellow-600 border-yellow-600
                focus-visible:ring-yellow-600/50
                dark:hover:bg-yellow-600/10 dark:active:bg-yellow-600/20
                dark:text-yellow-400 dark:border-yellow-400
                dark:focus-visible:ring-yellow-400/50`
      },
      {
        variant: 'outline',
        theme: 'orange',
        class: `hover:bg-orange-600/10 active:bg-orange-600/20
                text-orange-600 border-orange-600
                focus-visible:ring-orange-600/50
                dark:hover:bg-orange-600/10 dark:active:bg-orange-600/20
                dark:text-orange-400 dark:border-orange-400
                dark:focus-visible:ring-orange-400/50`
      },
      {
        variant: 'outline',
        theme: 'red',
        class: `hover:bg-red-600/10 active:bg-red-600/20
                text-red-600 border-red-600
                focus-visible:ring-red-600/50
                dark:hover:bg-red-600/10 dark:active:bg-red-600/20
                dark:text-red-400 dark:border-red-400
                dark:focus-visible:ring-red-400/50`
      },
      {
        variant: 'outline',
        theme: 'purple',
        class: `hover:bg-purple-600/10 active:bg-purple-600/20
                text-purple-600 border-purple-600
                focus-visible:ring-purple-600/50
                dark:hover:bg-purple-600/10 dark:active:bg-purple-600/20
                dark:text-purple-400 dark:border-purple-400
                dark:focus-visible:ring-purple-400/50`
      },
      {
        variant: 'outline',
        theme: 'gray',
        class: `hover:bg-gray-800/10 active:bg-gray-800/20
                text-gray-800 border-gray-800
                focus-visible:ring-gray-800/50
                dark:hover:bg-gray-100/10 dark:active:bg-gray-100/20
                dark:text-gray-100 dark:border-gray-100
                dark:focus-visible:ring-gray-100/50`
      },
      // GHOST
      {
        variant: 'ghost',
        theme: 'blue',
        class: `hover:bg-blue-600/10 active:bg-blue-600/20
                text-blue-600
                focus-visible:ring-blue-600/50
                dark:hover:bg-blue-600/10 dark:active:bg-blue-600/20
                dark:text-blue-400
                dark:focus-visible:ring-blue-400/50`
      },
      {
        variant: 'ghost',
        theme: 'green',
        class: `hover:bg-green-600/10 active:bg-green-600/20
                text-green-600
                focus-visible:ring-green-600/50
                dark:hover:bg-green-600/10 dark:active:bg-green-600/20
                dark:text-green-400
                dark:focus-visible:ring-green-400/50`
      },
      {
        variant: 'ghost',
        theme: 'yellow',
        class: `hover:bg-yellow-600/10 active:bg-yellow-600/20
                text-yellow-600
                focus-visible:ring-yellow-600/50
                dark:hover:bg-yellow-600/10 dark:active:bg-yellow-600/20
                dark:text-yellow-400
                dark:focus-visible:ring-yellow-400/50`
      },
      {
        variant: 'ghost',
        theme: 'orange',
        class: `hover:bg-orange-600/10 active:bg-orange-600/20
                text-orange-600
                focus-visible:ring-orange-600/50
                dark:hover:bg-orange-600/10 dark:active:bg-orange-600/20
                dark:text-orange-400
                dark:focus-visible:ring-orange-400/50`
      },
      {
        variant: 'ghost',
        theme: 'red',
        class: `hover:bg-red-600/10 active:bg-red-600/20
                text-red-600
                focus-visible:ring-red-600/50
                dark:hover:bg-red-600/10 dark:active:bg-red-600/20
                dark:text-red-400
                dark:focus-visible:ring-red-400/50`
      },
      {
        variant: 'ghost',
        theme: 'purple',
        class: `hover:bg-purple-600/10 active:bg-purple-600/20
                text-purple-600
                focus-visible:ring-purple-600/50
                dark:hover:bg-purple-600/10 dark:active:bg-purple-600/20
                dark:text-purple-400
                dark:focus-visible:ring-purple-400/50`
      },
      {
        variant: 'ghost',
        theme: 'gray',
        class: `hover:bg-gray-800/10 active:bg-gray-800/20
                text-gray-800 
                focus-visible:ring-gray-800/50
                dark:hover:bg-gray-600/10 dark:active:bg-gray-600/20
                dark:text-gray-100 
                dark:focus-visible:ring-gray-100/50`
      },
      // glass
      {
        variant: 'glass',
        theme: 'gray',
        class:
          'bg-gray-50/25 hover:bg-gray-50/35 active:bg-gray-50/45 dark:bg-gray-950/25 dark:hover:bg-gray-950/35 dark:active:bg-gray-950/45 focus-visible:ring-gray-500/50 dark:focus-visible:ring-gray-500/50'
      },
      {
        variant: 'glass',
        theme: 'blue',
        class:
          'bg-blue-50/25 hover:bg-blue-50/35 active:bg-blue-50/45 dark:bg-blue-950/25 dark:hover:bg-blue-950/35 dark:active:bg-blue-950/45 focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50'
      },
      {
        variant: 'glass',
        theme: 'green',
        class:
          'bg-green-50/25 hover:bg-green-50/35 active:bg-green-50/45 dark:bg-green-950/25 dark:hover:bg-green-950/35 dark:active:bg-green-950/45 focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50'
      },
      {
        variant: 'glass',
        theme: 'yellow',
        class:
          'bg-yellow-50/25 hover:bg-yellow-50/35 active:bg-yellow-50/45 dark:bg-yellow-950/25 dark:hover:bg-yellow-950/35 dark:active:bg-yellow-950/45 focus-visible:ring-yellow-500/50 dark:focus-visible:ring-yellow-500/50'
      },
      {
        variant: 'glass',
        theme: 'orange',
        class:
          'bg-orange-50/25 hover:bg-orange-50/35 active:bg-orange-50/45 dark:bg-orange-950/25 dark:hover:bg-orange-950/35 dark:active:bg-orange-950/45 focus-visible:ring-orange-500/50 dark:focus-visible:ring-orange-500/50'
      },
      {
        variant: 'glass',
        theme: 'red',
        class:
          'bg-red-50/25 hover:bg-red-50/35 active:bg-red-50/45 dark:bg-red-950/25 dark:hover:bg-red-950/35 dark:active:bg-red-950/45 focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/50'
      },
      {
        variant: 'glass',
        theme: 'purple',
        class:
          'bg-purple-50/25 hover:bg-purple-50/35 active:bg-purple-50/45 dark:bg-purple-950/25 dark:hover:bg-purple-950/35 dark:active:bg-purple-950/45 focus-visible:ring-purple-500/50 dark:focus-visible:ring-purple-500/50'
      }
    ],
    defaultVariants: {
      size: 'md',
      variant: 'solid',
      theme: 'gray'
    }
  }
);
