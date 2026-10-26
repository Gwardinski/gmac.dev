import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import type { ButtonTheme } from "./button";
import { cn } from "./utils";

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
Badge.displayName = "Badge";

// ------------------------------------------------------------
// THEMING (subset of Button variants; static — no interactive states)
// ------------------------------------------------------------

export const badgeVariantOptions = ["solid", "outline", "glass"] as const;
export type BadgeVariantOption = (typeof badgeVariantOptions)[number];

export { buttonThemeOptions as badgeThemeOptions, type ButtonTheme as BadgeThemeOption } from "./button";

const badgeVariantClasses = {
  solid: "text-white border ",
  outline: " border bg-transparent dark:bg-transparent ",
  glass: "backdrop-blur dark:backdrop-blur-[32px] glass-border dark:dark-glass-border ",
} satisfies Record<BadgeVariantOption, string>;

const badgeThemeClasses = {
  default: "",
  gray: "",
  blue: "",
  green: "",
  yellow: "",
  orange: "",
  red: "",
  purple: "",
  lime: "",
  teal: "",
  indigo: "",
  slate: "",
  neutral: "",
  mauve: "",
  mist: "",
  olive: "",
} satisfies Record<ButtonTheme, string>;

export const badgeVariants = cva(
  "inline-flex h-6 max-h-6 max-w-fit min-w-fit flex-row items-center gap-1 rounded-lg px-2 text-sm font-medium uppercase transition-colors [&_svg]:shrink-0",
  {
    variants: {
      variant: badgeVariantClasses,
      theme: badgeThemeClasses,
    },
    compoundVariants: [
      // solid — Button solid at rest (no hover/active/focus)
      {
        variant: "solid",
        theme: "blue",
        class: "border-blue-500 bg-blue-500 dark:border-blue-600 dark:bg-blue-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "green",
        class: "border-green-500 bg-green-500 text-gray-950 dark:border-green-600 dark:bg-green-600 dark:text-gray-950 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "yellow",
        class: "border-yellow-500 bg-yellow-500 text-gray-900 dark:border-yellow-600 dark:bg-yellow-600 dark:text-gray-900 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "orange",
        class: "border-orange-500 bg-orange-500 dark:border-orange-600 dark:bg-orange-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "red",
        class: "border-red-500 bg-red-500 dark:border-red-600 dark:bg-red-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "purple",
        class: "border-purple-500 bg-purple-500 dark:border-purple-600 dark:bg-purple-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "lime",
        class: "border-lime-500 bg-lime-500 text-gray-950 dark:border-lime-600 dark:bg-lime-600 dark:text-gray-950 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "teal",
        class: "border-teal-500 bg-teal-500 text-gray-950 dark:border-teal-600 dark:bg-teal-600 dark:text-gray-950 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "indigo",
        class: "border-indigo-500 bg-indigo-500 dark:border-indigo-600 dark:bg-indigo-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "slate",
        class: "border-slate-500 bg-slate-500 dark:border-slate-600 dark:bg-slate-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "neutral",
        class: "border-neutral-500 bg-neutral-500 dark:border-neutral-600 dark:bg-neutral-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "mauve",
        class: "border-mauve-500 bg-mauve-500 dark:border-mauve-600 dark:bg-mauve-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "mist",
        class: "border-mist-500 bg-mist-500 dark:border-mist-600 dark:bg-mist-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "olive",
        class: "border-olive-500 bg-olive-500 dark:border-olive-600 dark:bg-olive-600 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "default",
        class: "border-gray-800 bg-gray-800 text-white dark:border-gray-300 dark:bg-gray-300 dark:text-gray-900 [&_svg]:text-inherit",
      },
      {
        variant: "solid",
        theme: "gray",
        class: "border-gray-500 bg-gray-500 dark:border-gray-600 dark:bg-gray-600 [&_svg]:text-inherit",
      },
      // outline — Button outline at rest (no hover/active/focus)
      {
        variant: "outline",
        theme: "blue",
        class: "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "green",
        class: "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "yellow",
        class: "border-yellow-600 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "orange",
        class: "border-orange-600 text-orange-600 dark:border-orange-400 dark:text-orange-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "red",
        class: "border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "purple",
        class: "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "lime",
        class: "border-lime-600 text-lime-600 dark:border-lime-400 dark:text-lime-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "teal",
        class: "border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "indigo",
        class: "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "slate",
        class: "border-slate-600 text-slate-600 dark:border-slate-400 dark:text-slate-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "neutral",
        class: "border-neutral-600 text-neutral-600 dark:border-neutral-400 dark:text-neutral-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "mauve",
        class: "border-mauve-600 text-mauve-600 dark:border-mauve-400 dark:text-mauve-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "mist",
        class: "border-mist-600 text-mist-600 dark:border-mist-400 dark:text-mist-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "olive",
        class: "border-olive-600 text-olive-600 dark:border-olive-400 dark:text-olive-400 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "default",
        class: "border-gray-800 text-gray-800 dark:border-gray-100 dark:text-gray-100 [&_svg]:text-inherit",
      },
      {
        variant: "outline",
        theme: "gray",
        class: "border-gray-600 text-gray-600 dark:border-gray-400 dark:text-gray-400 [&_svg]:text-inherit",
      },
      // glass — Button glass tints at rest; text matches outline for contrast
      {
        variant: "glass",
        theme: "default",
        class: "bg-gray-50/25 text-gray-800 dark:bg-gray-950/25 dark:text-gray-100 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "gray",
        class: "bg-gray-50/25 text-gray-600 dark:bg-gray-950/25 dark:text-gray-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "blue",
        class: "bg-blue-50/25 text-blue-600 dark:bg-blue-950/25 dark:text-blue-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "green",
        class: "bg-green-50/25 text-green-600 dark:bg-green-950/25 dark:text-green-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "yellow",
        class: "bg-yellow-50/25 text-yellow-600 dark:bg-yellow-950/25 dark:text-yellow-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "orange",
        class: "bg-orange-50/25 text-orange-600 dark:bg-orange-950/25 dark:text-orange-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "red",
        class: "bg-red-50/25 text-red-600 dark:bg-red-950/25 dark:text-red-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "purple",
        class: "bg-purple-50/25 text-purple-600 dark:bg-purple-950/25 dark:text-purple-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "lime",
        class: "bg-lime-50/25 text-lime-600 dark:bg-lime-950/25 dark:text-lime-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "teal",
        class: "bg-teal-50/25 text-teal-600 dark:bg-teal-950/25 dark:text-teal-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "indigo",
        class: "bg-indigo-50/25 text-indigo-600 dark:bg-indigo-950/25 dark:text-indigo-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "slate",
        class: "bg-slate-50/25 text-slate-600 dark:bg-slate-950/25 dark:text-slate-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "neutral",
        class: "bg-neutral-50/25 text-neutral-600 dark:bg-neutral-950/25 dark:text-neutral-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "mauve",
        class: "bg-mauve-50/25 text-mauve-600 dark:bg-mauve-950/25 dark:text-mauve-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "mist",
        class: "bg-mist-50/25 text-mist-600 dark:bg-mist-950/25 dark:text-mist-400 [&_svg]:text-inherit",
      },
      {
        variant: "glass",
        theme: "olive",
        class: "bg-olive-50/25 text-olive-600 dark:bg-olive-950/25 dark:text-olive-400 [&_svg]:text-inherit",
      },
    ],
    defaultVariants: {
      variant: "solid",
      theme: "default",
    },
  },
);
