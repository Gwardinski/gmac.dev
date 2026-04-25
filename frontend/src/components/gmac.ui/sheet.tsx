import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import { IconX } from '@tabler/icons-react';
import type { ComponentProps } from 'react';
import { IconButton } from './icon-button';
import { headingVariants, textVariants } from './typography';
import { cn } from './utils';

// ------------------------------------------------------------
// EXPORTED COMPONENTS
// ------------------------------------------------------------

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          'fixed z-50 flex flex-col gap-4 overflow-hidden bg-white p-4 text-sm text-gray-900 ring-1 ring-gray-300/50 transition duration-200 ease-in-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-gray-900 dark:text-gray-50 dark:ring-gray-600/50',
          'data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:max-h-[85vh] data-[side=bottom]:rounded-t-xl data-[side=bottom]:border-t data-[side=bottom]:border-gray-200 data-[side=bottom]:data-ending-style:translate-y-10 data-[side=bottom]:data-starting-style:translate-y-10 dark:data-[side=bottom]:border-gray-700',
          'data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:min-h-0 data-[side=left]:w-3/4 data-[side=left]:rounded-r-xl data-[side=left]:border-r data-[side=left]:border-gray-200 data-[side=left]:data-ending-style:-translate-x-10 data-[side=left]:data-starting-style:-translate-x-10 sm:data-[side=left]:max-w-sm dark:data-[side=left]:border-gray-700',
          'data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:min-h-0 data-[side=right]:w-3/4 data-[side=right]:rounded-l-xl data-[side=right]:border-l data-[side=right]:border-gray-200 data-[side=right]:data-ending-style:translate-x-10 data-[side=right]:data-starting-style:translate-x-10 sm:data-[side=right]:max-w-sm dark:data-[side=right]:border-gray-700',
          'data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:max-h-[85vh] data-[side=top]:rounded-b-xl data-[side=top]:border-b data-[side=top]:border-gray-200 data-[side=top]:data-ending-style:-translate-y-10 data-[side=top]:data-starting-style:-translate-y-10 dark:data-[side=top]:border-gray-700',
          className
        )}
        {...props}>
        {children}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({
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
    <header data-slot="sheet-header" className={cn('relative flex min-w-0 shrink-0 flex-col items-start justify-start pr-10 text-left', className)} {...props}>
      <SheetTitle className={headingVariants({ type: 'h4' })}>{title}</SheetTitle>
      <SheetDescription srOnly={descriptionSrOnly}>{description}</SheetDescription>
      <SheetPrimitive.Close
        data-slot="sheet-close"
        render={
          <IconButton variant="ghost" className="absolute -top-2 -right-2" aria-label="Close">
            <IconX />
          </IconButton>
        }
      />
    </header>
  );
}

function SheetBody({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-body" className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto no-scrollbar', className)} {...props} />;
}

function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-footer" className={cn('mt-auto flex shrink-0 flex-row justify-end gap-2', className)} {...props} />;
}

export { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader };

// ------------------------------------------------------------
// INTERNAL COMPONENTS
// ------------------------------------------------------------

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 isolate z-50 bg-black/10 duration-100 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0 supports-backdrop-filter:backdrop-blur-xs',
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn('cn-font-heading text-base leading-none font-medium', className)} {...props} />;
}

function SheetDescription({
  className,
  srOnly = false,
  ...props
}: SheetPrimitive.Description.Props & {
  srOnly?: boolean;
}) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={cn(textVariants({ theme: 'tertiary' }), srOnly && 'sr-only', className)} {...props} />;
}
