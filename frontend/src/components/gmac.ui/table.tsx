import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/components/gmac.ui";

// `scrollBody` switches to a grid layout where the body is its own scroll area (give TableBody a max height),
// so the header stays visible and the scrollbar sits beside the body only. Subgrid keeps header and body columns aligned.
// The column count is read from the header row. An extra trailing track, sized to the body's measured scrollbar width
// (0 for overlay scrollbars), sits under the scrollbar so the rows don't overflow sideways.
const scrollBodyClasses =
  "grid w-max min-w-full [&_:is(thead,tbody,tr)]:col-span-full [&_:is(thead,tbody,tr)]:grid [&_:is(thead,tbody,tr)]:grid-cols-subgrid [&_:is(th,td)]:flex [&_:is(th,td)]:items-center [&_caption]:order-last [&_caption]:col-span-full [&_tbody]:overflow-x-hidden [&_tbody]:overflow-y-auto";

export function Table({ className, scrollBody, style, ref, ...props }: React.ComponentProps<"table"> & { scrollBody?: boolean }) {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [columns, setColumns] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // Runs after every render (before paint) so the grid always matches the header markup
  useLayoutEffect(() => {
    if (!scrollBody) return;
    setColumns(tableRef.current?.querySelectorAll(":scope > thead > tr:first-child > *").length ?? 0);
  });

  useEffect(() => {
    const tbody = scrollBody ? tableRef.current?.querySelector<HTMLElement>(":scope > tbody") : null;
    if (!tbody) return;
    const observer = new ResizeObserver(() => setScrollbarWidth(tbody.offsetWidth - tbody.clientWidth));
    observer.observe(tbody);
    return () => observer.disconnect();
  }, [scrollBody]);

  return (
    <div className="relative w-full overflow-auto rounded-lg border border-gray-300 dark:border-gray-700">
      <table
        ref={(node) => {
          tableRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("w-full caption-bottom text-sm", scrollBody && scrollBodyClasses, className)}
        style={scrollBody && columns ? { gridTemplateColumns: `repeat(${columns}, auto) ${scrollbarWidth}px`, ...style } : style}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("bg-gray-50 dark:bg-gray-900 [&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b border-gray-300 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th className={cn("h-10 px-3 text-left align-middle font-semibold whitespace-nowrap text-gray-700 dark:text-gray-200", className)} {...props} />;
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-3 py-2 align-middle whitespace-nowrap", className)} {...props} />;
}

export function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption className={cn("py-3 text-sm text-gray-700 dark:text-gray-300", className)} {...props} />;
}
