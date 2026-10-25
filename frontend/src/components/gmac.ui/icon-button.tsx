import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import type { ButtonSize, ButtonTheme, ButtonVariantOption } from "./button";
import { cn } from "./utils";

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

type IconButtonVariantsProps = VariantProps<typeof iconButtonVariants>;

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">, IconButtonVariantsProps {
  /** Single icon element (e.g. SVG or icon component). */
  children: React.ReactElement;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(props, ref) {
  const { className, variant, size = "md", theme, children, ...rest } = props;

  return (
    <button ref={ref} className={cn(iconButtonVariants({ variant, size, theme }), className)} {...rest}>
      {children}
    </button>
  );
});

interface IconAnchorProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">, IconButtonVariantsProps {
  children: React.ReactElement;
}

export const IconAnchor = forwardRef<HTMLAnchorElement, IconAnchorProps>(function IconAnchor(props, ref) {
  const { className, variant, size = "md", theme, children, ...rest } = props;

  return (
    <a ref={ref} className={cn(iconButtonVariants({ variant, size, theme }), className)} {...rest}>
      {children}
    </a>
  );
});

interface IconLinkProps extends Omit<React.ComponentProps<typeof Link>, "children">, IconButtonVariantsProps {
  children: React.ReactElement;
}

export const IconLink = forwardRef<React.ComponentRef<typeof Link>, IconLinkProps>(function IconLink(props, ref) {
  const { className, variant, size = "md", theme, children, ...rest } = props;

  return (
    <Link ref={ref} className={cn(iconButtonVariants({ variant, size, theme }), className)} {...rest}>
      {children}
    </Link>
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
  type ButtonVariantOption as IconButtonVariantOption,
} from "./button";

const iconButtonSizeClasses = {
  sm: "rounded-full h-9 w-9 min-w-9 min-h-9 max-h-9 max-w-9 shrink-0 p-0 [&>svg]:size-4",
  md: "rounded-full h-10 w-10 min-w-10 min-h-10 max-h-10 max-w-10 shrink-0 p-0 [&>svg]:size-[1.125rem]",
} satisfies Record<ButtonSize, string>;

const iconButtonVariantClasses = {
  solid: "text-white border ",
  outline: " border bg-transparent dark:bg-transparent ",
  ghost: "bg-transparent dark:bg-transparent border border-transparent dark:border-transparent",
  glass: "backdrop-blur dark:backdrop-blur-[32px] glass-border dark:dark-glass-border ",
} satisfies Record<ButtonVariantOption, string>;

const iconButtonThemeClasses = {
  gray: "",
  blue: "",
  green: "",
  yellow: "",
  orange: "",
  red: "",
  purple: "",
} satisfies Record<ButtonTheme, string>;

export const iconButtonVariants = cva(
  `flex inline-flex cursor-pointer items-center justify-center font-normal whitespace-nowrap transition-colors focus-visible:ring-4 focus-visible:outline-hidden disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40 dark:disabled:text-gray-600`,
  {
    variants: {
      size: iconButtonSizeClasses,
      variant: iconButtonVariantClasses,
      theme: iconButtonThemeClasses,
    },
    compoundVariants: [
      // solid — aligned with button.tsx
      {
        variant: "solid",
        theme: "blue",
        class: `border-blue-500 bg-blue-500 hover:border-blue-600 hover:bg-blue-600 focus-visible:ring-blue-500/50 active:border-blue-700 active:bg-blue-700 dark:border-blue-600 dark:bg-blue-600 dark:hover:border-blue-700 dark:hover:bg-blue-700 dark:focus-visible:ring-blue-600/50 dark:active:border-blue-800 dark:active:bg-blue-800`,
      },
      {
        variant: "solid",
        theme: "green",
        class: `border-green-500 bg-green-500 text-gray-950 hover:border-green-600 hover:bg-green-600 focus-visible:ring-green-500/50 active:border-green-700 active:bg-green-700 dark:border-green-600 dark:bg-green-600 dark:text-gray-950 dark:hover:border-green-700 dark:hover:bg-green-700 dark:focus-visible:ring-green-600/50 dark:active:border-green-800 dark:active:bg-green-800`,
      },
      {
        variant: "solid",
        theme: "yellow",
        class: `border-yellow-500 bg-yellow-500 text-gray-950 hover:border-yellow-600 hover:bg-yellow-600 focus-visible:ring-yellow-500/50 active:border-yellow-700 active:bg-yellow-700 dark:border-yellow-600 dark:bg-yellow-600 dark:text-gray-950 dark:hover:border-yellow-700 dark:hover:bg-yellow-700 dark:focus-visible:ring-yellow-600/50 dark:active:border-yellow-800 dark:active:bg-yellow-800`,
      },
      {
        variant: "solid",
        theme: "orange",
        class: `border-orange-500 bg-orange-500 hover:border-orange-600 hover:bg-orange-600 focus-visible:ring-orange-500/50 active:border-orange-700 active:bg-orange-700 dark:border-orange-600 dark:bg-orange-600 dark:hover:border-orange-700 dark:hover:bg-orange-700 dark:focus-visible:ring-orange-600/50 dark:active:border-orange-800 dark:active:bg-orange-800`,
      },
      {
        variant: "solid",
        theme: "red",
        class: `border-red-500 bg-red-500 hover:border-red-600 hover:bg-red-600 focus-visible:ring-red-500/50 active:border-red-700 active:bg-red-700 dark:border-red-600 dark:bg-red-600 dark:hover:border-red-700 dark:hover:bg-red-700 dark:focus-visible:ring-red-600/50 dark:active:border-red-800 dark:active:bg-red-800`,
      },
      {
        variant: "solid",
        theme: "purple",
        class: `border-purple-500 bg-purple-500 hover:border-purple-600 hover:bg-purple-600 focus-visible:ring-purple-500/50 active:border-purple-700 active:bg-purple-700 dark:border-purple-600 dark:bg-purple-600 dark:hover:border-purple-700 dark:hover:bg-purple-700 dark:focus-visible:ring-purple-600/50 dark:active:border-purple-800 dark:active:bg-purple-800`,
      },
      {
        variant: "solid",
        theme: "gray",
        class: `border-gray-800 bg-gray-800 text-white hover:border-gray-950 hover:bg-gray-950 focus-visible:ring-gray-500/50 active:border-gray-950 active:bg-gray-950 dark:border-gray-300 dark:bg-gray-300 dark:text-gray-950 dark:hover:border-gray-400 dark:hover:bg-gray-400 dark:focus-visible:ring-gray-600/50 dark:active:border-gray-500 dark:active:bg-gray-500`,
      },
      // OUTLINE
      {
        variant: "outline",
        theme: "blue",
        class: `border-blue-600 text-blue-600 hover:bg-blue-600/10 focus-visible:ring-blue-600/50 active:bg-blue-600/20 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-600/10 dark:focus-visible:ring-blue-400/50 dark:active:bg-blue-600/20`,
      },
      {
        variant: "outline",
        theme: "green",
        class: `border-green-600 text-green-600 hover:bg-green-600/10 focus-visible:ring-green-600/50 active:bg-green-600/20 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-600/10 dark:focus-visible:ring-green-400/50 dark:active:bg-green-600/20`,
      },
      {
        variant: "outline",
        theme: "yellow",
        class: `border-yellow-600 text-yellow-600 hover:bg-yellow-600/10 focus-visible:ring-yellow-600/50 active:bg-yellow-600/20 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-600/10 dark:focus-visible:ring-yellow-400/50 dark:active:bg-yellow-600/20`,
      },
      {
        variant: "outline",
        theme: "orange",
        class: `border-orange-600 text-orange-600 hover:bg-orange-600/10 focus-visible:ring-orange-600/50 active:bg-orange-600/20 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-600/10 dark:focus-visible:ring-orange-400/50 dark:active:bg-orange-600/20`,
      },
      {
        variant: "outline",
        theme: "red",
        class: `border-red-600 text-red-600 hover:bg-red-600/10 focus-visible:ring-red-600/50 active:bg-red-600/20 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-600/10 dark:focus-visible:ring-red-400/50 dark:active:bg-red-600/20`,
      },
      {
        variant: "outline",
        theme: "purple",
        class: `border-purple-600 text-purple-600 hover:bg-purple-600/10 focus-visible:ring-purple-600/50 active:bg-purple-600/20 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-600/10 dark:focus-visible:ring-purple-400/50 dark:active:bg-purple-600/20`,
      },
      {
        variant: "outline",
        theme: "gray",
        class: `border-gray-800 text-gray-800 hover:bg-gray-800/10 focus-visible:ring-gray-800/50 active:bg-gray-800/20 dark:border-gray-100 dark:text-gray-100 dark:hover:bg-gray-100/10 dark:focus-visible:ring-gray-100/50 dark:active:bg-gray-100/20`,
      },
      // GHOST
      {
        variant: "ghost",
        theme: "blue",
        class: `text-gray-950 hover:bg-blue-600/10 hover:text-blue-600 focus-visible:text-blue-600 focus-visible:ring-blue-600/50 active:bg-blue-600/20 active:text-blue-600 dark:text-white dark:hover:bg-blue-600/10 dark:hover:text-blue-400 dark:focus-visible:text-blue-400 dark:focus-visible:ring-blue-400/50 dark:active:bg-blue-600/20 dark:active:text-blue-400`,
      },
      {
        variant: "ghost",
        theme: "green",
        class: `text-gray-950 hover:bg-green-600/10 hover:text-green-600 focus-visible:text-green-600 focus-visible:ring-green-600/50 active:bg-green-600/20 active:text-green-600 dark:text-white dark:hover:bg-green-600/10 dark:hover:text-green-400 dark:focus-visible:text-green-400 dark:focus-visible:ring-green-400/50 dark:active:bg-green-600/20 dark:active:text-green-400`,
      },
      {
        variant: "ghost",
        theme: "yellow",
        class: `text-gray-950 hover:bg-yellow-600/10 hover:text-yellow-600 focus-visible:text-yellow-600 focus-visible:ring-yellow-600/50 active:bg-yellow-600/20 active:text-yellow-600 dark:text-white dark:hover:bg-yellow-600/10 dark:hover:text-yellow-400 dark:focus-visible:text-yellow-400 dark:focus-visible:ring-yellow-400/50 dark:active:bg-yellow-600/20 dark:active:text-yellow-400`,
      },
      {
        variant: "ghost",
        theme: "orange",
        class: `text-gray-950 hover:bg-orange-600/10 hover:text-orange-600 focus-visible:text-orange-600 focus-visible:ring-orange-600/50 active:bg-orange-600/20 active:text-orange-600 dark:text-white dark:hover:bg-orange-600/10 dark:hover:text-orange-400 dark:focus-visible:text-orange-400 dark:focus-visible:ring-orange-400/50 dark:active:bg-orange-600/20 dark:active:text-orange-400`,
      },
      {
        variant: "ghost",
        theme: "red",
        class: `text-gray-950 hover:bg-red-600/10 hover:text-red-600 focus-visible:text-red-600 focus-visible:ring-red-600/50 active:bg-red-600/20 active:text-red-600 dark:text-white dark:hover:bg-red-600/10 dark:hover:text-red-400 dark:focus-visible:text-red-400 dark:focus-visible:ring-red-400/50 dark:active:bg-red-600/20 dark:active:text-red-400`,
      },
      {
        variant: "ghost",
        theme: "purple",
        class: `text-gray-950 hover:bg-purple-600/10 hover:text-purple-600 focus-visible:text-purple-600 focus-visible:ring-purple-600/50 active:bg-purple-600/20 active:text-purple-600 dark:text-white dark:hover:bg-purple-600/10 dark:hover:text-purple-400 dark:focus-visible:text-purple-400 dark:focus-visible:ring-purple-400/50 dark:active:bg-purple-600/20 dark:active:text-purple-400`,
      },
      {
        variant: "ghost",
        theme: "gray",
        class: `text-gray-950 hover:bg-gray-800/10 hover:text-gray-800 focus-visible:text-gray-800 focus-visible:ring-gray-800/50 active:bg-gray-800/20 active:text-gray-800 dark:text-white dark:hover:bg-gray-600/10 dark:hover:text-gray-100 dark:focus-visible:text-gray-100 dark:focus-visible:ring-gray-100/50 dark:active:bg-gray-600/20 dark:active:text-gray-100`,
      },
      // glass
      {
        variant: "glass",
        theme: "gray",
        class:
          "bg-gray-50/25 hover:bg-gray-50/35 focus-visible:ring-gray-500/50 active:bg-gray-50/45 dark:bg-gray-950/25 dark:hover:bg-gray-950/35 dark:focus-visible:ring-gray-500/50 dark:active:bg-gray-950/45",
      },
      {
        variant: "glass",
        theme: "blue",
        class:
          "bg-blue-50/25 hover:bg-blue-50/35 focus-visible:ring-blue-500/50 active:bg-blue-50/45 dark:bg-blue-950/25 dark:hover:bg-blue-950/35 dark:focus-visible:ring-blue-500/50 dark:active:bg-blue-950/45",
      },
      {
        variant: "glass",
        theme: "green",
        class:
          "bg-green-50/25 hover:bg-green-50/35 focus-visible:ring-green-500/50 active:bg-green-50/45 dark:bg-green-950/25 dark:hover:bg-green-950/35 dark:focus-visible:ring-green-500/50 dark:active:bg-green-950/45",
      },
      {
        variant: "glass",
        theme: "yellow",
        class:
          "bg-yellow-50/25 hover:bg-yellow-50/35 focus-visible:ring-yellow-500/50 active:bg-yellow-50/45 dark:bg-yellow-950/25 dark:hover:bg-yellow-950/35 dark:focus-visible:ring-yellow-500/50 dark:active:bg-yellow-950/45",
      },
      {
        variant: "glass",
        theme: "orange",
        class:
          "bg-orange-50/25 hover:bg-orange-50/35 focus-visible:ring-orange-500/50 active:bg-orange-50/45 dark:bg-orange-950/25 dark:hover:bg-orange-950/35 dark:focus-visible:ring-orange-500/50 dark:active:bg-orange-950/45",
      },
      {
        variant: "glass",
        theme: "red",
        class:
          "bg-red-50/25 hover:bg-red-50/35 focus-visible:ring-red-500/50 active:bg-red-50/45 dark:bg-red-950/25 dark:hover:bg-red-950/35 dark:focus-visible:ring-red-500/50 dark:active:bg-red-950/45",
      },
      {
        variant: "glass",
        theme: "purple",
        class:
          "bg-purple-50/25 hover:bg-purple-50/35 focus-visible:ring-purple-500/50 active:bg-purple-50/45 dark:bg-purple-950/25 dark:hover:bg-purple-950/35 dark:focus-visible:ring-purple-500/50 dark:active:bg-purple-950/45",
      },
    ],
    defaultVariants: {
      size: "md",
      variant: "solid",
      theme: "gray",
    },
  },
);
