import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { cn } from './utils';

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn('flex w-full flex-col', className)} {...props} />;
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn('not-last:border-b', className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group/accordion-trigger relative flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-transparent py-2.5 text-left font-medium transition-all outline-none',
          'hover:underline focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/50 focus-visible:after:border-blue-500',
          'aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-gray-500',
          'dark:**:data-[slot=accordion-trigger-icon]:text-gray-400',
          className
        )}
        {...props}>
        {children}
        <IconChevronDown data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
        <IconChevronUp data-slot="accordion-trigger-icon" className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel data-slot="accordion-content" className="overflow-hidden data-closed:animate-accordion-up data-open:animate-accordion-down" {...props}>
      <div
        className={cn(
          'h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-gray-900 dark:[&_a]:hover:text-gray-50',
          className
        )}>
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
