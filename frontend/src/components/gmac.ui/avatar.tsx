import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ReactNode } from "react";
import type { ButtonTheme } from "./button";
import { cn } from "./utils";

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

const Avatar = forwardRef<React.ComponentRef<typeof AvatarPrimitive.Root>, AvatarPrimitive.Root.Props & VariantProps<typeof avatarVariants> & { size?: AvatarSize }>(
  function Avatar({ className, variant, theme, size = "md", ...props }, ref) {
    return <AvatarPrimitive.Root ref={ref} data-slot="avatar" data-size={size} className={cn(avatarVariants({ variant, theme, size }), className)} {...props} />;
  },
);

const AvatarButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof avatarVariants> & {
      size?: AvatarSize;
      children?: ReactNode;
    }
>(function AvatarButton({ className, variant, theme, size = "md", children, type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex cursor-pointer rounded-full border-0 bg-transparent p-0",
        "focus-visible:ring-4 focus-visible:outline-hidden",
        avatarShellFocusRingClasses(variant, theme),
        "disabled:cursor-default disabled:opacity-50",
        "transition-opacity hover:opacity-90",
        className,
      )}
      {...props}
    >
      <AvatarPrimitive.Root data-slot="avatar" data-size={size} className={avatarVariants({ variant, theme, size })}>
        {children}
      </AvatarPrimitive.Root>
    </button>
  );
});
AvatarButton.displayName = "AvatarButton";

const AvatarLink = forwardRef<
  React.ComponentRef<typeof Link>,
  React.ComponentProps<typeof Link> &
    VariantProps<typeof avatarVariants> & {
      size?: AvatarSize;
      children?: ReactNode;
    }
>(function AvatarLink({ className, variant, theme, size = "md", children, ...props }, ref) {
  return (
    <Link
      ref={ref}
      className={cn(
        "inline-flex cursor-pointer rounded-full",
        "focus-visible:ring-4 focus-visible:outline-hidden",
        avatarShellFocusRingClasses(variant, theme),
        "transition-opacity hover:opacity-90",
        className,
      )}
      {...props}
    >
      <AvatarPrimitive.Root data-slot="avatar" data-size={size} className={avatarVariants({ variant, theme, size })}>
        {children}
      </AvatarPrimitive.Root>
    </Link>
  );
});
AvatarLink.displayName = "AvatarLink";

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full rounded-full object-cover", className)} {...props} />;
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("flex size-full items-center justify-center rounded-full bg-transparent text-inherit", className)}
      {...props}
    />
  );
}

export function getAvatarInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export { buttonThemeOptions as avatarThemeOptions, type ButtonTheme as AvatarTheme } from "./button";

export const avatarVariantOptions = ["solid", "outline"] as const;
export type AvatarVariantOption = (typeof avatarVariantOptions)[number];

export const avatarSizeOptions = ["md", "lg"] as const;
export type AvatarSize = (typeof avatarSizeOptions)[number];

const avatarSizeClasses = {
  md: "size-10 [&_[data-slot=avatar-fallback]]:text-sm",
  lg: "size-16 [&_[data-slot=avatar-fallback]]:text-base",
} satisfies Record<AvatarSize, string>;

const avatarVariantClasses = {
  solid: "border ",
  outline: " border bg-transparent dark:bg-transparent ",
} satisfies Record<AvatarVariantOption, string>;

const avatarThemeClasses = {
  gray: "",
  blue: "",
  green: "",
  yellow: "",
  orange: "",
  red: "",
  purple: "",
} satisfies Record<ButtonTheme, string>;

const avatarShellFocusRingSolid = {
  gray: "focus-visible:ring-gray-500/50 dark:focus-visible:ring-gray-600/50",
  blue: "focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-600/50",
  green: "focus-visible:ring-green-500/50 dark:focus-visible:ring-green-600/50",
  yellow: "focus-visible:ring-yellow-500/50 dark:focus-visible:ring-yellow-600/50",
  orange: "focus-visible:ring-orange-500/50 dark:focus-visible:ring-orange-600/50",
  red: "focus-visible:ring-red-500/50 dark:focus-visible:ring-red-600/50",
  purple: "focus-visible:ring-purple-500/50 dark:focus-visible:ring-purple-600/50",
} satisfies Record<ButtonTheme, string>;

const avatarShellFocusRingOutline = {
  gray: "focus-visible:ring-gray-800/50 dark:focus-visible:ring-gray-100/50",
  blue: "focus-visible:ring-blue-600/50 dark:focus-visible:ring-blue-400/50",
  green: "focus-visible:ring-green-600/50 dark:focus-visible:ring-green-400/50",
  yellow: "focus-visible:ring-yellow-600/50 dark:focus-visible:ring-yellow-400/50",
  orange: "focus-visible:ring-orange-600/50 dark:focus-visible:ring-orange-400/50",
  red: "focus-visible:ring-red-600/50 dark:focus-visible:ring-red-400/50",
  purple: "focus-visible:ring-purple-600/50 dark:focus-visible:ring-purple-400/50",
} satisfies Record<ButtonTheme, string>;

function avatarShellFocusRingClasses(variant: "solid" | "outline" | null | undefined, theme: ButtonTheme | null | undefined) {
  const t = theme ?? "gray";
  return variant === "outline" ? avatarShellFocusRingOutline[t] : avatarShellFocusRingSolid[t];
}

export const avatarVariants = cva(
  "group/avatar relative flex shrink-0 overflow-hidden rounded-full font-medium transition-colors select-none focus-visible:ring-4 focus-visible:outline-hidden",
  {
    variants: {
      size: avatarSizeClasses,
      variant: avatarVariantClasses,
      theme: avatarThemeClasses,
    },
    compoundVariants: [
      // solid
      {
        variant: "solid",
        theme: "blue",
        class: `border-blue-500 bg-blue-500 text-white hover:border-blue-600 hover:bg-blue-600 focus-visible:ring-blue-500/50 active:border-blue-700 active:bg-blue-700 dark:border-blue-600 dark:bg-blue-600 dark:hover:border-blue-700 dark:hover:bg-blue-700 dark:focus-visible:ring-blue-600/50 dark:active:border-blue-800 dark:active:bg-blue-800 [&_[data-slot=avatar-image]]:mix-blend-normal`,
      },
      {
        variant: "solid",
        theme: "green",
        class: `border-green-500 bg-green-500 text-gray-950 hover:border-green-600 hover:bg-green-600 focus-visible:ring-green-500/50 active:border-green-700 active:bg-green-700 dark:border-green-600 dark:bg-green-600 dark:text-gray-950 dark:hover:border-green-700 dark:hover:bg-green-700 dark:focus-visible:ring-green-600/50 dark:active:border-green-800 dark:active:bg-green-800 [&_[data-slot=avatar-image]]:mix-blend-normal`,
      },
      {
        variant: "solid",
        theme: "yellow",
        class: `border-yellow-500 bg-yellow-500 text-gray-950 hover:border-yellow-600 hover:bg-yellow-600 focus-visible:ring-yellow-500/50 active:border-yellow-700 active:bg-yellow-700 dark:border-yellow-600 dark:bg-yellow-600 dark:text-gray-950 dark:hover:border-yellow-700 dark:hover:bg-yellow-700 dark:focus-visible:ring-yellow-600/50 dark:active:border-yellow-800 dark:active:bg-yellow-800 [&_[data-slot=avatar-image]]:mix-blend-normal`,
      },
      {
        variant: "solid",
        theme: "orange",
        class: `border-orange-500 bg-orange-500 text-white hover:border-orange-600 hover:bg-orange-600 focus-visible:ring-orange-500/50 active:border-orange-700 active:bg-orange-700 dark:border-orange-600 dark:bg-orange-600 dark:hover:border-orange-700 dark:hover:bg-orange-700 dark:focus-visible:ring-orange-600/50 dark:active:border-orange-800 dark:active:bg-orange-800 [&_[data-slot=avatar-image]]:mix-blend-normal`,
      },
      {
        variant: "solid",
        theme: "red",
        class: `border-red-500 bg-red-500 text-white hover:border-red-600 hover:bg-red-600 focus-visible:ring-red-500/50 active:border-red-700 active:bg-red-700 dark:border-red-600 dark:bg-red-600 dark:hover:border-red-700 dark:hover:bg-red-700 dark:focus-visible:ring-red-600/50 dark:active:border-red-800 dark:active:bg-red-800 [&_[data-slot=avatar-image]]:mix-blend-normal`,
      },
      {
        variant: "solid",
        theme: "purple",
        class: `border-purple-500 bg-purple-500 text-white hover:border-purple-600 hover:bg-purple-600 focus-visible:ring-purple-500/50 active:border-purple-700 active:bg-purple-700 dark:border-purple-600 dark:bg-purple-600 dark:hover:border-purple-700 dark:hover:bg-purple-700 dark:focus-visible:ring-purple-600/50 dark:active:border-purple-800 dark:active:bg-purple-800 [&_[data-slot=avatar-image]]:mix-blend-normal`,
      },
      {
        variant: "solid",
        theme: "gray",
        class: `border-gray-800 bg-gray-800 text-white hover:border-gray-900 hover:bg-gray-900 focus-visible:ring-gray-500/50 active:border-gray-950 active:bg-gray-950 dark:border-gray-300 dark:bg-gray-300 dark:text-gray-900 dark:hover:border-gray-400 dark:hover:bg-gray-400 dark:focus-visible:ring-gray-600/50 dark:active:border-gray-500 dark:active:bg-gray-500 [&_[data-slot=avatar-image]]:mix-blend-normal`,
      },
      // outline — matches Button outline
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
    ],
    defaultVariants: {
      size: "md",
      variant: "solid",
      theme: "gray",
    },
  },
);

export { Avatar, AvatarButton, AvatarFallback, AvatarImage, AvatarLink };
