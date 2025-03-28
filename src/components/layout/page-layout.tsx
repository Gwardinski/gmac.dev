import { cn } from "@/lib/utils";

export function Page({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("flex h-full w-full flex-col gap-12 pb-40", className)}
      {...props}
    />
  );
}

export function PageHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <header className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function PageHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg glass px-5 pt-4 pb-6 dark:dark-glass",
        className,
      )}
      {...props}
    />
  );
}

export function PageHeaderAccordion({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex max-w-lg min-w-fit rounded-md glass px-5 text-black lg:min-w-full dark:dark-glass dark:text-white",
        className,
      )}
      {...props}
    />
  );
}

export function PageTabContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("flex h-full w-full flex-col gap-10 pt-6", className)}
      {...props}
    />
  );
}

export function PageSection({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("flex h-full w-full flex-col gap-6", className)}
      {...props}
    />
  );
}

// Vertical, for text
export function PageSectionHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <header
      className={cn(
        "flex min-h-10 flex-col justify-between gap-2 rounded-lg glass px-5 pt-4 pb-6 dark:dark-glass",
        className,
      )}
      {...props}
    />
  );
}

// Horizontal, for buttons, inputs
export function PageSectionActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <header
      className={cn(
        "flex min-h-10 flex-col gap-2 rounded-lg glass px-4 py-2 md:flex-row lg:items-center lg:justify-between dark:dark-glass",
        className,
      )}
      {...props}
    />
  );
}
