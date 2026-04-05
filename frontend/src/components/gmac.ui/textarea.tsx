import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

export function Textarea({ className, variant = 'default', ...props }: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
  return <textarea data-slot={variant === 'group' ? 'input-group-control' : 'textarea'} className={cn(textareaVariants({ variant }), className)} {...props} />;
}

const textareaVariants = cva(
  'w-full min-w-0 rounded-lg max-w-2xl min-h-24 h-fit bg-transparent px-3 py-2 text-base text-gray-900 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 dark:bg-transparent dark:text-gray-50 dark:disabled:bg-gray-700',
  {
    variants: {
      variant: {
        default:
          'border border-gray-300 focus-visible:border-purple-500 focus-visible:ring-[3px] focus-visible:ring-purple-200 aria-invalid:border-red-700 aria-invalid:ring-[3px] aria-invalid:ring-red-200 dark:aria-invalid:border-red-500 dark:aria-invalid:ring-red-700/40',
        group:
          'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);
