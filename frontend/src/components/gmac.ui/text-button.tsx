import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { textVariants } from "./typography";
import { cn } from "./utils";

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
TextButton.displayName = "TextButton";

export const TextAnchor = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof textButtonVariants>>((props, ref) => {
  const { className, theme, children, ...rest } = props;

  return (
    <a ref={ref} className={cn(textButtonVariants({ theme }), className)} {...rest}>
      {children}
    </a>
  );
});
TextAnchor.displayName = "TextAnchor";

export const TextLink = forwardRef<React.ComponentRef<typeof Link>, React.ComponentProps<typeof Link> & VariantProps<typeof textButtonVariants>>((props, ref) => {
  const { className, theme, children, ...rest } = props;

  return (
    <Link ref={ref} className={cn(textButtonVariants({ theme }), className)} {...rest}>
      {children}
    </Link>
  );
});
TextLink.displayName = "TextLink";

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export const textButtonThemeOptions = [
  "default",
  "gray",
  "blue",
  "green",
  "yellow",
  "orange",
  "red",
  "purple",
  "lime",
  "teal",
  "indigo",
  "slate",
  "neutral",
  "mauve",
  "mist",
  "olive",
] as const;
export type TextButtonTheme = (typeof textButtonThemeOptions)[number];

const textButtonThemeClasses = {
  default: "text-gray-800 dark:text-gray-100 focus-visible:ring-gray-800/50 dark:focus-visible:ring-gray-100/50",
  gray: "text-gray-600 dark:text-gray-400 focus-visible:ring-gray-600/50 dark:focus-visible:ring-gray-400/50",
  blue: "text-blue-600 dark:text-blue-400 focus-visible:ring-blue-600/50 dark:focus-visible:ring-blue-400/50",
  green: "text-green-600 dark:text-green-400 focus-visible:ring-green-600/50 dark:focus-visible:ring-green-400/50",
  yellow: "text-yellow-600 dark:text-yellow-400 focus-visible:ring-yellow-600/50 dark:focus-visible:ring-yellow-400/50",
  orange: "text-orange-600 dark:text-orange-400 focus-visible:ring-orange-600/50 dark:focus-visible:ring-orange-400/50",
  red: "text-red-600 dark:text-red-400 focus-visible:ring-red-600/50 dark:focus-visible:ring-red-400/50",
  purple: "text-purple-600 dark:text-purple-400 focus-visible:ring-purple-600/50 dark:focus-visible:ring-purple-400/50",
  lime: "text-lime-600 dark:text-lime-400 focus-visible:ring-lime-600/50 dark:focus-visible:ring-lime-400/50",
  teal: "text-teal-600 dark:text-teal-400 focus-visible:ring-teal-600/50 dark:focus-visible:ring-teal-400/50",
  indigo: "text-indigo-600 dark:text-indigo-400 focus-visible:ring-indigo-600/50 dark:focus-visible:ring-indigo-400/50",
  slate: "text-slate-600 dark:text-slate-400 focus-visible:ring-slate-600/50 dark:focus-visible:ring-slate-400/50",
  neutral: "text-neutral-600 dark:text-neutral-400 focus-visible:ring-neutral-600/50 dark:focus-visible:ring-neutral-400/50",
  mauve: "text-mauve-600 dark:text-mauve-400 focus-visible:ring-mauve-600/50 dark:focus-visible:ring-mauve-400/50",
  mist: "text-mist-600 dark:text-mist-400 focus-visible:ring-mist-600/50 dark:focus-visible:ring-mist-400/50",
  olive: "text-olive-600 dark:text-olive-400 focus-visible:ring-olive-600/50 dark:focus-visible:ring-olive-400/50",
} satisfies Record<TextButtonTheme, string>;

export const textButtonVariants = cva(
  `${textVariants({ size: "md" })} inline-flex w-fit min-w-fit cursor-pointer items-center gap-2 whitespace-nowrap underline underline-offset-2 transition-colors outline-none hover:underline-offset-4 focus-visible:rounded-full focus-visible:ring-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      theme: textButtonThemeClasses,
    },
    defaultVariants: {
      theme: "default",
    },
  },
);
