import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import { Link } from '@tanstack/react-router';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ReactNode } from 'react';
import type { ButtonTheme } from './button';
import { cn } from './utils';

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

const Avatar = forwardRef<React.ComponentRef<typeof AvatarPrimitive.Root>, AvatarPrimitive.Root.Props & VariantProps<typeof avatarVariants> & { size?: AvatarSize }>(
  function Avatar({ className, variant, theme, size = 'md', ...props }, ref) {
    return <AvatarPrimitive.Root ref={ref} data-slot="avatar" data-size={size} className={cn(avatarVariants({ variant, theme, size }), className)} {...props} />;
  }
);

const AvatarButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof avatarVariants> & {
      size?: AvatarSize;
      children?: ReactNode;
    }
>(function AvatarButton({ className, variant, theme, size = 'md', children, type = 'button', ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex cursor-pointer rounded-full border-0 bg-transparent p-0',
        'focus-visible:ring-4 focus-visible:ring-gray-400/50 focus-visible:outline-hidden dark:focus-visible:ring-gray-500/50',
        'disabled:cursor-default disabled:opacity-50',
        'transition-opacity hover:opacity-90',
        className
      )}
      {...props}>
      <AvatarPrimitive.Root data-slot="avatar" data-size={size} className={avatarVariants({ variant, theme, size })}>
        {children}
      </AvatarPrimitive.Root>
    </button>
  );
});
AvatarButton.displayName = 'AvatarButton';

const AvatarLink = forwardRef<
  React.ComponentRef<typeof Link>,
  React.ComponentProps<typeof Link> &
    VariantProps<typeof avatarVariants> & {
      size?: AvatarSize;
      children?: ReactNode;
    }
>(function AvatarLink({ className, variant, theme, size = 'md', children, ...props }, ref) {
  return (
    <Link
      ref={ref}
      className={cn(
        'inline-flex cursor-pointer rounded-full',
        'focus-visible:ring-4 focus-visible:ring-gray-400/50 focus-visible:outline-hidden dark:focus-visible:ring-gray-500/50',
        'transition-opacity hover:opacity-90',
        className
      )}
      {...props}>
      <AvatarPrimitive.Root data-slot="avatar" data-size={size} className={avatarVariants({ variant, theme, size })}>
        {children}
      </AvatarPrimitive.Root>
    </Link>
  );
});
AvatarLink.displayName = 'AvatarLink';

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn('aspect-square size-full rounded-full object-cover', className)} {...props} />;
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('flex size-full items-center justify-center rounded-full bg-transparent text-inherit', className)}
      {...props}
    />
  );
}

export function getAvatarInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export { buttonThemeOptions as avatarThemeOptions, type ButtonTheme as AvatarTheme } from './button';

export const avatarVariantOptions = ['solid', 'outline'] as const;
export type AvatarVariantOption = (typeof avatarVariantOptions)[number];

export const avatarSizeOptions = ['md', 'lg'] as const;
export type AvatarSize = (typeof avatarSizeOptions)[number];

const avatarSizeClasses = {
  md: 'size-10 [&_[data-slot=avatar-fallback]]:text-sm',
  lg: 'size-16 [&_[data-slot=avatar-fallback]]:text-base'
} satisfies Record<AvatarSize, string>;

const avatarVariantClasses = {
  solid: 'border',
  outline: 'border'
} satisfies Record<AvatarVariantOption, string>;

const avatarThemeClasses = {
  gray: '',
  blue: '',
  green: '',
  yellow: '',
  orange: '',
  red: '',
  purple: ''
} satisfies Record<ButtonTheme, string>;

export const avatarVariants = cva('group/avatar relative flex shrink-0 overflow-hidden rounded-full font-medium select-none', {
  variants: {
    size: avatarSizeClasses,
    variant: avatarVariantClasses,
    theme: avatarThemeClasses
  },
  compoundVariants: [
    // solid
    {
      variant: 'solid',
      theme: 'gray',
      class: 'border-gray-500 bg-gray-500 text-white [&_[data-slot=avatar-image]]:mix-blend-normal'
    },
    {
      variant: 'solid',
      theme: 'blue',
      class: 'border-blue-500 bg-blue-500 text-white dark:border-blue-600/80 dark:bg-blue-500/80'
    },
    {
      variant: 'solid',
      theme: 'green',
      class: 'border-green-500 bg-green-500 text-white dark:border-green-600/80 dark:bg-green-500/80'
    },
    {
      variant: 'solid',
      theme: 'yellow',
      class: 'border-yellow-500 bg-yellow-500 text-white dark:border-yellow-600/80 dark:bg-yellow-500/80'
    },
    {
      variant: 'solid',
      theme: 'orange',
      class: 'border-orange-500 bg-orange-500 text-white dark:border-orange-600/80 dark:bg-orange-500/80'
    },
    {
      variant: 'solid',
      theme: 'red',
      class: 'border-red-500 bg-red-500 text-white dark:border-red-600/80 dark:bg-red-500/80'
    },
    {
      variant: 'solid',
      theme: 'purple',
      class: 'border-purple-500 bg-purple-500 text-white dark:border-purple-600/80 dark:bg-purple-500/80'
    },
    // outline
    {
      variant: 'outline',
      theme: 'gray',
      class: 'border-gray-200 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-200'
    },
    {
      variant: 'outline',
      theme: 'blue',
      class: 'border-blue-200 bg-transparent text-blue-700 dark:border-blue-600 dark:text-blue-300'
    },
    {
      variant: 'outline',
      theme: 'green',
      class: 'border-green-200 bg-transparent text-green-700 dark:border-green-600 dark:text-green-300'
    },
    {
      variant: 'outline',
      theme: 'yellow',
      class: 'border-yellow-200 bg-transparent text-yellow-700 dark:border-yellow-600 dark:text-yellow-300'
    },
    {
      variant: 'outline',
      theme: 'orange',
      class: 'border-orange-200 bg-transparent text-orange-700 dark:border-orange-600 dark:text-orange-300'
    },
    {
      variant: 'outline',
      theme: 'red',
      class: 'border-red-200 bg-transparent text-red-700 dark:border-red-600 dark:text-red-300'
    },
    {
      variant: 'outline',
      theme: 'purple',
      class: 'border-purple-200 bg-transparent text-purple-700 dark:border-purple-600 dark:text-purple-300'
    }
  ],
  defaultVariants: {
    size: 'md',
    variant: 'solid',
    theme: 'gray'
  }
});

export { Avatar, AvatarButton, AvatarFallback, AvatarImage, AvatarLink };
