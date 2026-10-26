import { Link } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "./utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export function H1({ className, as = "h1", ...props }: HeadingProps) {
  const Component = as;

  return <Component className={cn(headingVariants({ type: "h1", className }))} {...props} />;
}

export function H2({ className, as = "h2", ...props }: HeadingProps) {
  const Component = as;

  return <Component className={cn(headingVariants({ type: "h2", className }))} {...props} />;
}

type HeadingLinkProps = React.ComponentProps<typeof Link>;

// H1 and H2 as a TanStack Router Link (like ButtonLink), e.g. a card title that opens its page. Same styling, rendered
// as an <a>, so put it inside an h1/h2 if the page needs the heading in its outline.
export const H1Link = forwardRef<React.ComponentRef<typeof Link>, HeadingLinkProps>(({ className, ...props }, ref) => {
  return <Link ref={ref} className={cn(headingVariants({ type: "h1" }), className)} {...props} />;
});
H1Link.displayName = "H1Link";

export const H2Link = forwardRef<React.ComponentRef<typeof Link>, HeadingLinkProps>(({ className, ...props }, ref) => {
  return <Link ref={ref} className={cn(headingVariants({ type: "h2" }), className)} {...props} />;
});
H2Link.displayName = "H2Link";

export function H3({ className, as = "h3", ...props }: HeadingProps) {
  const Component = as;

  return <Component className={cn(headingVariants({ type: "h3", className }))} {...props} />;
}

export function H4({ className, as = "h4", ...props }: HeadingProps) {
  const Component = as;

  return <Component className={cn(headingVariants({ type: "h4" }), className)} {...props} />;
}

export function H5({ className, as = "h5", ...props }: HeadingProps) {
  const Component = as;

  return <Component className={cn(headingVariants({ type: "h5" }), className)} {...props} />;
}

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {}

// Page Description
export function H1Description({ className, ...props }: TextProps) {
  return <p className={cn("text-base tracking-wider text-gray-800 dark:text-gray-300", className)} {...props} />;
}

// Section Description
export function H2Description({ className, ...props }: TextProps) {
  return <p className={cn("text-md text-gray-700 dark:text-gray-300", className)} {...props} />;
}

export function P({ className, size, weight, theme, ...props }: TextProps) {
  return <p className={cn(textVariants({ size, weight, theme, className }))} {...props} />;
}

export function P1({ className, ...props }: TextProps) {
  return <P theme="primary" className={cn(className)} {...props} />;
}

export function P2({ className, ...props }: TextProps) {
  return <P theme="secondary" className={cn(className)} {...props} />;
}

export function P3({ className, ...props }: TextProps) {
  return <P theme="tertiary" className={cn(className)} {...props} />;
}

export function PS({ className, ...props }: TextProps) {
  return (
    <strong>
      <P theme="primary" weight={600} className={cn(className)} {...props} />
    </strong>
  );
}

export function PL({ className, ...props }: TextProps) {
  return <P theme="primary" className={cn(className)} {...props} />;
}

export const headingTypeOptions = ["h1", "h2", "h3", "h4", "h5"] as const;
export type HeadingTypeOption = (typeof headingTypeOptions)[number];

const headingTypeClasses = {
  h1: "text-2xl md:text-4xl font-semibold text-gray-900 dark:text-gray-50",
  h2: "text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-50",
  h3: "text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-50",
  h4: "text-base md:text-lg font-semibold text-gray-900 dark:text-gray-50",
  h5: "md:text-base font-bold text-gray-900 dark:text-gray-50",
} satisfies Record<HeadingTypeOption, string>;

export const headingVariants = cva("", {
  variants: {
    type: headingTypeClasses,
  },
  defaultVariants: {
    type: "h1",
  },
});

export const textSizeOptions = ["sm", "md", "lg"] as const;
export type TextSizeOption = (typeof textSizeOptions)[number];

export const textWeightOptions = [400, 500, 600] as const;
export type TextWeightOption = (typeof textWeightOptions)[number];

export const textThemeOptions = ["primary", "secondary", "tertiary"] as const;
export type TextThemeOption = (typeof textThemeOptions)[number];

const textSizeClasses = {
  sm: "text-sm tracking-normal",
  md: "text-base tracking-normal",
  lg: "text-lg tracking-normal",
} satisfies Record<TextSizeOption, string>;

const textWeightClasses = {
  400: "font-normal",
  500: "font-semibold",
  600: "font-bold",
} satisfies Record<TextWeightOption, string>;

const textThemeClasses = {
  primary: "text-gray-900 dark:text-gray-50",
  secondary: "text-gray-800 dark:text-gray-100",
  tertiary: "text-gray-700 dark:text-gray-200",
} satisfies Record<TextThemeOption, string>;

export const textVariants = cva("p-0", {
  variants: {
    size: textSizeClasses,
    weight: textWeightClasses,
    theme: textThemeClasses,
  },
  defaultVariants: {
    size: "md",
    weight: 400,
    theme: "primary",
  },
});
