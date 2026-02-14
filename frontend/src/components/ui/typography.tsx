import { cn } from '@/lib/utils';

export interface TextProps extends React.HTMLAttributes<HTMLHeadingElement> {}

// Page Heading
export function H1({ className, ...props }: TextProps) {
  return (
    <h1
      className={cn(
        'scroll-m-20 bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text pb-1 font-mono text-4xl font-extrabold tracking-wider text-transparent lg:text-5xl dark:from-zinc-100 dark:to-zinc-400',
        className
      )}
      {...props}
    />
  );
}

// Page Description
export function H1Description({ className, ...props }: TextProps) {
  return <p className={cn('text-base tracking-wider text-zinc-800 dark:text-zinc-300', className)} {...props} />;
}

// Section Heading
export function H2({ className, ...props }: TextProps) {
  return (
    <h2
      className={cn(
        'scroll-m-20 bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text font-mono text-3xl font-semibold text-transparent first:mt-0 dark:from-zinc-100 dark:to-zinc-400',
        className
      )}
      {...props}
    />
  );
}

// Section Description
export function H2Description({ className, ...props }: TextProps) {
  return <p className={cn('text-md text-zinc-700 dark:text-zinc-300', className)} {...props} />;
}

export function H3({ className, ...props }: TextProps) {
  return <h3 className={cn('scroll-m-20 font-mono text-xl font-semibold tracking-tight', className)} {...props} />;
}

export function P({ className, ...props }: TextProps) {
  return <p className={cn('leading-7', className)} {...props} />;
}

export function PL({ className, ...props }: TextProps) {
  return <p className={cn('leading-7 font-bold tracking-widest [&:not(:first-child)]:mt-6', className)} {...props} />;
}
