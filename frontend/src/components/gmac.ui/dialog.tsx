import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { IconX } from '@tabler/icons-react';
import type { ComponentProps } from 'react';
import { IconButton } from './icon-button';
import { headingVariants, textVariants } from './typography';
import { cn } from './utils';

// ------------------------------------------------------------
// EXPORTED COMPONENTS
// ------------------------------------------------------------

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100%-12rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-hidden rounded-xl bg-white p-4 text-gray-900 ring-1 ring-gray-300/50 duration-100 outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 sm:max-w-lg dark:bg-gray-900 dark:text-gray-50 dark:ring-gray-600/50',
          className
        )}
        {...props}>
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
}: ComponentProps<'header'> & {
  title: string;
  description: string;
  descriptionSrOnly?: boolean;
}) {
  return (
    <header data-slot="dialog-header" className={cn('relative flex min-w-0 shrink-0 flex-col items-start justify-start pr-10 text-left', className)} {...props}>
      <DialogTitle className={headingVariants({ type: 'h4' })}>{title}</DialogTitle>
      <DialogDescription srOnly={descriptionSrOnly}>{description}</DialogDescription>
      <DialogPrimitive.Close
        data-slot="dialog-close"
        render={
          <IconButton variant="ghost" className="absolute top-0 right-0" aria-label="Close">
            <IconX />
          </IconButton>
        }
      />
    </header>
  );
}

function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-body" className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto no-scrollbar', className)} {...props} />;
}

function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn('mt-auto flex shrink-0 flex-row justify-end gap-2', className)} {...props} />;
}

export { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader };

// ------------------------------------------------------------
// INTERNAL COMPONENTS
// ------------------------------------------------------------

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 isolate z-50 bg-black/10 duration-100 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0 supports-backdrop-filter:backdrop-blur-xs',
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn('cn-font-heading text-base leading-none font-medium', className)} {...props} />;
}

function DialogDescription({
  className,
  srOnly = false,
  ...props
}: DialogPrimitive.Description.Props & {
  srOnly?: boolean;
}) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn(textVariants({ theme: 'secondary', size: 'sm' }), srOnly && 'sr-only', className)} {...props} />;
}

// Not required. Use Zustand to trigger the dialog instead.
// function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
//   return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
// }

// function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
//   return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
// }
