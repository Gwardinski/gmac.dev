import { createContext, use, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ButtonTheme } from "./button";
import { cn } from "./utils";

// `scrollBody` switches to a grid layout where the body is its own scroll area (give TableBody a max height),
// so the header stays visible and the scrollbar sits beside the body only. Subgrid keeps header and body columns aligned.
// The column count is read from the header row. An extra trailing track, sized to the body's measured scrollbar width
// (0 for overlay scrollbars), sits under the scrollbar so the rows don't overflow sideways.
const scrollBodyClasses =
  "grid w-max min-w-full [&_:is(thead,tbody,tr)]:col-span-full [&_:is(thead,tbody,tr)]:grid [&_:is(thead,tbody,tr)]:grid-cols-subgrid [&_:is(th,td)]:flex [&_:is(th,td)]:items-center [&_caption]:order-last [&_caption]:col-span-full [&_tbody]:overflow-x-hidden [&_tbody]:overflow-y-auto";

export function Table({
  className,
  scrollBody,
  theme = "default",
  style,
  ref,
  ...props
}: React.ComponentProps<"table"> & {
  scrollBody?: boolean;
  /** Colours the border, header, rows and caption. Match the app's base colour (e.g. `zinc`). */
  theme?: ButtonTheme;
}) {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [columns, setColumns] = useState(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // Runs after every render (before paint) so the grid always matches the header markup
  useLayoutEffect(() => {
    if (!scrollBody) return;
    setColumns(tableRef.current?.querySelectorAll(":scope > thead > tr:first-child > *").length ?? 0);
  }, [scrollBody]);

  useEffect(() => {
    const tbody = scrollBody ? tableRef.current?.querySelector<HTMLElement>(":scope > tbody") : null;
    if (!tbody) return;
    const observer = new ResizeObserver(() => setScrollbarWidth(tbody.offsetWidth - tbody.clientWidth));
    observer.observe(tbody);
    return () => observer.disconnect();
  }, [scrollBody]);

  return (
    <TableThemeContext value={theme}>
      <div className={cn("relative w-full overflow-auto rounded-lg border", tableThemeClasses[theme].table)}>
        <table
          ref={(node) => {
            tableRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={cn("w-full caption-bottom text-sm", scrollBody && scrollBodyClasses, className)}
          style={
            scrollBody && columns
              ? {
                  gridTemplateColumns: `repeat(${columns}, auto) ${scrollbarWidth}px`,
                  ...style,
                }
              : style
          }
          {...props}
        />
      </div>
    </TableThemeContext>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  const theme = use(TableThemeContext);
  return <thead className={cn("[&_tr]:border-b", tableThemeClasses[theme].header, className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  const theme = use(TableThemeContext);
  return <tr className={cn("border-b transition-colors", tableThemeClasses[theme].row, className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  const theme = use(TableThemeContext);
  return <th className={cn("h-10 px-3 text-left align-middle font-semibold whitespace-nowrap", tableThemeClasses[theme].head, className)} {...props} />;
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-3 py-2 align-middle whitespace-nowrap", className)} {...props} />;
}

export function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  const theme = use(TableThemeContext);
  return <caption className={cn("py-3 text-sm", tableThemeClasses[theme].caption, className)} {...props} />;
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export { buttonThemeOptions as tableThemeOptions, type ButtonTheme as TableTheme } from "./button";

// Lets `Table`'s `theme` prop reach the header, rows and cells.
const TableThemeContext = createContext<ButtonTheme>("default");

type TableThemePart = "table" | "header" | "row" | "head" | "caption";

/** `default` and `gray` are the original gray table. Neutral palettes use `-900` in dark mode; colours use `-950`, like Dialog. */
const tableThemeClasses = {
  default: {
    table: "border-gray-300 dark:border-gray-700",
    header: "bg-gray-50 dark:bg-gray-900",
    row: "border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900",
    head: "text-gray-700 dark:text-gray-200",
    caption: "text-gray-700 dark:text-gray-300",
  },
  gray: {
    table: "border-gray-300 dark:border-gray-700",
    header: "bg-gray-50 dark:bg-gray-900",
    row: "border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900",
    head: "text-gray-700 dark:text-gray-200",
    caption: "text-gray-700 dark:text-gray-300",
  },
  blue: {
    table: "border-blue-300 dark:border-blue-700",
    header: "bg-blue-50 dark:bg-blue-950",
    row: "border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-950",
    head: "text-blue-700 dark:text-blue-200",
    caption: "text-blue-700 dark:text-blue-300",
  },
  green: {
    table: "border-green-300 dark:border-green-700",
    header: "bg-green-50 dark:bg-green-950",
    row: "border-green-300 hover:bg-green-100 dark:border-green-700 dark:hover:bg-green-950",
    head: "text-green-700 dark:text-green-200",
    caption: "text-green-700 dark:text-green-300",
  },
  yellow: {
    table: "border-yellow-300 dark:border-yellow-700",
    header: "bg-yellow-50 dark:bg-yellow-950",
    row: "border-yellow-300 hover:bg-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-950",
    head: "text-yellow-700 dark:text-yellow-200",
    caption: "text-yellow-700 dark:text-yellow-300",
  },
  orange: {
    table: "border-orange-300 dark:border-orange-700",
    header: "bg-orange-50 dark:bg-orange-950",
    row: "border-orange-300 hover:bg-orange-100 dark:border-orange-700 dark:hover:bg-orange-950",
    head: "text-orange-700 dark:text-orange-200",
    caption: "text-orange-700 dark:text-orange-300",
  },
  red: {
    table: "border-red-300 dark:border-red-700",
    header: "bg-red-50 dark:bg-red-950",
    row: "border-red-300 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-950",
    head: "text-red-700 dark:text-red-200",
    caption: "text-red-700 dark:text-red-300",
  },
  purple: {
    table: "border-purple-300 dark:border-purple-700",
    header: "bg-purple-50 dark:bg-purple-950",
    row: "border-purple-300 hover:bg-purple-100 dark:border-purple-700 dark:hover:bg-purple-950",
    head: "text-purple-700 dark:text-purple-200",
    caption: "text-purple-700 dark:text-purple-300",
  },
  lime: {
    table: "border-lime-300 dark:border-lime-700",
    header: "bg-lime-50 dark:bg-lime-950",
    row: "border-lime-300 hover:bg-lime-100 dark:border-lime-700 dark:hover:bg-lime-950",
    head: "text-lime-700 dark:text-lime-200",
    caption: "text-lime-700 dark:text-lime-300",
  },
  teal: {
    table: "border-teal-300 dark:border-teal-700",
    header: "bg-teal-50 dark:bg-teal-950",
    row: "border-teal-300 hover:bg-teal-100 dark:border-teal-700 dark:hover:bg-teal-950",
    head: "text-teal-700 dark:text-teal-200",
    caption: "text-teal-700 dark:text-teal-300",
  },
  indigo: {
    table: "border-indigo-300 dark:border-indigo-700",
    header: "bg-indigo-50 dark:bg-indigo-950",
    row: "border-indigo-300 hover:bg-indigo-100 dark:border-indigo-700 dark:hover:bg-indigo-950",
    head: "text-indigo-700 dark:text-indigo-200",
    caption: "text-indigo-700 dark:text-indigo-300",
  },
  slate: {
    table: "border-slate-300 dark:border-slate-700",
    header: "bg-slate-50 dark:bg-slate-900",
    row: "border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900",
    head: "text-slate-700 dark:text-slate-200",
    caption: "text-slate-700 dark:text-slate-300",
  },
  neutral: {
    table: "border-neutral-300 dark:border-neutral-700",
    header: "bg-neutral-50 dark:bg-neutral-900",
    row: "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
    head: "text-neutral-700 dark:text-neutral-200",
    caption: "text-neutral-700 dark:text-neutral-300",
  },
  mauve: {
    table: "border-mauve-300 dark:border-mauve-700",
    header: "bg-mauve-50 dark:bg-mauve-900",
    row: "border-mauve-300 hover:bg-mauve-100 dark:border-mauve-700 dark:hover:bg-mauve-900",
    head: "text-mauve-700 dark:text-mauve-200",
    caption: "text-mauve-700 dark:text-mauve-300",
  },
  mist: {
    table: "border-mist-300 dark:border-mist-700",
    header: "bg-mist-50 dark:bg-mist-900",
    row: "border-mist-300 hover:bg-mist-100 dark:border-mist-700 dark:hover:bg-mist-900",
    head: "text-mist-700 dark:text-mist-200",
    caption: "text-mist-700 dark:text-mist-300",
  },
  olive: {
    table: "border-olive-300 dark:border-olive-700",
    header: "bg-olive-50 dark:bg-olive-900",
    row: "border-olive-300 hover:bg-olive-100 dark:border-olive-700 dark:hover:bg-olive-900",
    head: "text-olive-700 dark:text-olive-200",
    caption: "text-olive-700 dark:text-olive-300",
  },
  zinc: {
    table: "border-zinc-300 dark:border-zinc-700",
    header: "bg-zinc-50 dark:bg-zinc-900",
    row: "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900",
    head: "text-zinc-700 dark:text-zinc-200",
    caption: "text-zinc-700 dark:text-zinc-300",
  },
} satisfies Record<ButtonTheme, Record<TableThemePart, string>>;
