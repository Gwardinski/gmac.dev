import { cn } from "@/components/gmac.ui";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800", className)} {...props} />;
}
