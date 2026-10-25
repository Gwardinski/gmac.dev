import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { createContext, use, type ComponentProps } from "react";
import type { ButtonTheme } from "./button";
import { IconButton } from "./icon-button";
import { headingVariants, textVariants } from "./typography";
import { cn } from "./utils";

// ------------------------------------------------------------
// EXPORTED COMPONENTS
// ------------------------------------------------------------

function Dialog({
  blur = true,
  ...props
}: DialogPrimitive.Root.Props & {
  /** Blur the page behind the overlay. */
  blur?: boolean;
}) {
  return (
    <DialogBlurContext value={blur}>
      <DialogPrimitive.Root data-slot="dialog" {...props} />
    </DialogBlurContext>
  );
}

function DialogContent({ className, children, theme, chonk, ...props }: DialogPrimitive.Popup.Props & VariantProps<typeof dialogContentVariants>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup data-slot="dialog-content" className={cn(dialogContentVariants({ theme, chonk }), className)} {...props}>
        {children}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({
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
    <header data-slot="dialog-header" className={cn("relative flex min-w-0 shrink-0 flex-col items-start justify-start pr-10 text-left", className)} {...props}>
      <DialogTitle className={headingVariants({ type: "h4" })}>{title}</DialogTitle>
      <DialogDescription srOnly={descriptionSrOnly}>{description}</DialogDescription>
      <DialogPrimitive.Close
        data-slot="dialog-close"
        render={
          <IconButton variant="ghost" className="absolute -top-2 -right-2" aria-label="Close">
            <IconX />
          </IconButton>
        }
      />
    </header>
  );
}

function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-body" className={cn("no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto", className)} {...props} />;
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("mt-auto flex shrink-0 flex-row justify-end gap-2", className)} {...props} />;
}

export { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader };

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

/** Border colour. `gray` keeps the default subtle border; the rest match Card's `outline` borders. */
const dialogContentThemeClasses = {
  gray: "border-gray-300/50 dark:border-gray-600/50",
  blue: "border-blue-200 dark:border-blue-700",
  green: "border-green-200 dark:border-green-700",
  yellow: "border-yellow-200 dark:border-yellow-700",
  orange: "border-orange-200 dark:border-orange-700",
  red: "border-red-200 dark:border-red-700",
  purple: "border-purple-200 dark:border-purple-700",
} satisfies Record<ButtonTheme, string>;

const dialogContentVariants = cva(
  "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100%-12rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-hidden rounded-lg border bg-white p-4 text-gray-900 duration-100 outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 sm:max-w-lg dark:bg-gray-900 dark:text-gray-50",
  {
    variants: {
      theme: dialogContentThemeClasses,
      /** Thick border. */
      chonk: { true: "border-5", false: "" },
    },
    defaultVariants: {
      theme: "gray",
    },
  },
);

// ------------------------------------------------------------
// INTERNAL COMPONENTS
// ------------------------------------------------------------

// Lets `Dialog`'s `blur` prop reach the overlay, which `DialogContent` renders.
const DialogBlurContext = createContext(true);

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  const blur = use(DialogBlurContext);
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
        blur && "supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("cn-font-heading text-base leading-none font-medium", className)} {...props} />;
}

function DialogDescription({
  className,
  srOnly = false,
  ...props
}: DialogPrimitive.Description.Props & {
  srOnly?: boolean;
}) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn(textVariants({ theme: "tertiary", size: "md" }), srOnly && "sr-only", className)} {...props} />;
}

// Not required. Use Zustand to trigger the dialog instead.
// function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
//   return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
// }

// function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
//   return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
// }
