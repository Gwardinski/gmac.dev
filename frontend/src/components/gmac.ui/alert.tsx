import { IconX } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonTheme } from "./button";
import { IconButton } from "./icon-button";
import { H5, P3 } from "./typography";
import { cn } from "./utils";

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

export function Alert({
  className,
  variant,
  theme,
  onDismiss,
  dismissAriaLabel = "Close",
  width,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  onDismiss?: () => void;
  dismissAriaLabel?: string;
} & VariantProps<typeof alertVariants>) {
  const resolvedTheme = (theme ?? "default") as ButtonTheme;
  return (
    <div role="alert" className={cn("relative", alertVariants({ variant, theme: resolvedTheme, width }), className)} {...props}>
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
  return <div className={cn("alert-header flex flex-row gap-2", className)} {...props} />;
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <H5 as="p" className={cn("alert-title pr-12", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <P3 className={cn("alert-description text-inherit", className)} {...props} />;
}

export function AlertActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-2 ml-auto flex flex-row flex-wrap gap-2", className)} {...props} />;
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export const alertVariantOptions = ["solid", "secondary"] as const;
export type AlertVariantOption = (typeof alertVariantOptions)[number];

export { buttonThemeOptions as alertThemeOptions, type ButtonTheme as AlertTheme } from "./button";

export const alertWidthOptions = ["full", "fit"] as const;
export type AlertWidthOption = (typeof alertWidthOptions)[number];

const alertVariantClasses = {
  solid: "border",
  secondary: "border",
} satisfies Record<AlertVariantOption, string>;

const alertThemeClasses = {
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

const alertWidthClasses = {
  full: "w-full",
  fit: "w-fit",
} satisfies Record<AlertWidthOption, string>;

export const alertVariants = cva(
  [
    "relative flex w-fit flex-col items-start gap-1 rounded-lg px-4 pt-3.5 pb-4",
    "[&>button]:mt-2 [&>button]:ml-auto",
    "[&_svg]:size-5 [&>svg]:absolute [&>svg]:top-[18px] [&>svg]:left-3",
    "[&>.alert-header:has(svg)+.alert-description]:pl-8",
    "[&>.alert-header>svg]:mt-0.75 [&>.alert-header>svg]:min-w-fit [&>.alert-header>svg]:pr-1",
  ].join(" "),
  {
    variants: {
      variant: alertVariantClasses,
      theme: alertThemeClasses,
      width: alertWidthClasses,
    },
    compoundVariants: [
      // solid
      {
        variant: "solid",
        theme: "default",
        class: "border-gray-500 bg-gray-500 text-white dark:border-gray-600 dark:bg-gray-600 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "gray",
        class: "border-gray-500 bg-gray-500 text-white dark:border-gray-600/80 dark:bg-gray-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "blue",
        class: "border-blue-500 bg-blue-500 text-white dark:border-blue-600/80 dark:bg-blue-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "green",
        class:
          "border-green-500 bg-green-500 text-gray-900 dark:border-green-600/80 dark:bg-green-500/80 [&_.alert-description]:text-gray-900 [&_.alert-title]:text-gray-900 [&>.alert-header>svg]:text-gray-900",
      },
      {
        variant: "solid",
        theme: "yellow",
        class:
          "border-yellow-500 bg-yellow-500 text-gray-900 dark:border-yellow-600/80 dark:bg-yellow-500/80 [&_.alert-description]:text-gray-900 [&_.alert-title]:text-gray-900 [&>.alert-header>svg]:text-gray-900",
      },
      {
        variant: "solid",
        theme: "orange",
        class: "border-orange-500 bg-orange-500 text-white dark:border-orange-600/80 dark:bg-orange-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "red",
        class: "border-red-500 bg-red-500 text-white dark:border-red-600/80 dark:bg-red-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "purple",
        class: "border-purple-500 bg-purple-500 text-white dark:border-purple-600/80 dark:bg-purple-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "lime",
        class:
          "border-lime-500 bg-lime-500 text-gray-900 dark:border-lime-600/80 dark:bg-lime-500/80 [&_.alert-description]:text-gray-900 [&_.alert-title]:text-gray-900 [&>.alert-header>svg]:text-gray-900",
      },
      {
        variant: "solid",
        theme: "teal",
        class:
          "border-teal-500 bg-teal-500 text-gray-900 dark:border-teal-600/80 dark:bg-teal-500/80 [&_.alert-description]:text-gray-900 [&_.alert-title]:text-gray-900 [&>.alert-header>svg]:text-gray-900",
      },
      {
        variant: "solid",
        theme: "indigo",
        class: "border-indigo-500 bg-indigo-500 text-white dark:border-indigo-600/80 dark:bg-indigo-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "slate",
        class: "border-slate-500 bg-slate-500 text-white dark:border-slate-600/80 dark:bg-slate-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "neutral",
        class: "border-neutral-500 bg-neutral-500 text-white dark:border-neutral-600/80 dark:bg-neutral-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "mauve",
        class: "border-mauve-500 bg-mauve-500 text-white dark:border-mauve-600/80 dark:bg-mauve-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "mist",
        class: "border-mist-500 bg-mist-500 text-white dark:border-mist-600/80 dark:bg-mist-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      {
        variant: "solid",
        theme: "olive",
        class: "border-olive-500 bg-olive-500 text-white dark:border-olive-600/80 dark:bg-olive-500/80 [&_.alert-title]:text-white [&>.alert-header>svg]:text-white",
      },
      // secondary — solid at /40 with themed text
      {
        variant: "secondary",
        theme: "default",
        class:
          "border-gray-500/40 bg-gray-500/40 text-gray-900 dark:border-gray-600/40 dark:bg-gray-600/40 dark:text-gray-50 [&_.alert-title]:text-gray-900 dark:[&_.alert-title]:text-gray-50 [&>.alert-header>svg]:text-gray-900 dark:[&>.alert-header>svg]:text-gray-50",
      },
      {
        variant: "secondary",
        theme: "gray",
        class:
          "border-gray-500/40 bg-gray-500/40 text-gray-700 dark:border-gray-600/40 dark:bg-gray-600/40 dark:text-gray-50 [&_.alert-title]:text-gray-700 dark:[&_.alert-title]:text-gray-50 [&>.alert-header>svg]:text-gray-700 dark:[&>.alert-header>svg]:text-gray-50",
      },
      {
        variant: "secondary",
        theme: "blue",
        class:
          "border-blue-500/40 bg-blue-500/40 text-blue-700 dark:border-blue-600/40 dark:bg-blue-600/40 dark:text-blue-50 [&_.alert-title]:text-blue-700 dark:[&_.alert-title]:text-blue-50 [&>.alert-header>svg]:text-blue-700 dark:[&>.alert-header>svg]:text-blue-50",
      },
      {
        variant: "secondary",
        theme: "green",
        class:
          "border-green-500/40 bg-green-500/40 text-green-700 dark:border-green-600/40 dark:bg-green-600/40 dark:text-green-50 [&_.alert-title]:text-green-700 dark:[&_.alert-title]:text-green-50 [&>.alert-header>svg]:text-green-700 dark:[&>.alert-header>svg]:text-green-50",
      },
      {
        variant: "secondary",
        theme: "yellow",
        class:
          "border-yellow-500/40 bg-yellow-500/40 text-yellow-700 dark:border-yellow-600/40 dark:bg-yellow-600/40 dark:text-yellow-50 [&_.alert-title]:text-yellow-700 dark:[&_.alert-title]:text-yellow-50 [&>.alert-header>svg]:text-yellow-700 dark:[&>.alert-header>svg]:text-yellow-50",
      },
      {
        variant: "secondary",
        theme: "orange",
        class:
          "border-orange-500/40 bg-orange-500/40 text-orange-700 dark:border-orange-600/40 dark:bg-orange-600/40 dark:text-orange-50 [&_.alert-title]:text-orange-700 dark:[&_.alert-title]:text-orange-50 [&>.alert-header>svg]:text-orange-700 dark:[&>.alert-header>svg]:text-orange-50",
      },
      {
        variant: "secondary",
        theme: "red",
        class:
          "border-red-500/40 bg-red-500/40 text-red-700 dark:border-red-600/40 dark:bg-red-600/40 dark:text-red-50 [&_.alert-title]:text-red-700 dark:[&_.alert-title]:text-red-50 [&>.alert-header>svg]:text-red-700 dark:[&>.alert-header>svg]:text-red-50",
      },
      {
        variant: "secondary",
        theme: "purple",
        class:
          "border-purple-500/40 bg-purple-500/40 text-purple-700 dark:border-purple-600/40 dark:bg-purple-600/40 dark:text-purple-50 [&_.alert-title]:text-purple-700 dark:[&_.alert-title]:text-purple-50 [&>.alert-header>svg]:text-purple-700 dark:[&>.alert-header>svg]:text-purple-50",
      },
      {
        variant: "secondary",
        theme: "lime",
        class:
          "border-lime-500/40 bg-lime-500/40 text-lime-700 dark:border-lime-600/40 dark:bg-lime-600/40 dark:text-lime-50 [&_.alert-title]:text-lime-700 dark:[&_.alert-title]:text-lime-50 [&>.alert-header>svg]:text-lime-700 dark:[&>.alert-header>svg]:text-lime-50",
      },
      {
        variant: "secondary",
        theme: "teal",
        class:
          "border-teal-500/40 bg-teal-500/40 text-teal-700 dark:border-teal-600/40 dark:bg-teal-600/40 dark:text-teal-50 [&_.alert-title]:text-teal-700 dark:[&_.alert-title]:text-teal-50 [&>.alert-header>svg]:text-teal-700 dark:[&>.alert-header>svg]:text-teal-50",
      },
      {
        variant: "secondary",
        theme: "indigo",
        class:
          "border-indigo-500/40 bg-indigo-500/40 text-indigo-700 dark:border-indigo-600/40 dark:bg-indigo-600/40 dark:text-indigo-50 [&_.alert-title]:text-indigo-700 dark:[&_.alert-title]:text-indigo-50 [&>.alert-header>svg]:text-indigo-700 dark:[&>.alert-header>svg]:text-indigo-50",
      },
      {
        variant: "secondary",
        theme: "slate",
        class:
          "border-slate-500/40 bg-slate-500/40 text-slate-700 dark:border-slate-600/40 dark:bg-slate-600/40 dark:text-slate-50 [&_.alert-title]:text-slate-700 dark:[&_.alert-title]:text-slate-50 [&>.alert-header>svg]:text-slate-700 dark:[&>.alert-header>svg]:text-slate-50",
      },
      {
        variant: "secondary",
        theme: "neutral",
        class:
          "border-neutral-500/40 bg-neutral-500/40 text-neutral-700 dark:border-neutral-600/40 dark:bg-neutral-600/40 dark:text-neutral-50 [&_.alert-title]:text-neutral-700 dark:[&_.alert-title]:text-neutral-50 [&>.alert-header>svg]:text-neutral-700 dark:[&>.alert-header>svg]:text-neutral-50",
      },
      {
        variant: "secondary",
        theme: "mauve",
        class:
          "border-mauve-500/40 bg-mauve-500/40 text-mauve-700 dark:border-mauve-600/40 dark:bg-mauve-600/40 dark:text-mauve-50 [&_.alert-title]:text-mauve-700 dark:[&_.alert-title]:text-mauve-50 [&>.alert-header>svg]:text-mauve-700 dark:[&>.alert-header>svg]:text-mauve-50",
      },
      {
        variant: "secondary",
        theme: "mist",
        class:
          "border-mist-500/40 bg-mist-500/40 text-mist-700 dark:border-mist-600/40 dark:bg-mist-600/40 dark:text-mist-50 [&_.alert-title]:text-mist-700 dark:[&_.alert-title]:text-mist-50 [&>.alert-header>svg]:text-mist-700 dark:[&>.alert-header>svg]:text-mist-50",
      },
      {
        variant: "secondary",
        theme: "olive",
        class:
          "border-olive-500/40 bg-olive-500/40 text-olive-700 dark:border-olive-600/40 dark:bg-olive-600/40 dark:text-olive-50 [&_.alert-title]:text-olive-700 dark:[&_.alert-title]:text-olive-50 [&>.alert-header>svg]:text-olive-700 dark:[&>.alert-header>svg]:text-olive-50",
      },
    ],
    defaultVariants: {
      variant: "secondary",
      theme: "default",
      width: "fit",
    },
  },
);
