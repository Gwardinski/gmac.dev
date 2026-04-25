import { cva, type VariantProps } from 'class-variance-authority';
import { useMemo } from 'react';
import { Label } from './label';
import { P2, textVariants } from './typography';
import { cn } from './utils';

export function Form({ className, ...props }: React.ComponentProps<'form'>) {
  return <form noValidate className={cn('flex w-full max-w-xl flex-col gap-8', className)} {...props} />;
}

export function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return <fieldset data-slot="field-set" className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function FieldLegend({ className, ...props }: React.ComponentProps<'legend'>) {
  return <legend data-slot="field-legend" className={cn(textVariants({ size: 'md', weight: 600 }), 'mb-3', className)} {...props} />;
}

export function FieldDescription({ className, ...props }: React.ComponentProps<typeof P2>) {
  return <P2 data-slot="field-description" className={cn(className)} {...props} />;
}

export function FieldGroup({ className, checkbox = false, ...props }: React.ComponentProps<'div'> & { checkbox?: boolean }) {
  return <div data-slot="field-group" className={cn('group/field-group @container/field-group flex w-full flex-col', checkbox ? 'gap-2' : 'gap-4', className)} {...props} />;
}

export function Field({ className, orientation = 'vertical', ...props }: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return <div role="group" data-slot="field" data-orientation={orientation} className={cn(fieldVariants({ orientation }), className)} {...props} />;
}

const fieldVariants = cva(
  `group/field flex w-full gap-2 
  [&_[data-slot=field-label]]:text-gray-900 dark:[&_[data-slot=field-label]]:text-gray-50 data-[invalid=true]:[&_[data-slot=field-label]]:text-red-700
  data-[checked=true]:[&_[data-slot=field-label]]:font-medium
  dark:data-[invalid=true]:[&_[data-slot=field-label]]:text-red-500 data-[disabled=true]:[&_[data-slot=field-label]]:text-gray-500 data-[disabled=true]:[&_[data-slot=field-description]]:text-gray-500`,
  {
    variants: {
      orientation: {
        vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
        horizontal: [
          'flex-row items-center',
          '[&_[data-slot=field-label]]:flex-auto',
          'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-1'
        ],
      }
    },
    defaultVariants: {
      orientation: 'vertical'
    }
  }
);

// For use inside horizontal Fields
export function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="field-content" className={cn('group/field-content flex flex-1 flex-col gap-0.5', className)} {...props} />;
}

export function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-1 text-base',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4',
        className
      )}
      {...props}
    />
  );
}

export function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1" aria-live="polite">
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div role="alert" data-slot="field-error" aria-live="polite" className={cn('font-normal text-red-700 dark:text-red-500', className)} {...props}>
      {content}
    </div>
  );
}
