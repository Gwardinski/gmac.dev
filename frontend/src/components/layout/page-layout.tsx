import { cn } from '@/components/gmac.ui';

export function Page({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <section className={cn('flex h-full w-full flex-col gap-12 pb-40', className)} {...props} />;
}
