import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import type { ButtonTheme } from "./button";
import { H4, P } from "./typography";
import { cn } from "./utils";

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

function Card({
  className,
  variant,
  theme,
  chonk,
  as = "article",
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    as?: "article" | "div" | "section" | "header";
  }) {
  const Comp = as;
  return <Comp data-slot="card" className={cn(cardVariants({ variant, theme, chonk }), className)} {...props} />;
}

function CardButton({ className, variant, theme, chonk, type = "button", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof cardVariants>) {
  return (
    <button
      type={type}
      data-slot="card"
      className={cn(
        cardVariants({ variant, theme, chonk }),
        cardInteractiveVariants({ variant, theme }),
        "cursor-pointer text-left disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function CardLink({ className, variant, theme, chonk, ...props }: React.ComponentProps<typeof Link> & VariantProps<typeof cardVariants>) {
  return (
    <Link
      data-slot="card"
      className={cn(cardVariants({ variant, theme, chonk }), cardInteractiveVariants({ variant, theme }), "cursor-pointer text-left disabled:opacity-50", className)}
      {...props}
    />
  );
}

function CardHeader({
  className,
  column = false,
  left,
  right,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  column?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header data-slot="card-header" className={cn("flex w-full gap-2 px-4 pb-4 group-has-data-[slot=card-body]:pb-5 [&_svg]:text-purple-500", className)} {...props}>
      {left && <span className="flex h-fit shrink-0 gap-2">{left}</span>}
      <span className={cn("flex w-full gap-2", column ? "flex-col" : "flex-row flex-wrap items-center")}>{children}</span>
      {right && <span className="flex h-fit shrink-0 gap-2">{right}</span>}
    </header>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <H4 as="p" data-slot="card-title" className={cn("w-fit text-inherit", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <P data-slot="card-description" className={cn("w-full basis-full text-inherit", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />;
}

function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-body" className={cn("flex flex-col gap-4 px-4 pb-4", className)} {...props} />;
}

function CardFooter({ className, column = false, ...props }: React.ComponentProps<"div"> & { column?: boolean }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("mt-auto flex gap-2 rounded-b-lg px-4 pt-4 pb-4", column ? "w-full flex-col" : "flex-row items-center justify-end", className)}
      {...props}
    />
  );
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export { buttonThemeOptions as cardThemeOptions, type ButtonTheme as CardTheme } from "./button";

export const cardVariantOptions = ["solid", "outline", "glass"] as const;
export type CardVariantOption = (typeof cardVariantOptions)[number];

const cardVariantClasses = {
  solid: "",
  outline: "",
  glass: "backdrop-blur dark:backdrop-blur-[32px] glass-border dark:dark-glass-border",
} satisfies Record<CardVariantOption, string>;

const cardThemeClasses = {
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

/** Static surface (border / background / text). Used by `Card`; no hover or focus affordances. */
export const cardVariants = cva(
  "group relative flex max-h-fit w-full flex-col rounded-lg border border-gray-300 px-4 pt-4 pb-4 has-data-[slot=card-body]:px-0 has-data-[slot=card-body]:pb-0 has-data-[slot=card-header]:px-0 has-data-[slot=card-header]:pb-0 has-data-[slot=card-image]:pt-0 dark:border-gray-700",
  {
    variants: {
      variant: cardVariantClasses,
      theme: cardThemeClasses,
      /** Thick border. */
      chonk: { true: "border-5", false: "" },
    },
    compoundVariants: [
      // solid
      {
        variant: "solid",
        theme: "default",
        class: "border-gray-200 bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white",
      },
      {
        variant: "solid",
        theme: "gray",
        class: "border-gray-500 bg-gray-500 text-white dark:border-gray-900 dark:bg-gray-950",
      },
      {
        variant: "solid",
        theme: "blue",
        class: "border-blue-500 bg-blue-500 text-white dark:border-blue-900 dark:bg-blue-950",
      },
      {
        variant: "solid",
        theme: "green",
        class: "border-green-500 bg-green-500 text-gray-950 dark:border-green-900 dark:bg-green-950 dark:text-white",
      },
      {
        variant: "solid",
        theme: "yellow",
        class: "border-yellow-500 bg-yellow-500 text-gray-950 dark:border-yellow-900 dark:bg-yellow-950 dark:text-white",
      },
      {
        variant: "solid",
        theme: "orange",
        class: "border-orange-500 bg-orange-500 text-white dark:border-orange-900 dark:bg-orange-950",
      },
      {
        variant: "solid",
        theme: "red",
        class: "border-red-500 bg-red-500 text-white dark:border-red-900 dark:bg-red-950",
      },
      {
        variant: "solid",
        theme: "purple",
        class: "border-purple-500 bg-purple-500 text-white dark:border-purple-900 dark:bg-purple-950",
      },
      {
        variant: "solid",
        theme: "lime",
        class: "border-lime-500 bg-lime-500 text-gray-950 dark:border-lime-900 dark:bg-lime-950 dark:text-white",
      },
      {
        variant: "solid",
        theme: "teal",
        class: "border-teal-500 bg-teal-500 text-gray-950 dark:border-teal-900 dark:bg-teal-950 dark:text-white",
      },
      {
        variant: "solid",
        theme: "indigo",
        class: "border-indigo-500 bg-indigo-500 text-white dark:border-indigo-900 dark:bg-indigo-950",
      },
      {
        variant: "solid",
        theme: "slate",
        class: "border-slate-500 bg-slate-500 text-white dark:border-slate-900 dark:bg-slate-950",
      },
      {
        variant: "solid",
        theme: "neutral",
        class: "border-neutral-500 bg-neutral-500 text-white dark:border-neutral-900 dark:bg-neutral-950",
      },
      {
        variant: "solid",
        theme: "mauve",
        class: "border-mauve-500 bg-mauve-500 text-white dark:border-mauve-900 dark:bg-mauve-950",
      },
      {
        variant: "solid",
        theme: "mist",
        class: "border-mist-500 bg-mist-500 text-white dark:border-mist-900 dark:bg-mist-950",
      },
      {
        variant: "solid",
        theme: "olive",
        class: "border-olive-500 bg-olive-500 text-white dark:border-olive-900 dark:bg-olive-950",
      },
      // outline
      {
        variant: "outline",
        theme: "default",
        class: "border-gray-200 bg-transparent text-gray-900 dark:border-gray-700 dark:text-gray-50",
      },
      {
        variant: "outline",
        theme: "gray",
        class: "border-gray-200 bg-transparent text-gray-800 dark:border-gray-700 dark:text-gray-200",
      },
      {
        variant: "outline",
        theme: "blue",
        class: "border-blue-200 bg-transparent text-blue-800 dark:border-blue-700 dark:text-blue-200",
      },
      {
        variant: "outline",
        theme: "green",
        class: "border-green-200 bg-transparent text-green-800 dark:border-green-700 dark:text-green-200",
      },
      {
        variant: "outline",
        theme: "yellow",
        class: "border-yellow-200 bg-transparent text-yellow-800 dark:border-yellow-700 dark:text-yellow-200",
      },
      {
        variant: "outline",
        theme: "orange",
        class: "border-orange-200 bg-transparent text-orange-800 dark:border-orange-700 dark:text-orange-200",
      },
      {
        variant: "outline",
        theme: "red",
        class: "border-red-200 bg-transparent text-red-800 dark:border-red-700 dark:text-red-200",
      },
      {
        variant: "outline",
        theme: "purple",
        class: "border-purple-200 bg-transparent text-purple-800 dark:border-purple-700 dark:text-purple-200",
      },
      {
        variant: "outline",
        theme: "lime",
        class: "border-lime-200 bg-transparent text-lime-800 dark:border-lime-700 dark:text-lime-200",
      },
      {
        variant: "outline",
        theme: "teal",
        class: "border-teal-200 bg-transparent text-teal-800 dark:border-teal-700 dark:text-teal-200",
      },
      {
        variant: "outline",
        theme: "indigo",
        class: "border-indigo-200 bg-transparent text-indigo-800 dark:border-indigo-700 dark:text-indigo-200",
      },
      {
        variant: "outline",
        theme: "slate",
        class: "border-slate-200 bg-transparent text-slate-800 dark:border-slate-700 dark:text-slate-200",
      },
      {
        variant: "outline",
        theme: "neutral",
        class: "border-neutral-200 bg-transparent text-neutral-800 dark:border-neutral-700 dark:text-neutral-200",
      },
      {
        variant: "outline",
        theme: "mauve",
        class: "border-mauve-200 bg-transparent text-mauve-800 dark:border-mauve-700 dark:text-mauve-200",
      },
      {
        variant: "outline",
        theme: "mist",
        class: "border-mist-200 bg-transparent text-mist-800 dark:border-mist-700 dark:text-mist-200",
      },
      {
        variant: "outline",
        theme: "olive",
        class: "border-olive-200 bg-transparent text-olive-800 dark:border-olive-700 dark:text-olive-200",
      },
      // glass
      {
        variant: "glass",
        theme: "default",
        class: "bg-gray-50/25 text-gray-900 dark:bg-gray-950/25 dark:text-white",
      },
      {
        variant: "glass",
        theme: "gray",
        class: "bg-gray-50/25 text-gray-950 dark:bg-gray-950/25 dark:text-gray-50",
      },
      {
        variant: "glass",
        theme: "blue",
        class: "bg-blue-50/25 text-blue-950 dark:bg-blue-950/25 dark:text-blue-50",
      },
      {
        variant: "glass",
        theme: "green",
        class: "bg-green-50/25 text-green-950 dark:bg-green-950/25 dark:text-green-50",
      },
      {
        variant: "glass",
        theme: "yellow",
        class: "bg-yellow-50/25 text-yellow-950 dark:bg-yellow-950/25 dark:text-yellow-50",
      },
      {
        variant: "glass",
        theme: "orange",
        class: "bg-orange-50/25 text-orange-950 dark:bg-orange-950/25 dark:text-orange-50",
      },
      {
        variant: "glass",
        theme: "red",
        class: "bg-red-50/25 text-red-950 dark:bg-red-950/25 dark:text-red-50",
      },
      {
        variant: "glass",
        theme: "purple",
        class: "bg-purple-50/25 text-purple-950 dark:bg-purple-950/25 dark:text-purple-50",
      },
      {
        variant: "glass",
        theme: "lime",
        class: "bg-lime-50/25 text-lime-950 dark:bg-lime-950/25 dark:text-lime-50",
      },
      {
        variant: "glass",
        theme: "teal",
        class: "bg-teal-50/25 text-teal-950 dark:bg-teal-950/25 dark:text-teal-50",
      },
      {
        variant: "glass",
        theme: "indigo",
        class: "bg-indigo-50/25 text-indigo-950 dark:bg-indigo-950/25 dark:text-indigo-50",
      },
      {
        variant: "glass",
        theme: "slate",
        class: "bg-slate-50/25 text-slate-950 dark:bg-slate-950/25 dark:text-slate-50",
      },
      {
        variant: "glass",
        theme: "neutral",
        class: "bg-neutral-50/25 text-neutral-950 dark:bg-neutral-950/25 dark:text-neutral-50",
      },
      {
        variant: "glass",
        theme: "mauve",
        class: "bg-mauve-50/25 text-mauve-950 dark:bg-mauve-950/25 dark:text-mauve-50",
      },
      {
        variant: "glass",
        theme: "mist",
        class: "bg-mist-50/25 text-mist-950 dark:bg-mist-950/25 dark:text-mist-50",
      },
      {
        variant: "glass",
        theme: "olive",
        class: "bg-olive-50/25 text-olive-950 dark:bg-olive-950/25 dark:text-olive-50",
      },
    ],
    defaultVariants: {
      variant: "solid",
      theme: "default",
    },
  },
);

/** Hover / active / focus-visible / disabled — only composed on `CardButton` and `CardLink`. */
const cardInteractiveVariants = cva("transition-colors", {
  variants: {
    variant: cardVariantClasses,
    theme: cardThemeClasses,
  },
  compoundVariants: [
    {
      variant: "solid",
      theme: "default",
      class:
        "hover:border-gray-700 hover:bg-gray-700 focus-visible:ring-4 focus-visible:ring-gray-200 focus-visible:outline-hidden active:border-gray-700 active:bg-gray-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-gray-700/40 dark:hover:bg-gray-700/40 dark:focus-visible:ring-gray-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "gray",
      class:
        "hover:border-gray-700 hover:bg-gray-700 focus-visible:ring-4 focus-visible:ring-gray-200 focus-visible:outline-hidden active:border-gray-700 active:bg-gray-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-gray-700/40 dark:hover:bg-gray-700/40 dark:focus-visible:ring-gray-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "blue",
      class:
        "hover:border-blue-700 hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:outline-hidden active:border-blue-700 active:bg-blue-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-blue-700/40 dark:hover:bg-blue-700/40 dark:focus-visible:ring-blue-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "green",
      class:
        "hover:border-green-700 hover:bg-green-700 focus-visible:ring-4 focus-visible:ring-green-200 focus-visible:outline-hidden active:border-green-700 active:bg-green-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-green-700/40 dark:hover:bg-green-700/40 dark:focus-visible:ring-green-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "yellow",
      class:
        "hover:border-yellow-700 hover:bg-yellow-700 focus-visible:ring-4 focus-visible:ring-yellow-200 focus-visible:outline-hidden active:border-yellow-700 active:bg-yellow-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-yellow-700/40 dark:hover:bg-yellow-700/40 dark:focus-visible:ring-yellow-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "orange",
      class:
        "hover:border-orange-700 hover:bg-orange-700 focus-visible:ring-4 focus-visible:ring-orange-200 focus-visible:outline-hidden active:border-orange-700 active:bg-orange-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-orange-700/40 dark:hover:bg-orange-700/40 dark:focus-visible:ring-orange-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "red",
      class:
        "hover:border-red-700 hover:bg-red-700 focus-visible:ring-4 focus-visible:ring-red-200 focus-visible:outline-hidden active:border-red-700 active:bg-red-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-red-700/40 dark:hover:bg-red-700/40 dark:focus-visible:ring-red-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "purple",
      class:
        "hover:border-purple-700 hover:bg-purple-700 focus-visible:ring-4 focus-visible:ring-purple-200 focus-visible:outline-hidden active:border-purple-700 active:bg-purple-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-purple-700/40 dark:hover:bg-purple-700/40 dark:focus-visible:ring-purple-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "lime",
      class:
        "hover:border-lime-700 hover:bg-lime-700 focus-visible:ring-4 focus-visible:ring-lime-200 focus-visible:outline-hidden active:border-lime-700 active:bg-lime-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-lime-700/40 dark:hover:bg-lime-700/40 dark:focus-visible:ring-lime-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "teal",
      class:
        "hover:border-teal-700 hover:bg-teal-700 focus-visible:ring-4 focus-visible:ring-teal-200 focus-visible:outline-hidden active:border-teal-700 active:bg-teal-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-teal-700/40 dark:hover:bg-teal-700/40 dark:focus-visible:ring-teal-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "indigo",
      class:
        "hover:border-indigo-700 hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-hidden active:border-indigo-700 active:bg-indigo-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-indigo-700/40 dark:hover:bg-indigo-700/40 dark:focus-visible:ring-indigo-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "slate",
      class:
        "hover:border-slate-700 hover:bg-slate-700 focus-visible:ring-4 focus-visible:ring-slate-200 focus-visible:outline-hidden active:border-slate-700 active:bg-slate-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-slate-700/40 dark:hover:bg-slate-700/40 dark:focus-visible:ring-slate-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "neutral",
      class:
        "hover:border-neutral-700 hover:bg-neutral-700 focus-visible:ring-4 focus-visible:ring-neutral-200 focus-visible:outline-hidden active:border-neutral-700 active:bg-neutral-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-neutral-700/40 dark:hover:bg-neutral-700/40 dark:focus-visible:ring-neutral-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "mauve",
      class:
        "hover:border-mauve-700 hover:bg-mauve-700 focus-visible:ring-4 focus-visible:ring-mauve-200 focus-visible:outline-hidden active:border-mauve-700 active:bg-mauve-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-mauve-700/40 dark:hover:bg-mauve-700/40 dark:focus-visible:ring-mauve-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "mist",
      class:
        "hover:border-mist-700 hover:bg-mist-700 focus-visible:ring-4 focus-visible:ring-mist-200 focus-visible:outline-hidden active:border-mist-700 active:bg-mist-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-mist-700/40 dark:hover:bg-mist-700/40 dark:focus-visible:ring-mist-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "solid",
      theme: "olive",
      class:
        "hover:border-olive-700 hover:bg-olive-700 focus-visible:ring-4 focus-visible:ring-olive-200 focus-visible:outline-hidden active:border-olive-700 active:bg-olive-700 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:hover:border-olive-700/40 dark:hover:bg-olive-700/40 dark:focus-visible:ring-olive-700/40 dark:disabled:border-gray-700/40 dark:disabled:bg-gray-700/40",
    },
    {
      variant: "outline",
      theme: "default",
      class:
        "hover:border-gray-400 focus-visible:border-gray-500 focus-visible:ring-4 focus-visible:ring-gray-200 focus-visible:outline-hidden active:border-gray-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-gray-500 dark:focus-visible:ring-gray-700/40 dark:active:border-gray-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "gray",
      class:
        "hover:border-gray-400 focus-visible:border-gray-500 focus-visible:ring-4 focus-visible:ring-gray-200 focus-visible:outline-hidden active:border-gray-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-gray-500 dark:focus-visible:ring-gray-700/40 dark:active:border-gray-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "blue",
      class:
        "hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:outline-hidden active:border-blue-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-blue-500 dark:focus-visible:ring-blue-700/40 dark:active:border-blue-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "green",
      class:
        "hover:border-green-400 focus-visible:border-green-500 focus-visible:ring-4 focus-visible:ring-green-200 focus-visible:outline-hidden active:border-green-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-green-500 dark:focus-visible:ring-green-700/40 dark:active:border-green-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "yellow",
      class:
        "hover:border-yellow-400 focus-visible:border-yellow-500 focus-visible:ring-4 focus-visible:ring-yellow-200 focus-visible:outline-hidden active:border-yellow-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-yellow-500 dark:focus-visible:ring-yellow-700/40 dark:active:border-yellow-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "orange",
      class:
        "hover:border-orange-400 focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-200 focus-visible:outline-hidden active:border-orange-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-orange-500 dark:focus-visible:ring-orange-700/40 dark:active:border-orange-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "red",
      class:
        "hover:border-red-400 focus-visible:border-red-500 focus-visible:ring-4 focus-visible:ring-red-200 focus-visible:outline-hidden active:border-red-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-red-500 dark:focus-visible:ring-red-700/40 dark:active:border-red-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "purple",
      class:
        "hover:border-purple-400 focus-visible:border-purple-500 focus-visible:ring-4 focus-visible:ring-purple-200 focus-visible:outline-hidden active:border-purple-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-purple-500 dark:focus-visible:ring-purple-700/40 dark:active:border-purple-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "lime",
      class:
        "hover:border-lime-400 focus-visible:border-lime-500 focus-visible:ring-4 focus-visible:ring-lime-200 focus-visible:outline-hidden active:border-lime-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-lime-500 dark:focus-visible:ring-lime-700/40 dark:active:border-lime-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "teal",
      class:
        "hover:border-teal-400 focus-visible:border-teal-500 focus-visible:ring-4 focus-visible:ring-teal-200 focus-visible:outline-hidden active:border-teal-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-teal-500 dark:focus-visible:ring-teal-700/40 dark:active:border-teal-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "indigo",
      class:
        "hover:border-indigo-400 focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-hidden active:border-indigo-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-indigo-500 dark:focus-visible:ring-indigo-700/40 dark:active:border-indigo-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "slate",
      class:
        "hover:border-slate-400 focus-visible:border-slate-500 focus-visible:ring-4 focus-visible:ring-slate-200 focus-visible:outline-hidden active:border-slate-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-slate-500 dark:focus-visible:ring-slate-700/40 dark:active:border-slate-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "neutral",
      class:
        "hover:border-neutral-400 focus-visible:border-neutral-500 focus-visible:ring-4 focus-visible:ring-neutral-200 focus-visible:outline-hidden active:border-neutral-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-neutral-500 dark:focus-visible:ring-neutral-700/40 dark:active:border-neutral-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "mauve",
      class:
        "hover:border-mauve-400 focus-visible:border-mauve-500 focus-visible:ring-4 focus-visible:ring-mauve-200 focus-visible:outline-hidden active:border-mauve-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-mauve-500 dark:focus-visible:ring-mauve-700/40 dark:active:border-mauve-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "mist",
      class:
        "hover:border-mist-400 focus-visible:border-mist-500 focus-visible:ring-4 focus-visible:ring-mist-200 focus-visible:outline-hidden active:border-mist-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-mist-500 dark:focus-visible:ring-mist-700/40 dark:active:border-mist-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "outline",
      theme: "olive",
      class:
        "hover:border-olive-400 focus-visible:border-olive-500 focus-visible:ring-4 focus-visible:ring-olive-200 focus-visible:outline-hidden active:border-olive-700 disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 dark:hover:border-olive-500 dark:focus-visible:ring-olive-700/40 dark:active:border-olive-500 dark:disabled:border-gray-700/40 dark:disabled:bg-transparent dark:disabled:text-gray-500",
    },
    {
      variant: "glass",
      theme: "default",
      class:
        "hover:bg-gray-50/35 focus-visible:ring-4 focus-visible:ring-gray-500/50 focus-visible:outline-hidden active:bg-gray-50/45 dark:hover:bg-gray-950/35 dark:focus-visible:ring-gray-500/50 dark:active:bg-gray-950/45",
    },
    {
      variant: "glass",
      theme: "gray",
      class:
        "hover:bg-gray-50/35 focus-visible:ring-4 focus-visible:ring-gray-500/50 focus-visible:outline-hidden active:bg-gray-50/45 dark:hover:bg-gray-950/35 dark:focus-visible:ring-gray-500/50 dark:active:bg-gray-950/45",
    },
    {
      variant: "glass",
      theme: "blue",
      class:
        "hover:bg-blue-50/35 focus-visible:ring-4 focus-visible:ring-blue-500/50 focus-visible:outline-hidden active:bg-blue-50/45 dark:hover:bg-blue-950/35 dark:focus-visible:ring-blue-500/50 dark:active:bg-blue-950/45",
    },
    {
      variant: "glass",
      theme: "green",
      class:
        "hover:bg-green-50/35 focus-visible:ring-4 focus-visible:ring-green-500/50 focus-visible:outline-hidden active:bg-green-50/45 dark:hover:bg-green-950/35 dark:focus-visible:ring-green-500/50 dark:active:bg-green-950/45",
    },
    {
      variant: "glass",
      theme: "yellow",
      class:
        "hover:bg-yellow-50/35 focus-visible:ring-4 focus-visible:ring-yellow-500/50 focus-visible:outline-hidden active:bg-yellow-50/45 dark:hover:bg-yellow-950/35 dark:focus-visible:ring-yellow-500/50 dark:active:bg-yellow-950/45",
    },
    {
      variant: "glass",
      theme: "orange",
      class:
        "hover:bg-orange-50/35 focus-visible:ring-4 focus-visible:ring-orange-500/50 focus-visible:outline-hidden active:bg-orange-50/45 dark:hover:bg-orange-950/35 dark:focus-visible:ring-orange-500/50 dark:active:bg-orange-950/45",
    },
    {
      variant: "glass",
      theme: "red",
      class:
        "hover:bg-red-50/35 focus-visible:ring-4 focus-visible:ring-red-500/50 focus-visible:outline-hidden active:bg-red-50/45 dark:hover:bg-red-950/35 dark:focus-visible:ring-red-500/50 dark:active:bg-red-950/45",
    },
    {
      variant: "glass",
      theme: "purple",
      class:
        "hover:bg-purple-50/35 focus-visible:ring-4 focus-visible:ring-purple-500/50 focus-visible:outline-hidden active:bg-purple-50/45 dark:hover:bg-purple-950/35 dark:focus-visible:ring-purple-500/50 dark:active:bg-purple-950/45",
    },
    {
      variant: "glass",
      theme: "lime",
      class:
        "hover:bg-lime-50/35 focus-visible:ring-4 focus-visible:ring-lime-500/50 focus-visible:outline-hidden active:bg-lime-50/45 dark:hover:bg-lime-950/35 dark:focus-visible:ring-lime-500/50 dark:active:bg-lime-950/45",
    },
    {
      variant: "glass",
      theme: "teal",
      class:
        "hover:bg-teal-50/35 focus-visible:ring-4 focus-visible:ring-teal-500/50 focus-visible:outline-hidden active:bg-teal-50/45 dark:hover:bg-teal-950/35 dark:focus-visible:ring-teal-500/50 dark:active:bg-teal-950/45",
    },
    {
      variant: "glass",
      theme: "indigo",
      class:
        "hover:bg-indigo-50/35 focus-visible:ring-4 focus-visible:ring-indigo-500/50 focus-visible:outline-hidden active:bg-indigo-50/45 dark:hover:bg-indigo-950/35 dark:focus-visible:ring-indigo-500/50 dark:active:bg-indigo-950/45",
    },
    {
      variant: "glass",
      theme: "slate",
      class:
        "hover:bg-slate-50/35 focus-visible:ring-4 focus-visible:ring-slate-500/50 focus-visible:outline-hidden active:bg-slate-50/45 dark:hover:bg-slate-950/35 dark:focus-visible:ring-slate-500/50 dark:active:bg-slate-950/45",
    },
    {
      variant: "glass",
      theme: "neutral",
      class:
        "hover:bg-neutral-50/35 focus-visible:ring-4 focus-visible:ring-neutral-500/50 focus-visible:outline-hidden active:bg-neutral-50/45 dark:hover:bg-neutral-950/35 dark:focus-visible:ring-neutral-500/50 dark:active:bg-neutral-950/45",
    },
    {
      variant: "glass",
      theme: "mauve",
      class:
        "hover:bg-mauve-50/35 focus-visible:ring-4 focus-visible:ring-mauve-500/50 focus-visible:outline-hidden active:bg-mauve-50/45 dark:hover:bg-mauve-950/35 dark:focus-visible:ring-mauve-500/50 dark:active:bg-mauve-950/45",
    },
    {
      variant: "glass",
      theme: "mist",
      class:
        "hover:bg-mist-50/35 focus-visible:ring-4 focus-visible:ring-mist-500/50 focus-visible:outline-hidden active:bg-mist-50/45 dark:hover:bg-mist-950/35 dark:focus-visible:ring-mist-500/50 dark:active:bg-mist-950/45",
    },
    {
      variant: "glass",
      theme: "olive",
      class:
        "hover:bg-olive-50/35 focus-visible:ring-4 focus-visible:ring-olive-500/50 focus-visible:outline-hidden active:bg-olive-50/45 dark:hover:bg-olive-950/35 dark:focus-visible:ring-olive-500/50 dark:active:bg-olive-950/45",
    },
  ],
  defaultVariants: {
    variant: "outline",
    theme: "default",
  },
});

export { Card, CardAction, CardBody, CardButton, CardDescription, CardFooter, CardHeader, CardLink, CardTitle };
