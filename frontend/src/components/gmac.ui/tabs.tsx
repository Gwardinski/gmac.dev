import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { createContext, useContext } from 'react';
import type { ButtonTheme } from './button';
import { cn } from './utils';

// ------------------------------------------------------------
// COMPONENTS
// ------------------------------------------------------------

type TabsProps = Omit<TabsPrimitive.Root.Props, 'orientation'>;

/** Tab row with panels stacked below (`orientation` is fixed to horizontal). */
function Tabs({ className, ...props }: TabsProps) {
  return <TabsPrimitive.Root data-slot="tabs" orientation="horizontal" className={cn('flex w-full flex-col gap-2', className)} {...props} />;
}

const defaultTabsListStyle = { variant: 'outline' as TabsVariantOption, theme: 'gray' as ButtonTheme };

const TabsListStyleContext = createContext(defaultTabsListStyle);

function TabsList({ className, variant, theme, ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const resolvedVariant = (variant ?? 'outline') as TabsVariantOption;
  const resolvedTheme = (theme ?? 'gray') as ButtonTheme;
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
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn('flex-1 text-sm outline-none', className)} {...props} />;
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export const tabsVariantOptions = ['primary', 'outline', 'glass'] as const;
export type TabsVariantOption = (typeof tabsVariantOptions)[number];

export { buttonThemeOptions as tabsThemeOptions, type ButtonTheme as TabsTheme } from './button';

const tabsThemeClasses = {
  gray: '',
  blue: '',
  green: '',
  yellow: '',
  orange: '',
  red: '',
  purple: ''
} satisfies Record<ButtonTheme, string>;

const tabsVariantClasses = {
  primary: '',
  outline: '',
  glass: ''
} satisfies Record<TabsVariantOption, string>;

export const tabsListVariants = cva('group/tabs-list inline-flex h-auto w-fit min-h-9 flex-row items-center justify-center rounded-lg p-1 text-sm font-normal', {
  variants: {
    variant: tabsVariantClasses,
    theme: tabsThemeClasses
  },
  compoundVariants: [
    // primary — tinted track
    { variant: 'primary', theme: 'gray', class: 'gap-0.5 bg-gray-100 dark:bg-gray-800' },
    { variant: 'primary', theme: 'blue', class: 'gap-0.5 bg-blue-500/10 dark:bg-blue-950/50' },
    { variant: 'primary', theme: 'green', class: 'gap-0.5 bg-green-500/10 dark:bg-green-950/50' },
    { variant: 'primary', theme: 'yellow', class: 'gap-0.5 bg-yellow-500/15 dark:bg-yellow-950/40' },
    { variant: 'primary', theme: 'orange', class: 'gap-0.5 bg-orange-500/10 dark:bg-orange-950/50' },
    { variant: 'primary', theme: 'red', class: 'gap-0.5 bg-red-500/10 dark:bg-red-950/50' },
    { variant: 'primary', theme: 'purple', class: 'gap-0.5 bg-purple-500/10 dark:bg-purple-950/50' },
    // outline — neutral chrome; accent on active tab
    { variant: 'outline', theme: 'gray', class: 'gap-0.5 border border-gray-200 bg-transparent dark:border-gray-700' },
    { variant: 'outline', theme: 'blue', class: 'gap-0.5 border border-gray-200 bg-transparent dark:border-gray-700' },
    { variant: 'outline', theme: 'green', class: 'gap-0.5 border border-gray-200 bg-transparent dark:border-gray-700' },
    { variant: 'outline', theme: 'yellow', class: 'gap-0.5 border border-gray-200 bg-transparent dark:border-gray-700' },
    { variant: 'outline', theme: 'orange', class: 'gap-0.5 border border-gray-200 bg-transparent dark:border-gray-700' },
    { variant: 'outline', theme: 'red', class: 'gap-0.5 border border-gray-200 bg-transparent dark:border-gray-700' },
    { variant: 'outline', theme: 'purple', class: 'gap-0.5 border border-gray-200 bg-transparent dark:border-gray-700' },
    // glass
    { variant: 'glass', theme: 'gray', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-zinc-500/5 dark:bg-zinc-800/25' },
    { variant: 'glass', theme: 'blue', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-blue-500/8 dark:bg-blue-950/30' },
    { variant: 'glass', theme: 'green', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-green-500/8 dark:bg-green-950/30' },
    { variant: 'glass', theme: 'yellow', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-yellow-500/10 dark:bg-yellow-950/30' },
    { variant: 'glass', theme: 'orange', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-orange-500/8 dark:bg-orange-950/30' },
    { variant: 'glass', theme: 'red', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-red-500/8 dark:bg-red-950/30' },
    { variant: 'glass', theme: 'purple', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-purple-500/8 dark:bg-purple-950/30' }
  ],
  defaultVariants: {
    variant: 'outline',
    theme: 'gray'
  }
});

const tabsTriggerVariants = cva(
  'relative inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-sm font-normal whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: tabsVariantClasses,
      theme: tabsThemeClasses
    },
    compoundVariants: [
      // primary
      {
        variant: 'primary',
        theme: 'gray',
        class:
          'text-gray-600 hover:bg-white/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-50 data-active:bg-gray-500 data-active:text-white data-active:border-gray-500 dark:data-active:bg-gray-500 focus-visible:ring-gray-200 dark:focus-visible:ring-gray-700/40'
      },
      {
        variant: 'primary',
        theme: 'blue',
        class:
          'text-blue-900/80 hover:bg-white/70 hover:text-blue-950 dark:text-blue-200 dark:hover:bg-blue-950/40 dark:hover:text-blue-50 data-active:bg-blue-500 data-active:text-white data-active:border-blue-500 dark:data-active:bg-blue-500 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700/40'
      },
      {
        variant: 'primary',
        theme: 'green',
        class:
          'text-green-900/80 hover:bg-white/70 hover:text-green-950 dark:text-green-200 dark:hover:bg-green-950/40 dark:hover:text-green-50 data-active:bg-green-500 data-active:text-white data-active:border-green-500 dark:data-active:bg-green-500 focus-visible:ring-green-200 dark:focus-visible:ring-green-700/40'
      },
      {
        variant: 'primary',
        theme: 'yellow',
        class:
          'text-yellow-900 hover:bg-white/70 hover:text-yellow-950 dark:text-yellow-200 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-50 data-active:bg-yellow-500 data-active:text-white data-active:border-yellow-500 dark:data-active:bg-yellow-500 focus-visible:ring-yellow-200 dark:focus-visible:ring-yellow-700/40'
      },
      {
        variant: 'primary',
        theme: 'orange',
        class:
          'text-orange-900/90 hover:bg-white/70 hover:text-orange-950 dark:text-orange-200 dark:hover:bg-orange-950/40 dark:hover:text-orange-50 data-active:bg-orange-500 data-active:text-white data-active:border-orange-500 dark:data-active:bg-orange-500 focus-visible:ring-orange-200 dark:focus-visible:ring-orange-700/40'
      },
      {
        variant: 'primary',
        theme: 'red',
        class:
          'text-red-900/80 hover:bg-white/70 hover:text-red-950 dark:text-red-200 dark:hover:bg-red-950/40 dark:hover:text-red-50 data-active:bg-red-500 data-active:text-white data-active:border-red-500 dark:data-active:bg-red-500 focus-visible:ring-red-200 dark:focus-visible:ring-red-700/40'
      },
      {
        variant: 'primary',
        theme: 'purple',
        class:
          'text-purple-900/90 hover:bg-white/70 hover:text-purple-950 dark:text-purple-200 dark:hover:bg-purple-950/40 dark:hover:text-purple-50 data-active:bg-purple-500 data-active:text-white data-active:border-purple-500 dark:data-active:bg-purple-500 focus-visible:ring-purple-200 dark:focus-visible:ring-purple-700/40'
      },
      // outline
      {
        variant: 'outline',
        theme: 'gray',
        class:
          'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-50 data-active:bg-white data-active:text-gray-900 data-active:border-gray-300 data-active:shadow-sm dark:data-active:bg-gray-800 dark:data-active:text-gray-50 dark:data-active:border-gray-600 focus-visible:ring-gray-200 dark:focus-visible:ring-gray-700/40'
      },
      {
        variant: 'outline',
        theme: 'blue',
        class:
          'text-blue-700 hover:bg-blue-50 hover:text-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-100 data-active:bg-white data-active:text-blue-900 data-active:border-blue-400 data-active:shadow-sm dark:data-active:bg-gray-900 dark:data-active:text-blue-100 dark:data-active:border-blue-600 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-700/40'
      },
      {
        variant: 'outline',
        theme: 'green',
        class:
          'text-green-700 hover:bg-green-50 hover:text-green-900 dark:text-green-300 dark:hover:bg-green-950/50 dark:hover:text-green-100 data-active:bg-white data-active:text-green-900 data-active:border-green-400 data-active:shadow-sm dark:data-active:bg-gray-900 dark:data-active:text-green-100 dark:data-active:border-green-600 focus-visible:ring-green-200 dark:focus-visible:ring-green-700/40'
      },
      {
        variant: 'outline',
        theme: 'yellow',
        class:
          'text-yellow-800 hover:bg-yellow-50 hover:text-yellow-950 dark:text-yellow-300 dark:hover:bg-yellow-950/50 dark:hover:text-yellow-100 data-active:bg-white data-active:text-yellow-950 data-active:border-yellow-400 data-active:shadow-sm dark:data-active:bg-gray-900 dark:data-active:text-yellow-100 dark:data-active:border-yellow-600 focus-visible:ring-yellow-200 dark:focus-visible:ring-yellow-700/40'
      },
      {
        variant: 'outline',
        theme: 'orange',
        class:
          'text-orange-800 hover:bg-orange-50 hover:text-orange-950 dark:text-orange-300 dark:hover:bg-orange-950/50 dark:hover:text-orange-100 data-active:bg-white data-active:text-orange-950 data-active:border-orange-400 data-active:shadow-sm dark:data-active:bg-gray-900 dark:data-active:text-orange-100 dark:data-active:border-orange-600 focus-visible:ring-orange-200 dark:focus-visible:ring-orange-700/40'
      },
      {
        variant: 'outline',
        theme: 'red',
        class:
          'text-red-700 hover:bg-red-50 hover:text-red-900 dark:text-red-300 dark:hover:bg-red-950/50 dark:hover:text-red-100 data-active:bg-white data-active:text-red-900 data-active:border-red-400 data-active:shadow-sm dark:data-active:bg-gray-900 dark:data-active:text-red-100 dark:data-active:border-red-600 focus-visible:ring-red-200 dark:focus-visible:ring-red-700/40'
      },
      {
        variant: 'outline',
        theme: 'purple',
        class:
          'text-purple-800 hover:bg-purple-50 hover:text-purple-950 dark:text-purple-300 dark:hover:bg-purple-950/50 dark:hover:text-purple-100 data-active:bg-white data-active:text-purple-950 data-active:border-purple-400 data-active:shadow-sm dark:data-active:bg-gray-900 dark:data-active:text-purple-100 dark:data-active:border-purple-600 focus-visible:ring-purple-200 dark:focus-visible:ring-purple-700/40'
      },
      // glass
      {
        variant: 'glass',
        theme: 'gray',
        class:
          'text-gray-700 hover:bg-zinc-500/15 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-500/20 dark:hover:text-gray-50 data-active:bg-zinc-500/35 data-active:text-gray-900 dark:data-active:bg-zinc-700/55 dark:data-active:text-gray-50 focus-visible:ring-gray-400/60 dark:focus-visible:ring-gray-500/50'
      },
      {
        variant: 'glass',
        theme: 'blue',
        class:
          'text-blue-900 hover:bg-blue-500/15 hover:text-blue-950 dark:text-blue-200 dark:hover:bg-blue-500/20 dark:hover:text-blue-50 data-active:bg-blue-500/30 data-active:text-blue-950 dark:data-active:bg-blue-800/50 dark:data-active:text-blue-50 focus-visible:ring-blue-400/50 dark:focus-visible:ring-blue-500/40'
      },
      {
        variant: 'glass',
        theme: 'green',
        class:
          'text-green-900 hover:bg-green-500/15 hover:text-green-950 dark:text-green-200 dark:hover:bg-green-500/20 dark:hover:text-green-50 data-active:bg-green-500/30 data-active:text-green-950 dark:data-active:bg-green-800/50 dark:data-active:text-green-50 focus-visible:ring-green-400/50 dark:focus-visible:ring-green-500/40'
      },
      {
        variant: 'glass',
        theme: 'yellow',
        class:
          'text-yellow-950 hover:bg-yellow-500/18 hover:text-yellow-950 dark:text-yellow-200 dark:hover:bg-yellow-500/22 dark:hover:text-yellow-50 data-active:bg-yellow-500/35 data-active:text-yellow-950 dark:data-active:bg-yellow-800/50 dark:data-active:text-yellow-50 focus-visible:ring-yellow-400/50 dark:focus-visible:ring-yellow-500/40'
      },
      {
        variant: 'glass',
        theme: 'orange',
        class:
          'text-orange-950 hover:bg-orange-500/15 hover:text-orange-950 dark:text-orange-200 dark:hover:bg-orange-500/20 dark:hover:text-orange-50 data-active:bg-orange-500/30 data-active:text-orange-950 dark:data-active:bg-orange-800/50 dark:data-active:text-orange-50 focus-visible:ring-orange-400/50 dark:focus-visible:ring-orange-500/40'
      },
      {
        variant: 'glass',
        theme: 'red',
        class:
          'text-red-900 hover:bg-red-500/15 hover:text-red-950 dark:text-red-200 dark:hover:bg-red-500/20 dark:hover:text-red-50 data-active:bg-red-500/30 data-active:text-red-950 dark:data-active:bg-red-800/50 dark:data-active:text-red-50 focus-visible:ring-red-400/50 dark:focus-visible:ring-red-500/40'
      },
      {
        variant: 'glass',
        theme: 'purple',
        class:
          'text-purple-950 hover:bg-purple-500/15 hover:text-purple-950 dark:text-purple-200 dark:hover:bg-purple-500/20 dark:hover:text-purple-50 data-active:bg-purple-500/30 data-active:text-purple-950 dark:data-active:bg-purple-800/50 dark:data-active:text-purple-50 focus-visible:ring-purple-400/50 dark:focus-visible:ring-purple-500/40'
      }
    ],
    defaultVariants: {
      variant: 'outline',
      theme: 'gray'
    }
  }
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
