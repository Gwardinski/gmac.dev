import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-gray-400 focus-visible:ring-gray-400/50 dark:focus-visible:border-gray-600 dark:focus-visible:ring-gray-600/50 focus-visible:ring-[3px] aria-invalid:ring-red-600/20 dark:aria-invalid:ring-red-900/40 aria-invalid:border-red-600 dark:aria-invalid:border-red-900 transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-white [a&]:hover:bg-gray-900/90 dark:bg-gray-200 dark:text-gray-900 dark:[a&]:hover:bg-gray-200/90",
        glass:
          "glass-border dark:dark-glass-border bg-zinc-50/30 dark:bg-zinc-800/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
