import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext } from "react";
import type { ButtonTheme } from "./button";
import { cn } from "./utils";

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

type TabsProps = Omit<TabsPrimitive.Root.Props, "orientation">;

/** Tab row with panels stacked below (`orientation` is fixed to horizontal). */
function Tabs({ className, ...props }: TabsProps) {
  return <TabsPrimitive.Root data-slot="tabs" orientation="horizontal" className={cn("flex w-full flex-col gap-2", className)} {...props} />;
}

const defaultTabsListStyle = {
  variant: "outline" as TabsVariantOption,
  theme: "default" as ButtonTheme,
};

const TabsListStyleContext = createContext(defaultTabsListStyle);

function TabsList({ className, variant, theme, ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const resolvedVariant = (variant ?? "outline") as TabsVariantOption;
  const resolvedTheme = (theme ?? "default") as ButtonTheme;
  const style = { variant: resolvedVariant, theme: resolvedTheme };
  return (
    <TabsListStyleContext.Provider value={style}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={resolvedVariant}
        data-theme={resolvedTheme}
        className={cn(tabsListVariants({ variant: resolvedVariant, theme: resolvedTheme }), className)}
        {...props}
      />
    </TabsListStyleContext.Provider>
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  const { variant, theme } = useContext(TabsListStyleContext);
  return <TabsPrimitive.Tab data-slot="tabs-trigger" className={cn(tabsTriggerVariants({ variant, theme }), className)} {...props} />;
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn("flex flex-1 flex-col gap-8 outline-none", className)} {...props} />;
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export const tabsVariantOptions = ["solid", "outline", "glass"] as const;
export type TabsVariantOption = (typeof tabsVariantOptions)[number];

export { buttonThemeOptions as tabsThemeOptions, type ButtonTheme as TabsTheme } from "./button";

const tabsThemeClasses = {
  default: "",
  gray: "",
  blue: "",
  green: "",
  yellow: "",
  orange: "",
  red: "",
  purple: "",
  lime: "",
  teal: "",
  indigo: "",
  slate: "",
  neutral: "",
  mauve: "",
  mist: "",
  olive: "",
  zinc: "",
} satisfies Record<ButtonTheme, string>;

const tabsVariantClasses = {
  solid: "",
  outline: "",
  glass: "",
} satisfies Record<TabsVariantOption, string>;

export const tabsListVariants = cva(
  "group/tabs-list no-scrollbar inline-flex h-auto min-h-9 w-fit max-w-full flex-row items-center justify-start overflow-x-auto rounded-full p-1 text-sm font-normal",
  {
    variants: {
      variant: tabsVariantClasses,
      theme: tabsThemeClasses,
    },
    compoundVariants: [
      // solid — tinted track
      {
        variant: "solid",
        theme: "default",
        class: "gap-0.5 bg-gray-200 dark:bg-gray-800",
      },
      {
        variant: "solid",
        theme: "gray",
        class: "gap-0.5 bg-gray-100 dark:bg-gray-950",
      },
      {
        variant: "solid",
        theme: "blue",
        class: "gap-0.5 bg-blue-100 dark:bg-blue-950",
      },
      {
        variant: "solid",
        theme: "green",
        class: "gap-0.5 bg-green-100 dark:bg-green-950",
      },
      {
        variant: "solid",
        theme: "yellow",
        class: "gap-0.5 bg-yellow-100 dark:bg-yellow-950",
      },
      {
        variant: "solid",
        theme: "orange",
        class: "gap-0.5 bg-orange-100 dark:bg-orange-950",
      },
      {
        variant: "solid",
        theme: "red",
        class: "gap-0.5 bg-red-100 dark:bg-red-950",
      },
      {
        variant: "solid",
        theme: "purple",
        class: "gap-0.5 bg-purple-100 dark:bg-purple-950",
      },
      {
        variant: "solid",
        theme: "lime",
        class: "gap-0.5 bg-lime-100 dark:bg-lime-950",
      },
      {
        variant: "solid",
        theme: "teal",
        class: "gap-0.5 bg-teal-100 dark:bg-teal-950",
      },
      {
        variant: "solid",
        theme: "indigo",
        class: "gap-0.5 bg-indigo-100 dark:bg-indigo-950",
      },
      {
        variant: "solid",
        theme: "slate",
        class: "gap-0.5 bg-slate-100 dark:bg-slate-950",
      },
      {
        variant: "solid",
        theme: "neutral",
        class: "gap-0.5 bg-neutral-100 dark:bg-neutral-950",
      },
      {
        variant: "solid",
        theme: "mauve",
        class: "gap-0.5 bg-mauve-100 dark:bg-mauve-950",
      },
      {
        variant: "solid",
        theme: "mist",
        class: "gap-0.5 bg-mist-100 dark:bg-mist-950",
      },
      {
        variant: "solid",
        theme: "olive",
        class: "gap-0.5 bg-olive-100 dark:bg-olive-950",
      },
      {
        variant: "solid",
        theme: "zinc",
        class: "gap-0.5 bg-zinc-100 dark:bg-zinc-950",
      },
      // outline — themed container border; accent on active tab
      {
        variant: "outline",
        theme: "default",
        class: "gap-0.5 border border-gray-500 bg-transparent dark:border-gray-400",
      },
      {
        variant: "outline",
        theme: "gray",
        class: "gap-0.5 border border-gray-600 bg-transparent dark:border-gray-400",
      },
      {
        variant: "outline",
        theme: "blue",
        class: "gap-0.5 border border-blue-600 bg-transparent dark:border-blue-400",
      },
      {
        variant: "outline",
        theme: "green",
        class: "gap-0.5 border border-green-600 bg-transparent dark:border-green-400",
      },
      {
        variant: "outline",
        theme: "yellow",
        class: "gap-0.5 border border-yellow-600 bg-transparent dark:border-yellow-400",
      },
      {
        variant: "outline",
        theme: "orange",
        class: "gap-0.5 border border-orange-600 bg-transparent dark:border-orange-400",
      },
      {
        variant: "outline",
        theme: "red",
        class: "gap-0.5 border border-red-600 bg-transparent dark:border-red-400",
      },
      {
        variant: "outline",
        theme: "purple",
        class: "gap-0.5 border border-purple-600 bg-transparent dark:border-purple-400",
      },
      {
        variant: "outline",
        theme: "lime",
        class: "gap-0.5 border border-lime-600 bg-transparent dark:border-lime-400",
      },
      {
        variant: "outline",
        theme: "teal",
        class: "gap-0.5 border border-teal-600 bg-transparent dark:border-teal-400",
      },
      {
        variant: "outline",
        theme: "indigo",
        class: "gap-0.5 border border-indigo-600 bg-transparent dark:border-indigo-400",
      },
      {
        variant: "outline",
        theme: "slate",
        class: "gap-0.5 border border-slate-600 bg-transparent dark:border-slate-400",
      },
      {
        variant: "outline",
        theme: "neutral",
        class: "gap-0.5 border border-neutral-600 bg-transparent dark:border-neutral-400",
      },
      {
        variant: "outline",
        theme: "mauve",
        class: "gap-0.5 border border-mauve-600 bg-transparent dark:border-mauve-400",
      },
      {
        variant: "outline",
        theme: "mist",
        class: "gap-0.5 border border-mist-600 bg-transparent dark:border-mist-400",
      },
      {
        variant: "outline",
        theme: "olive",
        class: "gap-0.5 border border-olive-600 bg-transparent dark:border-olive-400",
      },
      {
        variant: "outline",
        theme: "zinc",
        class: "gap-0.5 border border-zinc-600 bg-transparent dark:border-zinc-400",
      },
      // glass
      {
        variant: "glass",
        theme: "default",
        class: "gap-0.5 bg-gray-500/5 backdrop-blur-sm glass-border dark:bg-gray-800/25 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "gray",
        class: "gap-0.5 bg-gray-500/8 backdrop-blur-sm glass-border dark:bg-gray-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "blue",
        class: "gap-0.5 bg-blue-500/8 backdrop-blur-sm glass-border dark:bg-blue-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "green",
        class: "gap-0.5 bg-green-500/8 backdrop-blur-sm glass-border dark:bg-green-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "yellow",
        class: "gap-0.5 bg-yellow-500/10 backdrop-blur-sm glass-border dark:bg-yellow-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "orange",
        class: "gap-0.5 bg-orange-500/8 backdrop-blur-sm glass-border dark:bg-orange-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "red",
        class: "gap-0.5 bg-red-500/8 backdrop-blur-sm glass-border dark:bg-red-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "purple",
        class: "gap-0.5 bg-purple-500/8 backdrop-blur-sm glass-border dark:bg-purple-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "lime",
        class: "gap-0.5 bg-lime-500/8 backdrop-blur-sm glass-border dark:bg-lime-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "teal",
        class: "gap-0.5 bg-teal-500/8 backdrop-blur-sm glass-border dark:bg-teal-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "indigo",
        class: "gap-0.5 bg-indigo-500/8 backdrop-blur-sm glass-border dark:bg-indigo-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "slate",
        class: "gap-0.5 bg-slate-500/8 backdrop-blur-sm glass-border dark:bg-slate-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "neutral",
        class: "gap-0.5 bg-neutral-500/8 backdrop-blur-sm glass-border dark:bg-neutral-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "mauve",
        class: "gap-0.5 bg-mauve-500/8 backdrop-blur-sm glass-border dark:bg-mauve-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "mist",
        class: "gap-0.5 bg-mist-500/8 backdrop-blur-sm glass-border dark:bg-mist-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "olive",
        class: "gap-0.5 bg-olive-500/8 backdrop-blur-sm glass-border dark:bg-olive-950/30 dark:dark-glass-border",
      },
      {
        variant: "glass",
        theme: "zinc",
        class: "gap-0.5 bg-zinc-500/8 backdrop-blur-sm glass-border dark:bg-zinc-950/30 dark:dark-glass-border",
      },
    ],
    defaultVariants: {
      variant: "solid",
      theme: "default",
    },
  },
);

const tabsTriggerVariants = cva(
  'relative inline-flex flex-1 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-normal whitespace-nowrap transition-colors outline-none focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: tabsVariantClasses,
      theme: tabsThemeClasses,
    },
    compoundVariants: [
      // solid
      {
        variant: "solid",
        theme: "default",
        class:
          "text-gray-600 hover:text-gray-900 not-data-active:hover:bg-gray-300 focus-visible:text-gray-900 focus-visible:ring-gray-500/50 not-data-active:focus-visible:bg-gray-300 active:text-gray-900 not-data-active:active:bg-gray-300 data-active:border-gray-500 data-active:bg-gray-500 data-active:text-white dark:text-white dark:hover:text-gray-50 dark:not-data-active:hover:bg-gray-700 dark:focus-visible:text-gray-50 dark:focus-visible:ring-gray-500/50 dark:not-data-active:focus-visible:bg-gray-700 dark:active:text-gray-50 dark:not-data-active:active:bg-gray-700 dark:data-active:bg-gray-600",
      },
      {
        variant: "solid",
        theme: "gray",
        class:
          "text-gray-900 hover:text-gray-950 not-data-active:hover:bg-gray-200 focus-visible:text-gray-950 focus-visible:ring-gray-500/50 not-data-active:focus-visible:bg-gray-200 active:text-gray-950 not-data-active:active:bg-gray-200 data-active:border-gray-500 data-active:bg-gray-500 data-active:text-white dark:text-gray-200 dark:hover:text-gray-50 dark:not-data-active:hover:bg-gray-900 dark:focus-visible:text-gray-50 dark:focus-visible:ring-gray-500/50 dark:not-data-active:focus-visible:bg-gray-900 dark:active:text-gray-50 dark:not-data-active:active:bg-gray-900 dark:data-active:bg-gray-600",
      },
      {
        variant: "solid",
        theme: "blue",
        class:
          "text-blue-900 hover:text-blue-950 not-data-active:hover:bg-blue-200 focus-visible:text-blue-950 focus-visible:ring-blue-500/50 not-data-active:focus-visible:bg-blue-200 active:text-blue-950 not-data-active:active:bg-blue-200 data-active:border-blue-500 data-active:bg-blue-500 data-active:text-white dark:text-blue-200 dark:hover:text-blue-50 dark:not-data-active:hover:bg-blue-900 dark:focus-visible:text-blue-50 dark:focus-visible:ring-blue-500/50 dark:not-data-active:focus-visible:bg-blue-900 dark:active:text-blue-50 dark:not-data-active:active:bg-blue-900 dark:data-active:bg-blue-600",
      },
      {
        variant: "solid",
        theme: "green",
        class:
          "text-green-900 hover:text-green-950 not-data-active:hover:bg-green-200 focus-visible:text-green-950 focus-visible:ring-green-500/50 not-data-active:focus-visible:bg-green-200 active:text-green-950 not-data-active:active:bg-green-200 data-active:border-green-500 data-active:bg-green-500 data-active:text-gray-950 dark:text-green-200 dark:hover:text-green-50 dark:not-data-active:hover:bg-green-900 dark:focus-visible:text-green-50 dark:focus-visible:ring-green-500/50 dark:not-data-active:focus-visible:bg-green-900 dark:active:text-green-50 dark:not-data-active:active:bg-green-900 dark:data-active:bg-green-600 dark:data-active:text-gray-950",
      },
      {
        variant: "solid",
        theme: "yellow",
        class:
          "text-yellow-900 hover:text-yellow-950 not-data-active:hover:bg-yellow-200 focus-visible:text-yellow-950 focus-visible:ring-yellow-500/50 not-data-active:focus-visible:bg-yellow-200 active:text-yellow-950 not-data-active:active:bg-yellow-200 data-active:border-yellow-500 data-active:bg-yellow-500 data-active:text-gray-950 dark:text-yellow-200 dark:hover:text-yellow-50 dark:not-data-active:hover:bg-yellow-900 dark:focus-visible:text-yellow-50 dark:focus-visible:ring-yellow-500/50 dark:not-data-active:focus-visible:bg-yellow-900 dark:active:text-yellow-50 dark:not-data-active:active:bg-yellow-900 dark:data-active:bg-yellow-600 dark:data-active:text-gray-950",
      },
      {
        variant: "solid",
        theme: "orange",
        class:
          "text-orange-900 hover:text-orange-950 not-data-active:hover:bg-orange-200 focus-visible:text-orange-950 focus-visible:ring-orange-500/50 not-data-active:focus-visible:bg-orange-200 active:text-orange-950 not-data-active:active:bg-orange-200 data-active:border-orange-500 data-active:bg-orange-500 data-active:text-gray-950 dark:text-orange-200 dark:hover:text-orange-50 dark:not-data-active:hover:bg-orange-900 dark:focus-visible:text-orange-50 dark:focus-visible:ring-orange-500/50 dark:not-data-active:focus-visible:bg-orange-900 dark:active:text-orange-50 dark:not-data-active:active:bg-orange-900 dark:data-active:bg-orange-600 dark:data-active:text-gray-950",
      },
      {
        variant: "solid",
        theme: "red",
        class:
          "text-red-900 hover:text-red-950 not-data-active:hover:bg-red-200 focus-visible:text-red-950 focus-visible:ring-red-500/50 not-data-active:focus-visible:bg-red-200 active:text-red-950 not-data-active:active:bg-red-200 data-active:border-red-500 data-active:bg-red-500 data-active:text-white dark:text-red-200 dark:hover:text-red-50 dark:not-data-active:hover:bg-red-900 dark:focus-visible:text-red-50 dark:focus-visible:ring-red-500/50 dark:not-data-active:focus-visible:bg-red-900 dark:active:text-red-50 dark:not-data-active:active:bg-red-900 dark:data-active:bg-red-600",
      },
      {
        variant: "solid",
        theme: "purple",
        class:
          "text-purple-900 hover:text-purple-950 not-data-active:hover:bg-purple-200 focus-visible:text-purple-950 focus-visible:ring-purple-500/50 not-data-active:focus-visible:bg-purple-200 active:text-purple-950 not-data-active:active:bg-purple-200 data-active:border-purple-500 data-active:bg-purple-500 data-active:text-white dark:text-purple-200 dark:hover:text-purple-50 dark:not-data-active:hover:bg-purple-900 dark:focus-visible:text-purple-50 dark:focus-visible:ring-purple-500/50 dark:not-data-active:focus-visible:bg-purple-900 dark:active:text-purple-50 dark:not-data-active:active:bg-purple-900 dark:data-active:bg-purple-600",
      },
      {
        variant: "solid",
        theme: "lime",
        class:
          "text-lime-900 hover:text-lime-950 not-data-active:hover:bg-lime-200 focus-visible:text-lime-950 focus-visible:ring-lime-500/50 not-data-active:focus-visible:bg-lime-200 active:text-lime-950 not-data-active:active:bg-lime-200 data-active:border-lime-500 data-active:bg-lime-500 data-active:text-gray-950 dark:text-lime-200 dark:hover:text-lime-50 dark:not-data-active:hover:bg-lime-900 dark:focus-visible:text-lime-50 dark:focus-visible:ring-lime-500/50 dark:not-data-active:focus-visible:bg-lime-900 dark:active:text-lime-50 dark:not-data-active:active:bg-lime-900 dark:data-active:bg-lime-600 dark:data-active:text-gray-950",
      },
      {
        variant: "solid",
        theme: "teal",
        class:
          "text-teal-900 hover:text-teal-950 not-data-active:hover:bg-teal-200 focus-visible:text-teal-950 focus-visible:ring-teal-500/50 not-data-active:focus-visible:bg-teal-200 active:text-teal-950 not-data-active:active:bg-teal-200 data-active:border-teal-500 data-active:bg-teal-500 data-active:text-gray-950 dark:text-teal-200 dark:hover:text-teal-50 dark:not-data-active:hover:bg-teal-900 dark:focus-visible:text-teal-50 dark:focus-visible:ring-teal-500/50 dark:not-data-active:focus-visible:bg-teal-900 dark:active:text-teal-50 dark:not-data-active:active:bg-teal-900 dark:data-active:bg-teal-600 dark:data-active:text-gray-950",
      },
      {
        variant: "solid",
        theme: "indigo",
        class:
          "text-indigo-900 hover:text-indigo-950 not-data-active:hover:bg-indigo-200 focus-visible:text-indigo-950 focus-visible:ring-indigo-500/50 not-data-active:focus-visible:bg-indigo-200 active:text-indigo-950 not-data-active:active:bg-indigo-200 data-active:border-indigo-500 data-active:bg-indigo-500 data-active:text-white dark:text-indigo-200 dark:hover:text-indigo-50 dark:not-data-active:hover:bg-indigo-900 dark:focus-visible:text-indigo-50 dark:focus-visible:ring-indigo-500/50 dark:not-data-active:focus-visible:bg-indigo-900 dark:active:text-indigo-50 dark:not-data-active:active:bg-indigo-900 dark:data-active:bg-indigo-600",
      },
      {
        variant: "solid",
        theme: "slate",
        class:
          "text-slate-900 hover:text-slate-950 not-data-active:hover:bg-slate-200 focus-visible:text-slate-950 focus-visible:ring-slate-500/50 not-data-active:focus-visible:bg-slate-200 active:text-slate-950 not-data-active:active:bg-slate-200 data-active:border-slate-500 data-active:bg-slate-500 data-active:text-white dark:text-slate-200 dark:hover:text-slate-50 dark:not-data-active:hover:bg-slate-900 dark:focus-visible:text-slate-50 dark:focus-visible:ring-slate-500/50 dark:not-data-active:focus-visible:bg-slate-900 dark:active:text-slate-50 dark:not-data-active:active:bg-slate-900 dark:data-active:bg-slate-600",
      },
      {
        variant: "solid",
        theme: "neutral",
        class:
          "text-neutral-900 hover:text-neutral-950 not-data-active:hover:bg-neutral-200 focus-visible:text-neutral-950 focus-visible:ring-neutral-500/50 not-data-active:focus-visible:bg-neutral-200 active:text-neutral-950 not-data-active:active:bg-neutral-200 data-active:border-neutral-500 data-active:bg-neutral-500 data-active:text-white dark:text-neutral-200 dark:hover:text-neutral-50 dark:not-data-active:hover:bg-neutral-900 dark:focus-visible:text-neutral-50 dark:focus-visible:ring-neutral-500/50 dark:not-data-active:focus-visible:bg-neutral-900 dark:active:text-neutral-50 dark:not-data-active:active:bg-neutral-900 dark:data-active:bg-neutral-600",
      },
      {
        variant: "solid",
        theme: "mauve",
        class:
          "text-mauve-900 hover:text-mauve-950 not-data-active:hover:bg-mauve-200 focus-visible:text-mauve-950 focus-visible:ring-mauve-500/50 not-data-active:focus-visible:bg-mauve-200 active:text-mauve-950 not-data-active:active:bg-mauve-200 data-active:border-mauve-500 data-active:bg-mauve-500 data-active:text-white dark:text-mauve-200 dark:hover:text-mauve-50 dark:not-data-active:hover:bg-mauve-900 dark:focus-visible:text-mauve-50 dark:focus-visible:ring-mauve-500/50 dark:not-data-active:focus-visible:bg-mauve-900 dark:active:text-mauve-50 dark:not-data-active:active:bg-mauve-900 dark:data-active:bg-mauve-600",
      },
      {
        variant: "solid",
        theme: "mist",
        class:
          "text-mist-900 hover:text-mist-950 not-data-active:hover:bg-mist-200 focus-visible:text-mist-950 focus-visible:ring-mist-500/50 not-data-active:focus-visible:bg-mist-200 active:text-mist-950 not-data-active:active:bg-mist-200 data-active:border-mist-500 data-active:bg-mist-500 data-active:text-white dark:text-mist-200 dark:hover:text-mist-50 dark:not-data-active:hover:bg-mist-900 dark:focus-visible:text-mist-50 dark:focus-visible:ring-mist-500/50 dark:not-data-active:focus-visible:bg-mist-900 dark:active:text-mist-50 dark:not-data-active:active:bg-mist-900 dark:data-active:bg-mist-600",
      },
      {
        variant: "solid",
        theme: "olive",
        class:
          "text-olive-900 hover:text-olive-950 not-data-active:hover:bg-olive-200 focus-visible:text-olive-950 focus-visible:ring-olive-500/50 not-data-active:focus-visible:bg-olive-200 active:text-olive-950 not-data-active:active:bg-olive-200 data-active:border-olive-500 data-active:bg-olive-500 data-active:text-white dark:text-olive-200 dark:hover:text-olive-50 dark:not-data-active:hover:bg-olive-900 dark:focus-visible:text-olive-50 dark:focus-visible:ring-olive-500/50 dark:not-data-active:focus-visible:bg-olive-900 dark:active:text-olive-50 dark:not-data-active:active:bg-olive-900 dark:data-active:bg-olive-600",
      },
      {
        variant: "solid",
        theme: "zinc",
        class:
          "text-zinc-900 hover:text-zinc-950 not-data-active:hover:bg-zinc-200 focus-visible:text-zinc-950 focus-visible:ring-zinc-500/50 not-data-active:focus-visible:bg-zinc-200 active:text-zinc-950 not-data-active:active:bg-zinc-200 data-active:border-zinc-500 data-active:bg-zinc-500 data-active:text-white dark:text-zinc-200 dark:hover:text-zinc-50 dark:not-data-active:hover:bg-zinc-900 dark:focus-visible:text-zinc-50 dark:focus-visible:ring-zinc-500/50 dark:not-data-active:focus-visible:bg-zinc-900 dark:active:text-zinc-50 dark:not-data-active:active:bg-zinc-900 dark:data-active:bg-zinc-600",
      },
      // outline
      {
        variant: "outline",
        theme: "default",
        class:
          "text-gray-500 hover:text-gray-700 not-data-active:hover:border-gray-500/40 focus-visible:text-gray-700 focus-visible:ring-gray-500/50 not-data-active:focus-visible:border-gray-500/40 active:text-gray-700 not-data-active:active:border-gray-500/40 data-active:border-gray-500 data-active:shadow-sm dark:text-gray-400 dark:hover:text-gray-200 dark:not-data-active:hover:border-gray-400/40 dark:focus-visible:text-gray-200 dark:focus-visible:ring-gray-400/50 dark:not-data-active:focus-visible:border-gray-400/40 dark:active:text-gray-200 dark:not-data-active:active:border-gray-400/40 dark:data-active:border-gray-400",
      },
      {
        variant: "outline",
        theme: "gray",
        class:
          "text-gray-600 hover:text-gray-800 not-data-active:hover:border-gray-600/40 focus-visible:text-gray-800 focus-visible:ring-gray-600/50 not-data-active:focus-visible:border-gray-600/40 active:text-gray-800 not-data-active:active:border-gray-600/40 data-active:border-gray-600 data-active:shadow-sm dark:text-gray-400 dark:hover:text-gray-200 dark:not-data-active:hover:border-gray-400/40 dark:focus-visible:text-gray-200 dark:focus-visible:ring-gray-400/50 dark:not-data-active:focus-visible:border-gray-400/40 dark:active:text-gray-200 dark:not-data-active:active:border-gray-400/40 dark:data-active:border-gray-400",
      },
      {
        variant: "outline",
        theme: "blue",
        class:
          "text-blue-600 hover:text-blue-800 not-data-active:hover:border-blue-600/40 focus-visible:text-blue-800 focus-visible:ring-blue-600/50 not-data-active:focus-visible:border-blue-600/40 active:text-blue-800 not-data-active:active:border-blue-600/40 data-active:border-blue-600 data-active:shadow-sm dark:text-blue-400 dark:hover:text-blue-200 dark:not-data-active:hover:border-blue-400/40 dark:focus-visible:text-blue-200 dark:focus-visible:ring-blue-400/50 dark:not-data-active:focus-visible:border-blue-400/40 dark:active:text-blue-200 dark:not-data-active:active:border-blue-400/40 dark:data-active:border-blue-400",
      },
      {
        variant: "outline",
        theme: "green",
        class:
          "text-green-600 hover:text-green-800 not-data-active:hover:border-green-600/40 focus-visible:text-green-800 focus-visible:ring-green-600/50 not-data-active:focus-visible:border-green-600/40 active:text-green-800 not-data-active:active:border-green-600/40 data-active:border-green-600 data-active:shadow-sm dark:text-green-400 dark:hover:text-green-200 dark:not-data-active:hover:border-green-400/40 dark:focus-visible:text-green-200 dark:focus-visible:ring-green-400/50 dark:not-data-active:focus-visible:border-green-400/40 dark:active:text-green-200 dark:not-data-active:active:border-green-400/40 dark:data-active:border-green-400",
      },
      {
        variant: "outline",
        theme: "yellow",
        class:
          "text-yellow-600 hover:text-yellow-800 not-data-active:hover:border-yellow-600/40 focus-visible:text-yellow-800 focus-visible:ring-yellow-600/50 not-data-active:focus-visible:border-yellow-600/40 active:text-yellow-800 not-data-active:active:border-yellow-600/40 data-active:border-yellow-600 data-active:shadow-sm dark:text-yellow-400 dark:hover:text-yellow-200 dark:not-data-active:hover:border-yellow-400/40 dark:focus-visible:text-yellow-200 dark:focus-visible:ring-yellow-400/50 dark:not-data-active:focus-visible:border-yellow-400/40 dark:active:text-yellow-200 dark:not-data-active:active:border-yellow-400/40 dark:data-active:border-yellow-400",
      },
      {
        variant: "outline",
        theme: "orange",
        class:
          "text-orange-600 hover:text-orange-800 not-data-active:hover:border-orange-600/40 focus-visible:text-orange-800 focus-visible:ring-orange-600/50 not-data-active:focus-visible:border-orange-600/40 active:text-orange-800 not-data-active:active:border-orange-600/40 data-active:border-orange-600 data-active:shadow-sm dark:text-orange-400 dark:hover:text-orange-200 dark:not-data-active:hover:border-orange-400/40 dark:focus-visible:text-orange-200 dark:focus-visible:ring-orange-400/50 dark:not-data-active:focus-visible:border-orange-400/40 dark:active:text-orange-200 dark:not-data-active:active:border-orange-400/40 dark:data-active:border-orange-400",
      },
      {
        variant: "outline",
        theme: "red",
        class:
          "text-red-600 hover:text-red-800 not-data-active:hover:border-red-600/40 focus-visible:text-red-800 focus-visible:ring-red-600/50 not-data-active:focus-visible:border-red-600/40 active:text-red-800 not-data-active:active:border-red-600/40 data-active:border-red-600 data-active:shadow-sm dark:text-red-400 dark:hover:text-red-200 dark:not-data-active:hover:border-red-400/40 dark:focus-visible:text-red-200 dark:focus-visible:ring-red-400/50 dark:not-data-active:focus-visible:border-red-400/40 dark:active:text-red-200 dark:not-data-active:active:border-red-400/40 dark:data-active:border-red-400",
      },
      {
        variant: "outline",
        theme: "purple",
        class:
          "text-purple-600 hover:text-purple-800 not-data-active:hover:border-purple-600/40 focus-visible:text-purple-800 focus-visible:ring-purple-600/50 not-data-active:focus-visible:border-purple-600/40 active:text-purple-800 not-data-active:active:border-purple-600/40 data-active:border-purple-600 data-active:shadow-sm dark:text-purple-400 dark:hover:text-purple-200 dark:not-data-active:hover:border-purple-400/40 dark:focus-visible:text-purple-200 dark:focus-visible:ring-purple-400/50 dark:not-data-active:focus-visible:border-purple-400/40 dark:active:text-purple-200 dark:not-data-active:active:border-purple-400/40 dark:data-active:border-purple-400",
      },
      {
        variant: "outline",
        theme: "lime",
        class:
          "text-lime-600 hover:text-lime-800 not-data-active:hover:border-lime-600/40 focus-visible:text-lime-800 focus-visible:ring-lime-600/50 not-data-active:focus-visible:border-lime-600/40 active:text-lime-800 not-data-active:active:border-lime-600/40 data-active:border-lime-600 data-active:shadow-sm dark:text-lime-400 dark:hover:text-lime-200 dark:not-data-active:hover:border-lime-400/40 dark:focus-visible:text-lime-200 dark:focus-visible:ring-lime-400/50 dark:not-data-active:focus-visible:border-lime-400/40 dark:active:text-lime-200 dark:not-data-active:active:border-lime-400/40 dark:data-active:border-lime-400",
      },
      {
        variant: "outline",
        theme: "teal",
        class:
          "text-teal-600 hover:text-teal-800 not-data-active:hover:border-teal-600/40 focus-visible:text-teal-800 focus-visible:ring-teal-600/50 not-data-active:focus-visible:border-teal-600/40 active:text-teal-800 not-data-active:active:border-teal-600/40 data-active:border-teal-600 data-active:shadow-sm dark:text-teal-400 dark:hover:text-teal-200 dark:not-data-active:hover:border-teal-400/40 dark:focus-visible:text-teal-200 dark:focus-visible:ring-teal-400/50 dark:not-data-active:focus-visible:border-teal-400/40 dark:active:text-teal-200 dark:not-data-active:active:border-teal-400/40 dark:data-active:border-teal-400",
      },
      {
        variant: "outline",
        theme: "indigo",
        class:
          "text-indigo-600 hover:text-indigo-800 not-data-active:hover:border-indigo-600/40 focus-visible:text-indigo-800 focus-visible:ring-indigo-600/50 not-data-active:focus-visible:border-indigo-600/40 active:text-indigo-800 not-data-active:active:border-indigo-600/40 data-active:border-indigo-600 data-active:shadow-sm dark:text-indigo-400 dark:hover:text-indigo-200 dark:not-data-active:hover:border-indigo-400/40 dark:focus-visible:text-indigo-200 dark:focus-visible:ring-indigo-400/50 dark:not-data-active:focus-visible:border-indigo-400/40 dark:active:text-indigo-200 dark:not-data-active:active:border-indigo-400/40 dark:data-active:border-indigo-400",
      },
      {
        variant: "outline",
        theme: "slate",
        class:
          "text-slate-600 hover:text-slate-800 not-data-active:hover:border-slate-600/40 focus-visible:text-slate-800 focus-visible:ring-slate-600/50 not-data-active:focus-visible:border-slate-600/40 active:text-slate-800 not-data-active:active:border-slate-600/40 data-active:border-slate-600 data-active:shadow-sm dark:text-slate-400 dark:hover:text-slate-200 dark:not-data-active:hover:border-slate-400/40 dark:focus-visible:text-slate-200 dark:focus-visible:ring-slate-400/50 dark:not-data-active:focus-visible:border-slate-400/40 dark:active:text-slate-200 dark:not-data-active:active:border-slate-400/40 dark:data-active:border-slate-400",
      },
      {
        variant: "outline",
        theme: "neutral",
        class:
          "text-neutral-600 hover:text-neutral-800 not-data-active:hover:border-neutral-600/40 focus-visible:text-neutral-800 focus-visible:ring-neutral-600/50 not-data-active:focus-visible:border-neutral-600/40 active:text-neutral-800 not-data-active:active:border-neutral-600/40 data-active:border-neutral-600 data-active:shadow-sm dark:text-neutral-400 dark:hover:text-neutral-200 dark:not-data-active:hover:border-neutral-400/40 dark:focus-visible:text-neutral-200 dark:focus-visible:ring-neutral-400/50 dark:not-data-active:focus-visible:border-neutral-400/40 dark:active:text-neutral-200 dark:not-data-active:active:border-neutral-400/40 dark:data-active:border-neutral-400",
      },
      {
        variant: "outline",
        theme: "mauve",
        class:
          "text-mauve-600 hover:text-mauve-800 not-data-active:hover:border-mauve-600/40 focus-visible:text-mauve-800 focus-visible:ring-mauve-600/50 not-data-active:focus-visible:border-mauve-600/40 active:text-mauve-800 not-data-active:active:border-mauve-600/40 data-active:border-mauve-600 data-active:shadow-sm dark:text-mauve-400 dark:hover:text-mauve-200 dark:not-data-active:hover:border-mauve-400/40 dark:focus-visible:text-mauve-200 dark:focus-visible:ring-mauve-400/50 dark:not-data-active:focus-visible:border-mauve-400/40 dark:active:text-mauve-200 dark:not-data-active:active:border-mauve-400/40 dark:data-active:border-mauve-400",
      },
      {
        variant: "outline",
        theme: "mist",
        class:
          "text-mist-600 hover:text-mist-800 not-data-active:hover:border-mist-600/40 focus-visible:text-mist-800 focus-visible:ring-mist-600/50 not-data-active:focus-visible:border-mist-600/40 active:text-mist-800 not-data-active:active:border-mist-600/40 data-active:border-mist-600 data-active:shadow-sm dark:text-mist-400 dark:hover:text-mist-200 dark:not-data-active:hover:border-mist-400/40 dark:focus-visible:text-mist-200 dark:focus-visible:ring-mist-400/50 dark:not-data-active:focus-visible:border-mist-400/40 dark:active:text-mist-200 dark:not-data-active:active:border-mist-400/40 dark:data-active:border-mist-400",
      },
      {
        variant: "outline",
        theme: "olive",
        class:
          "text-olive-600 hover:text-olive-800 not-data-active:hover:border-olive-600/40 focus-visible:text-olive-800 focus-visible:ring-olive-600/50 not-data-active:focus-visible:border-olive-600/40 active:text-olive-800 not-data-active:active:border-olive-600/40 data-active:border-olive-600 data-active:shadow-sm dark:text-olive-400 dark:hover:text-olive-200 dark:not-data-active:hover:border-olive-400/40 dark:focus-visible:text-olive-200 dark:focus-visible:ring-olive-400/50 dark:not-data-active:focus-visible:border-olive-400/40 dark:active:text-olive-200 dark:not-data-active:active:border-olive-400/40 dark:data-active:border-olive-400",
      },
      {
        variant: "outline",
        theme: "zinc",
        class:
          "text-zinc-600 hover:text-zinc-800 not-data-active:hover:border-zinc-600/40 focus-visible:text-zinc-800 focus-visible:ring-zinc-600/50 not-data-active:focus-visible:border-zinc-600/40 active:text-zinc-800 not-data-active:active:border-zinc-600/40 data-active:border-zinc-600 data-active:shadow-sm dark:text-zinc-400 dark:hover:text-zinc-200 dark:not-data-active:hover:border-zinc-400/40 dark:focus-visible:text-zinc-200 dark:focus-visible:ring-zinc-400/50 dark:not-data-active:focus-visible:border-zinc-400/40 dark:active:text-zinc-200 dark:not-data-active:active:border-zinc-400/40 dark:data-active:border-zinc-400",
      },
      // glass
      {
        variant: "glass",
        theme: "default",
        class:
          "text-gray-700 hover:bg-gray-500/15 hover:text-gray-900 focus-visible:bg-gray-500/15 focus-visible:text-gray-900 focus-visible:ring-gray-500/50 active:bg-gray-500/15 active:text-gray-900 data-active:bg-gray-500/35 data-active:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-500/20 dark:hover:text-gray-50 dark:focus-visible:bg-gray-500/20 dark:focus-visible:text-gray-50 dark:focus-visible:ring-gray-500/50 dark:active:bg-gray-500/20 dark:active:text-gray-50 dark:data-active:bg-gray-700/55 dark:data-active:text-gray-50",
      },
      {
        variant: "glass",
        theme: "gray",
        class:
          "text-gray-900 hover:bg-gray-500/15 hover:text-gray-950 focus-visible:bg-gray-500/15 focus-visible:text-gray-950 focus-visible:ring-gray-500/50 active:bg-gray-500/15 active:text-gray-950 data-active:bg-gray-500/30 data-active:text-gray-950 dark:text-gray-200 dark:hover:bg-gray-500/20 dark:hover:text-gray-50 dark:focus-visible:bg-gray-500/20 dark:focus-visible:text-gray-50 dark:focus-visible:ring-gray-500/50 dark:active:bg-gray-500/20 dark:active:text-gray-50 dark:data-active:bg-gray-800/50 dark:data-active:text-gray-50",
      },
      {
        variant: "glass",
        theme: "blue",
        class:
          "text-blue-900 hover:bg-blue-500/15 hover:text-blue-950 focus-visible:bg-blue-500/15 focus-visible:text-blue-950 focus-visible:ring-blue-500/50 active:bg-blue-500/15 active:text-blue-950 data-active:bg-blue-500/30 data-active:text-blue-950 dark:text-blue-200 dark:hover:bg-blue-500/20 dark:hover:text-blue-50 dark:focus-visible:bg-blue-500/20 dark:focus-visible:text-blue-50 dark:focus-visible:ring-blue-500/50 dark:active:bg-blue-500/20 dark:active:text-blue-50 dark:data-active:bg-blue-800/50 dark:data-active:text-blue-50",
      },
      {
        variant: "glass",
        theme: "green",
        class:
          "text-green-900 hover:bg-green-500/15 hover:text-green-950 focus-visible:bg-green-500/15 focus-visible:text-green-950 focus-visible:ring-green-500/50 active:bg-green-500/15 active:text-green-950 data-active:bg-green-500/30 data-active:text-green-950 dark:text-green-200 dark:hover:bg-green-500/20 dark:hover:text-green-50 dark:focus-visible:bg-green-500/20 dark:focus-visible:text-green-50 dark:focus-visible:ring-green-500/50 dark:active:bg-green-500/20 dark:active:text-green-50 dark:data-active:bg-green-800/50 dark:data-active:text-green-50",
      },
      {
        variant: "glass",
        theme: "yellow",
        class:
          "text-yellow-950 hover:bg-yellow-500/18 hover:text-yellow-950 focus-visible:bg-yellow-500/18 focus-visible:text-yellow-950 focus-visible:ring-yellow-500/50 active:bg-yellow-500/18 active:text-yellow-950 data-active:bg-yellow-500/35 data-active:text-yellow-950 dark:text-yellow-200 dark:hover:bg-yellow-500/22 dark:hover:text-yellow-50 dark:focus-visible:bg-yellow-500/22 dark:focus-visible:text-yellow-50 dark:focus-visible:ring-yellow-500/50 dark:active:bg-yellow-500/22 dark:active:text-yellow-50 dark:data-active:bg-yellow-800/50 dark:data-active:text-yellow-50",
      },
      {
        variant: "glass",
        theme: "orange",
        class:
          "text-orange-950 hover:bg-orange-500/15 hover:text-orange-950 focus-visible:bg-orange-500/15 focus-visible:text-orange-950 focus-visible:ring-orange-500/50 active:bg-orange-500/15 active:text-orange-950 data-active:bg-orange-500/30 data-active:text-orange-950 dark:text-orange-200 dark:hover:bg-orange-500/20 dark:hover:text-orange-50 dark:focus-visible:bg-orange-500/20 dark:focus-visible:text-orange-50 dark:focus-visible:ring-orange-500/50 dark:active:bg-orange-500/20 dark:active:text-orange-50 dark:data-active:bg-orange-800/50 dark:data-active:text-orange-50",
      },
      {
        variant: "glass",
        theme: "red",
        class:
          "text-red-900 hover:bg-red-500/15 hover:text-red-950 focus-visible:bg-red-500/15 focus-visible:text-red-950 focus-visible:ring-red-500/50 active:bg-red-500/15 active:text-red-950 data-active:bg-red-500/30 data-active:text-red-950 dark:text-red-200 dark:hover:bg-red-500/20 dark:hover:text-red-50 dark:focus-visible:bg-red-500/20 dark:focus-visible:text-red-50 dark:focus-visible:ring-red-500/50 dark:active:bg-red-500/20 dark:active:text-red-50 dark:data-active:bg-red-800/50 dark:data-active:text-red-50",
      },
      {
        variant: "glass",
        theme: "purple",
        class:
          "text-purple-950 hover:bg-purple-500/15 hover:text-purple-950 focus-visible:bg-purple-500/15 focus-visible:text-purple-950 focus-visible:ring-purple-500/50 active:bg-purple-500/15 active:text-purple-950 data-active:bg-purple-500/30 data-active:text-purple-950 dark:text-purple-200 dark:hover:bg-purple-500/20 dark:hover:text-purple-50 dark:focus-visible:bg-purple-500/20 dark:focus-visible:text-purple-50 dark:focus-visible:ring-purple-500/50 dark:active:bg-purple-500/20 dark:active:text-purple-50 dark:data-active:bg-purple-800/50 dark:data-active:text-purple-50",
      },
      {
        variant: "glass",
        theme: "lime",
        class:
          "text-lime-900 hover:bg-lime-500/15 hover:text-lime-950 focus-visible:bg-lime-500/15 focus-visible:text-lime-950 focus-visible:ring-lime-500/50 active:bg-lime-500/15 active:text-lime-950 data-active:bg-lime-500/30 data-active:text-lime-950 dark:text-lime-200 dark:hover:bg-lime-500/20 dark:hover:text-lime-50 dark:focus-visible:bg-lime-500/20 dark:focus-visible:text-lime-50 dark:focus-visible:ring-lime-500/50 dark:active:bg-lime-500/20 dark:active:text-lime-50 dark:data-active:bg-lime-800/50 dark:data-active:text-lime-50",
      },
      {
        variant: "glass",
        theme: "teal",
        class:
          "text-teal-900 hover:bg-teal-500/15 hover:text-teal-950 focus-visible:bg-teal-500/15 focus-visible:text-teal-950 focus-visible:ring-teal-500/50 active:bg-teal-500/15 active:text-teal-950 data-active:bg-teal-500/30 data-active:text-teal-950 dark:text-teal-200 dark:hover:bg-teal-500/20 dark:hover:text-teal-50 dark:focus-visible:bg-teal-500/20 dark:focus-visible:text-teal-50 dark:focus-visible:ring-teal-500/50 dark:active:bg-teal-500/20 dark:active:text-teal-50 dark:data-active:bg-teal-800/50 dark:data-active:text-teal-50",
      },
      {
        variant: "glass",
        theme: "indigo",
        class:
          "text-indigo-900 hover:bg-indigo-500/15 hover:text-indigo-950 focus-visible:bg-indigo-500/15 focus-visible:text-indigo-950 focus-visible:ring-indigo-500/50 active:bg-indigo-500/15 active:text-indigo-950 data-active:bg-indigo-500/30 data-active:text-indigo-950 dark:text-indigo-200 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-50 dark:focus-visible:bg-indigo-500/20 dark:focus-visible:text-indigo-50 dark:focus-visible:ring-indigo-500/50 dark:active:bg-indigo-500/20 dark:active:text-indigo-50 dark:data-active:bg-indigo-800/50 dark:data-active:text-indigo-50",
      },
      {
        variant: "glass",
        theme: "slate",
        class:
          "text-slate-900 hover:bg-slate-500/15 hover:text-slate-950 focus-visible:bg-slate-500/15 focus-visible:text-slate-950 focus-visible:ring-slate-500/50 active:bg-slate-500/15 active:text-slate-950 data-active:bg-slate-500/30 data-active:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-500/20 dark:hover:text-slate-50 dark:focus-visible:bg-slate-500/20 dark:focus-visible:text-slate-50 dark:focus-visible:ring-slate-500/50 dark:active:bg-slate-500/20 dark:active:text-slate-50 dark:data-active:bg-slate-800/50 dark:data-active:text-slate-50",
      },
      {
        variant: "glass",
        theme: "neutral",
        class:
          "text-neutral-900 hover:bg-neutral-500/15 hover:text-neutral-950 focus-visible:bg-neutral-500/15 focus-visible:text-neutral-950 focus-visible:ring-neutral-500/50 active:bg-neutral-500/15 active:text-neutral-950 data-active:bg-neutral-500/30 data-active:text-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-500/20 dark:hover:text-neutral-50 dark:focus-visible:bg-neutral-500/20 dark:focus-visible:text-neutral-50 dark:focus-visible:ring-neutral-500/50 dark:active:bg-neutral-500/20 dark:active:text-neutral-50 dark:data-active:bg-neutral-800/50 dark:data-active:text-neutral-50",
      },
      {
        variant: "glass",
        theme: "mauve",
        class:
          "text-mauve-900 hover:bg-mauve-500/15 hover:text-mauve-950 focus-visible:bg-mauve-500/15 focus-visible:text-mauve-950 focus-visible:ring-mauve-500/50 active:bg-mauve-500/15 active:text-mauve-950 data-active:bg-mauve-500/30 data-active:text-mauve-950 dark:text-mauve-200 dark:hover:bg-mauve-500/20 dark:hover:text-mauve-50 dark:focus-visible:bg-mauve-500/20 dark:focus-visible:text-mauve-50 dark:focus-visible:ring-mauve-500/50 dark:active:bg-mauve-500/20 dark:active:text-mauve-50 dark:data-active:bg-mauve-800/50 dark:data-active:text-mauve-50",
      },
      {
        variant: "glass",
        theme: "mist",
        class:
          "text-mist-900 hover:bg-mist-500/15 hover:text-mist-950 focus-visible:bg-mist-500/15 focus-visible:text-mist-950 focus-visible:ring-mist-500/50 active:bg-mist-500/15 active:text-mist-950 data-active:bg-mist-500/30 data-active:text-mist-950 dark:text-mist-200 dark:hover:bg-mist-500/20 dark:hover:text-mist-50 dark:focus-visible:bg-mist-500/20 dark:focus-visible:text-mist-50 dark:focus-visible:ring-mist-500/50 dark:active:bg-mist-500/20 dark:active:text-mist-50 dark:data-active:bg-mist-800/50 dark:data-active:text-mist-50",
      },
      {
        variant: "glass",
        theme: "olive",
        class:
          "text-olive-900 hover:bg-olive-500/15 hover:text-olive-950 focus-visible:bg-olive-500/15 focus-visible:text-olive-950 focus-visible:ring-olive-500/50 active:bg-olive-500/15 active:text-olive-950 data-active:bg-olive-500/30 data-active:text-olive-950 dark:text-olive-200 dark:hover:bg-olive-500/20 dark:hover:text-olive-50 dark:focus-visible:bg-olive-500/20 dark:focus-visible:text-olive-50 dark:focus-visible:ring-olive-500/50 dark:active:bg-olive-500/20 dark:active:text-olive-50 dark:data-active:bg-olive-800/50 dark:data-active:text-olive-50",
      },
      {
        variant: "glass",
        theme: "zinc",
        class:
          "text-zinc-900 hover:bg-zinc-500/15 hover:text-zinc-950 focus-visible:bg-zinc-500/15 focus-visible:text-zinc-950 focus-visible:ring-zinc-500/50 active:bg-zinc-500/15 active:text-zinc-950 data-active:bg-zinc-500/30 data-active:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-500/20 dark:hover:text-zinc-50 dark:focus-visible:bg-zinc-500/20 dark:focus-visible:text-zinc-50 dark:focus-visible:ring-zinc-500/50 dark:active:bg-zinc-500/20 dark:active:text-zinc-50 dark:data-active:bg-zinc-800/50 dark:data-active:text-zinc-50",
      },
    ],
    defaultVariants: {
      variant: "solid",
      theme: "default",
    },
  },
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
