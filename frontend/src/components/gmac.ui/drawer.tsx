import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { ButtonTheme } from "./button";
import { IconButton } from "./icon-button";
import { headingVariants, textVariants } from "./typography";
import { cn } from "./utils";

// ------------------------------------------------------------
// EXPORTED COMPONENTS
// ------------------------------------------------------------

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerContent({
  className,
  children,
  side = "right",
  theme,
  ...props
}: DrawerPrimitive.Popup.Props &
  VariantProps<typeof drawerContentVariants> & {
    side?: "top" | "right" | "bottom" | "left";
  }) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Popup data-slot="drawer-content" data-side={side} className={cn(drawerContentVariants({ theme }), className)} {...props}>
        {children}
      </DrawerPrimitive.Popup>
    </DrawerPortal>
  );
}

function DrawerHeader({
  className,
  title,
  description,
  descriptionSrOnly = false,
  ...props
}: ComponentProps<"header"> & {
  title: string;
  description: string;
  descriptionSrOnly?: boolean;
}) {
  return (
    <header data-slot="drawer-header" className={cn("relative flex min-w-0 shrink-0 flex-col items-start justify-start pr-10 text-left", className)} {...props}>
      <DrawerTitle className={headingVariants({ type: "h4" })}>{title}</DrawerTitle>
      <DrawerDescription srOnly={descriptionSrOnly}>{description}</DrawerDescription>
      <DrawerPrimitive.Close
        data-slot="drawer-close"
        render={
          <IconButton variant="ghost" className="absolute -top-2 -right-2" aria-label="Close">
            <IconX />
          </IconButton>
        }
      />
    </header>
  );
}

function DrawerBody({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="drawer-body" className={cn("no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto", className)} {...props} />;
}

function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn("mt-auto flex shrink-0 flex-row justify-end gap-2", className)} {...props} />;
}

export { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader };

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export { buttonThemeOptions as drawerThemeOptions, type ButtonTheme as DrawerTheme } from "./button";

/** Surface colour (ring / edge border / background / text). Same palette as Dialog's themes. */
const drawerContentThemeClasses = {
  default: "border-gray-200 bg-white text-gray-900 ring-gray-300/50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:ring-gray-600/50",
  gray: "border-gray-200 bg-white text-gray-900 ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:ring-gray-700",
  blue: "border-blue-200 bg-blue-50 text-blue-950 ring-blue-200 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-50 dark:ring-blue-700",
  green: "border-green-200 bg-green-50 text-green-950 ring-green-200 dark:border-green-700 dark:bg-green-950 dark:text-green-50 dark:ring-green-700",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-950 ring-yellow-200 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-50 dark:ring-yellow-700",
  orange: "border-orange-200 bg-orange-50 text-orange-950 ring-orange-200 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-50 dark:ring-orange-700",
  red: "border-red-200 bg-red-50 text-red-950 ring-red-200 dark:border-red-700 dark:bg-red-950 dark:text-red-50 dark:ring-red-700",
  purple: "border-purple-200 bg-purple-50 text-purple-950 ring-purple-200 dark:border-purple-700 dark:bg-purple-950 dark:text-purple-50 dark:ring-purple-700",
  lime: "border-lime-200 bg-lime-50 text-lime-950 ring-lime-200 dark:border-lime-700 dark:bg-lime-950 dark:text-lime-50 dark:ring-lime-700",
  teal: "border-teal-200 bg-teal-50 text-teal-950 ring-teal-200 dark:border-teal-700 dark:bg-teal-950 dark:text-teal-50 dark:ring-teal-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-950 ring-indigo-200 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-50 dark:ring-indigo-700",
  slate: "border-slate-200 bg-white text-slate-900 ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-700",
  neutral: "border-neutral-200 bg-white text-neutral-900 ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:ring-neutral-700",
  mauve: "border-mauve-200 bg-white text-mauve-900 ring-mauve-200 dark:border-mauve-700 dark:bg-mauve-900 dark:text-mauve-50 dark:ring-mauve-700",
  mist: "border-mist-200 bg-white text-mist-900 ring-mist-200 dark:border-mist-700 dark:bg-mist-900 dark:text-mist-50 dark:ring-mist-700",
  olive: "border-olive-200 bg-white text-olive-900 ring-olive-200 dark:border-olive-700 dark:bg-olive-900 dark:text-olive-50 dark:ring-olive-700",
  zinc: "border-zinc-200 bg-white text-zinc-900 ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700",
} satisfies Record<ButtonTheme, string>;

const drawerContentVariants = cva(
  [
    "fixed z-50 flex flex-col gap-4 overflow-hidden p-4 text-sm ring-1 transition duration-200 ease-in-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0",
    "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:max-h-[85vh] data-[side=bottom]:rounded-t-xl data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-10 data-[side=bottom]:data-starting-style:translate-y-10",
    "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:min-h-0 data-[side=left]:w-3/4 data-[side=left]:rounded-r-xl data-[side=left]:border-r data-[side=left]:data-ending-style:-translate-x-10 data-[side=left]:data-starting-style:-translate-x-10 sm:data-[side=left]:max-w-sm",
    "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:min-h-0 data-[side=right]:w-3/4 data-[side=right]:rounded-l-xl data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-10 data-[side=right]:data-starting-style:translate-x-10 sm:data-[side=right]:max-w-sm",
    "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:max-h-[85vh] data-[side=top]:rounded-b-xl data-[side=top]:border-b data-[side=top]:data-ending-style:-translate-y-10 data-[side=top]:data-starting-style:-translate-y-10",
  ].join(" "),
  {
    variants: {
      theme: drawerContentThemeClasses,
    },
    defaultVariants: {
      theme: "default",
    },
  },
);

// ------------------------------------------------------------
// INTERNAL COMPONENTS
// ------------------------------------------------------------

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerOverlay({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return <DrawerPrimitive.Title data-slot="drawer-title" className={cn("cn-font-heading text-base leading-none font-medium", className)} {...props} />;
}

function DrawerDescription({
  className,
  srOnly = false,
  ...props
}: DrawerPrimitive.Description.Props & {
  srOnly?: boolean;
}) {
  return <DrawerPrimitive.Description data-slot="drawer-description" className={cn(textVariants({ theme: "tertiary" }), srOnly && "sr-only", className)} {...props} />;
}
