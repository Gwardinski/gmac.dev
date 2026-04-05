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
  primary: 'border',
  outline: 'border',
  ghost: 'border border-transparent',
  glass: 'backdrop-blur-sm glass-border dark:dark-glass-border'
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
  focus-visible:outline-hidden focus-visible:ring-4 disabled:cursor-default`,
  {
    variants: {
      size: iconButtonSizeClasses,
      variant: iconButtonVariantClasses,
      theme: iconButtonThemeClasses
    },
    compoundVariants: [
      // primary
      {
        variant: 'primary',
        theme: 'gray',
        class: `border-gray-500 bg-gray-500 text-white hover:border-gray-700 hover:bg-gray-700 active:border-gray-700 active:bg-gray-700 
                focus-visible:ring-gray-200
                disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500
                dark:focus-visible:ring-gray-700/40 
                dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40`
      },
      {
        variant: 'primary',
        theme: 'blue',
        class: `border-blue-500 bg-blue-500 text-white hover:border-blue-700 hover:bg-blue-700 active:border-blue-700 active:bg-blue-700 
                focus-visible:ring-blue-200
                disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500
                dark:500-blue-700/70 dark:border-blue-700/70
                dark:focus-visible:ring-blue-700/40 
                dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40`
      },
      {
        variant: 'primary',
        theme: 'green',
        class: `border-green-500 bg-green-500 text-white hover:border-green-700 hover:bg-green-700 active:border-green-700 active:bg-green-700 
                focus-visible:ring-green-200
                disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500
                dark:bg-green-500/70 dark:border-green-700/70
                dark:focus-visible:ring-green-700/40 
                dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40`
      },
      {
        variant: 'primary',
        theme: 'yellow',
        class: `border-yellow-500 bg-yellow-500 text-white hover:border-yellow-700 hover:bg-yellow-700 active:border-yellow-700 active:bg-yellow-700 
                focus-visible:ring-yellow-200
                disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500
                dark:bg-yellow-500/70 dark:border-yellow-700/70
                dark:focus-visible:ring-yellow-700/40 
                dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40`
      },
      {
        variant: 'primary',
        theme: 'orange',
        class: `border-orange-500 bg-orange-500 text-white hover:border-orange-700 hover:bg-orange-700 active:border-orange-700 active:bg-orange-700 
                focus-visible:ring-orange-200
                disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500
                dark:bg-orange-500/70 dark:border-orange-700/70
                dark:focus-visible:ring-orange-700/40 
                dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40`
      },
      {
        variant: 'primary',
        theme: 'red',
        class: `border-red-500 bg-red-500 text-white hover:border-red-700 hover:bg-red-700 active:border-red-700 active:bg-red-700 
                focus-visible:ring-red-200
                disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500
                dark:bg-red-500/70 dark:border-red-700/70
                dark:focus-visible:ring-red-700/40 
                dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40`
      },
      {
        variant: 'primary',
        theme: 'purple',
        class: `border-purple-500 bg-purple-500 text-white hover:border-purple-700 hover:bg-purple-700 active:border-purple-700 active:bg-purple-700 
                focus-visible:ring-purple-200
                disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500
                dark:bg-purple-500/70 dark:border-purple-700/70
                dark:focus-visible:ring-purple-700/40 
                dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40`
      },
      // outline
      {
        variant: 'outline',
        theme: 'gray',
        class: `bg-transparent text-gray-700 border-gray-200 hover:border-gray-700 active:border-gray-700
                focus-visible:ring-gray-200 focus-visible:border-gray-500
                disabled:text-gray-500 disabled:border-gray-300
                dark:border-gray-700 dark:focus-visible:ring-gray-700/40 dark:hover:border-gray-500 dark:active:border-gray-500
                dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40`
      },
      {
        variant: 'outline',
        theme: 'blue',
        class: `bg-transparent text-blue-700 border-blue-200 hover:border-blue-700 active:border-blue-700
                focus-visible:ring-blue-200 focus-visible:border-blue-500
                disabled:text-gray-500 disabled:border-gray-300
                dark:border-blue-700 dark:focus-visible:ring-blue-700/40 dark:hover:border-blue-500 dark:active:border-blue-500
                dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40`
      },
      {
        variant: 'outline',
        theme: 'green',
        class: `bg-transparent text-green-700 border-green-200 hover:border-green-700 active:border-green-700
                focus-visible:ring-green-200 focus-visible:border-green-500
                disabled:text-gray-500 disabled:border-gray-300
                dark:border-green-700 dark:focus-visible:ring-green-700/40 dark:hover:border-green-500 dark:active:border-green-500
                dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40`
      },
      {
        variant: 'outline',
        theme: 'yellow',
        class: `bg-transparent text-yellow-700 border-yellow-200 hover:border-yellow-700 active:border-yellow-700
                focus-visible:ring-yellow-200 focus-visible:border-yellow-500
                disabled:text-gray-500 disabled:border-gray-300
                dark:border-yellow-700 dark:focus-visible:ring-yellow-700/40 dark:hover:border-yellow-500 dark:active:border-yellow-500
                dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40`
      },
      {
        variant: 'outline',
        theme: 'orange',
        class: `bg-transparent text-orange-700 border-orange-200 hover:border-orange-700 active:border-orange-700
                focus-visible:ring-orange-200 focus-visible:border-orange-500
                disabled:text-gray-500 disabled:border-gray-300
                dark:border-orange-700 dark:focus-visible:ring-orange-700/40 dark:hover:border-orange-500 dark:active:border-orange-500
                dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40`
      },
      {
        variant: 'outline',
        theme: 'red',
        class: `bg-transparent text-red-700 border-red-200 hover:border-red-700 active:border-red-700
                focus-visible:ring-red-200 focus-visible:border-red-500
                disabled:text-gray-500 disabled:border-gray-300
                dark:border-red-700 dark:focus-visible:ring-red-700/40 dark:hover:border-red-500 dark:active:border-red-500
                dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40`
      },
      {
        variant: 'outline',
        theme: 'purple',
        class: `bg-transparent text-purple-700 border-purple-200 hover:border-purple-700 active:border-purple-700
                focus-visible:ring-purple-200 focus-visible:border-purple-500
                disabled:text-gray-500 disabled:border-gray-300
                dark:border-purple-700 dark:focus-visible:ring-purple-700/40 dark:hover:border-purple-500 dark:active:border-purple-500
                dark:disabled:bg-transparent dark:disabled:text-gray-500 dark:disabled:border-gray-700/40`
      },
      // ghost
      {
        variant: 'ghost',
        theme: 'gray',
        class: `bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-50 hover:text-gray-700 active:text-gray-700
                focus-visible:ring-gray-500 focus-visible:bg-gray-50 focus-visible:text-gray-700
                disabled:text-gray-500  disabled:bg-transparent
                dark:text-gray-50 dark:hover:bg-gray-900/40 dark:focus-visible:bg-gray-900/40
                dark:disabled:bg-transparent dark:disabled:text-gray-500`
      },
      {
        variant: 'ghost',
        theme: 'blue',
        class: `bg-transparent text-blue-700 hover:bg-blue-50 active:bg-blue-50 hover:text-blue-700 active:text-blue-700
                focus-visible:ring-blue-500 focus-visible:bg-blue-50 focus-visible:text-blue-700
                disabled:text-gray-500  disabled:bg-transparent
                dark:text-gray-50 dark:hover:bg-blue-900/40 dark:focus-visible:bg-blue-900/40
                dark:disabled:bg-transparent dark:disabled:text-gray-500`
      },
      {
        variant: 'ghost',
        theme: 'green',
        class: `bg-transparent text-green-700 hover:bg-green-50 active:bg-green-50 hover:text-green-700 active:text-green-700
                focus-visible:ring-green-500 focus-visible:bg-green-50 focus-visible:text-green-700
                disabled:text-gray-500  disabled:bg-transparent
                dark:text-gray-50 dark:hover:bg-green-900/40 dark:focus-visible:bg-green-900/40
                dark:disabled:bg-transparent dark:disabled:text-gray-500`
      },
      {
        variant: 'ghost',
        theme: 'yellow',
        class: `bg-transparent text-yellow-700 hover:bg-yellow-50 active:bg-yellow-50 hover:text-yellow-700 active:text-yellow-700
                focus-visible:ring-yellow-500 focus-visible:bg-yellow-50 focus-visible:text-yellow-700
                disabled:text-gray-500  disabled:bg-transparent
                dark:text-gray-50 dark:hover:bg-yellow-900/40 dark:focus-visible:bg-yellow-900/40
                dark:disabled:bg-transparent dark:disabled:text-gray-500`
      },
      {
        variant: 'ghost',
        theme: 'orange',
        class: `bg-transparent text-orange-700 hover:bg-orange-50 active:bg-orange-50 hover:text-orange-800 active:text-orange-800
                focus-visible:ring-orange-500 focus-visible:bg-orange-50 focus-visible:text-orange-800
                disabled:text-gray-500  disabled:bg-transparent
                dark:text-gray-50 dark:hover:bg-orange-900/40 dark:focus-visible:bg-orange-900/40
                dark:disabled:bg-transparent dark:disabled:text-gray-500`
      },
      {
        variant: 'ghost',
        theme: 'red',
        class: `bg-transparent text-red-700 hover:bg-red-50 active:bg-red-50 hover:text-red-800 active:text-red-800
                focus-visible:ring-red-500 focus-visible:bg-red-50 focus-visible:text-red-800
                disabled:text-gray-500  disabled:bg-transparent
                dark:text-gray-50 dark:hover:bg-red-900/40 dark:focus-visible:bg-red-900/40
                dark:disabled:bg-transparent dark:disabled:text-gray-500`
      },
      {
        variant: 'ghost',
        theme: 'purple',
        class: `bg-transparent text-purple-700 hover:bg-purple-50 active:bg-purple-50 hover:text-purple-800 active:text-purple-800
                focus-visible:ring-purple-500 focus-visible:bg-purple-50 focus-visible:text-purple-800
                disabled:text-gray-500  disabled:bg-transparent
                dark:text-gray-50 dark:hover:bg-purple-900/40 dark:focus-visible:bg-purple-900/40
                dark:disabled:bg-transparent dark:disabled:text-gray-500`
      },
      // glass
      {
        variant: 'glass',
        theme: 'gray',
        class: 'bg-zinc-500/10 hover:bg-zinc-500/18 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/70'
      },
      {
        variant: 'glass',
        theme: 'blue',
        class: 'bg-blue-500/10 hover:bg-blue-500/18 dark:bg-blue-800/30 dark:hover:bg-blue-800/70'
      },
      {
        variant: 'glass',
        theme: 'green',
        class: 'bg-green-500/10 hover:bg-green-500/18 dark:bg-green-800/30 dark:hover:bg-green-800/70'
      },
      {
        variant: 'glass',
        theme: 'yellow',
        class: 'bg-yellow-500/12 hover:bg-yellow-500/22 dark:bg-yellow-800/30 dark:hover:bg-yellow-800/70'
      },
      {
        variant: 'glass',
        theme: 'orange',
        class: 'bg-orange-500/10 hover:bg-orange-500/18 dark:bg-orange-800/30 dark:hover:bg-orange-800/70'
      },
      {
        variant: 'glass',
        theme: 'red',
        class: 'bg-red-500/10 hover:bg-red-500/18 dark:bg-red-800/30 dark:hover:bg-red-800/70'
      },
      {
        variant: 'glass',
        theme: 'purple',
        class: 'bg-purple-500/10 hover:bg-purple-500/18 dark:bg-purple-800/30 dark:hover:bg-purple-800/70'
      }
    ],
    defaultVariants: {
      size: 'md',
      variant: 'primary',
      theme: 'gray'
    }
  }
);
