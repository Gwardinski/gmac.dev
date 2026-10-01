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
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn('flex-1 outline-none flex flex-col gap-8', className)} {...props} />;
}

// ------------------------------------------------------------
// THEMING
// ------------------------------------------------------------

export const tabsVariantOptions = ['solid', 'outline', 'glass'] as const;
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
  solid: '',
  outline: '',
  glass: ''
} satisfies Record<TabsVariantOption, string>;

export const tabsListVariants = cva('group/tabs-list inline-flex h-auto w-fit min-h-9 flex-row items-center justify-center rounded-full p-1 text-sm font-normal', {
  variants: {
    variant: tabsVariantClasses,
    theme: tabsThemeClasses
  },
  compoundVariants: [
    // solid — tinted track
    { variant: 'solid', theme: 'gray', class: 'gap-0.5 bg-gray-200 dark:bg-gray-800' },
    { variant: 'solid', theme: 'blue', class: 'gap-0.5 bg-blue-100 dark:bg-blue-950' },
    { variant: 'solid', theme: 'green', class: 'gap-0.5 bg-green-100 dark:bg-green-950' },
    { variant: 'solid', theme: 'yellow', class: 'gap-0.5 bg-yellow-100 dark:bg-yellow-950' },
    { variant: 'solid', theme: 'orange', class: 'gap-0.5 bg-orange-100 dark:bg-orange-950' },
    { variant: 'solid', theme: 'red', class: 'gap-0.5 bg-red-100 dark:bg-red-950' },
    { variant: 'solid', theme: 'purple', class: 'gap-0.5 bg-purple-100 dark:bg-purple-950' },
    // outline — themed container border; accent on active tab
    { variant: 'outline', theme: 'gray', class: 'gap-0.5 border border-gray-500 bg-transparent dark:border-gray-400' },
    { variant: 'outline', theme: 'blue', class: 'gap-0.5 border border-blue-600 bg-transparent dark:border-blue-400' },
    { variant: 'outline', theme: 'green', class: 'gap-0.5 border border-green-600 bg-transparent dark:border-green-400' },
    { variant: 'outline', theme: 'yellow', class: 'gap-0.5 border border-yellow-600 bg-transparent dark:border-yellow-400' },
    { variant: 'outline', theme: 'orange', class: 'gap-0.5 border border-orange-600 bg-transparent dark:border-orange-400' },
    { variant: 'outline', theme: 'red', class: 'gap-0.5 border border-red-600 bg-transparent dark:border-red-400' },
    { variant: 'outline', theme: 'purple', class: 'gap-0.5 border border-purple-600 bg-transparent dark:border-purple-400' },
    // glass
    { variant: 'glass', theme: 'gray', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-gray-500/5 dark:bg-gray-800/25' },
    { variant: 'glass', theme: 'blue', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-blue-500/8 dark:bg-blue-950/30' },
    { variant: 'glass', theme: 'green', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-green-500/8 dark:bg-green-950/30' },
    { variant: 'glass', theme: 'yellow', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-yellow-500/10 dark:bg-yellow-950/30' },
    { variant: 'glass', theme: 'orange', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-orange-500/8 dark:bg-orange-950/30' },
    { variant: 'glass', theme: 'red', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-red-500/8 dark:bg-red-950/30' },
    { variant: 'glass', theme: 'purple', class: 'gap-0.5 backdrop-blur-sm glass-border dark:dark-glass-border bg-purple-500/8 dark:bg-purple-950/30' }
  ],
  defaultVariants: {
    variant: 'solid',
    theme: 'gray'
  }
});

const tabsTriggerVariants = cva(
  'relative inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-normal whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: tabsVariantClasses,
      theme: tabsThemeClasses
    },
    compoundVariants: [
      // solid
      {
        variant: 'solid',
        theme: 'gray',
        class:
          'text-gray-600 not-data-active:hover:bg-gray-300 not-data-active:focus-visible:bg-gray-300 not-data-active:active:bg-gray-300 hover:text-gray-900 focus-visible:text-gray-900 active:text-gray-900 dark:text-white dark:not-data-active:hover:bg-gray-700 dark:not-data-active:focus-visible:bg-gray-700 dark:not-data-active:active:bg-gray-700 dark:hover:text-gray-50 dark:focus-visible:text-gray-50 dark:active:text-gray-50 data-active:bg-gray-500 data-active:text-white data-active:border-gray-500 dark:data-active:bg-gray-600 focus-visible:ring-gray-500/50 dark:focus-visible:ring-gray-500/50'
      },
      {
        variant: 'solid',
        theme: 'blue',
        class:
          'text-blue-900 not-data-active:hover:bg-blue-200 not-data-active:focus-visible:bg-blue-200 not-data-active:active:bg-blue-200 hover:text-blue-950 focus-visible:text-blue-950 active:text-blue-950 dark:text-blue-200 dark:not-data-active:hover:bg-blue-900 dark:not-data-active:focus-visible:bg-blue-900 dark:not-data-active:active:bg-blue-900 dark:hover:text-blue-50 dark:focus-visible:text-blue-50 dark:active:text-blue-50 data-active:bg-blue-500 data-active:text-white data-active:border-blue-500 dark:data-active:bg-blue-600 focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50'
      },
      {
        variant: 'solid',
        theme: 'green',
        class:
          'text-green-900 not-data-active:hover:bg-green-200 not-data-active:focus-visible:bg-green-200 not-data-active:active:bg-green-200 hover:text-green-950 focus-visible:text-green-950 active:text-green-950 dark:text-green-200 dark:not-data-active:hover:bg-green-900 dark:not-data-active:focus-visible:bg-green-900 dark:not-data-active:active:bg-green-900 dark:hover:text-green-50 dark:focus-visible:text-green-50 dark:active:text-green-50 data-active:bg-green-500 data-active:text-white data-active:border-green-500 dark:data-active:bg-green-600 focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50'
      },
      {
        variant: 'solid',
        theme: 'yellow',
        class:
          'text-yellow-900 not-data-active:hover:bg-yellow-200 not-data-active:focus-visible:bg-yellow-200 not-data-active:active:bg-yellow-200 hover:text-yellow-950 focus-visible:text-yellow-950 active:text-yellow-950 dark:text-yellow-200 dark:not-data-active:hover:bg-yellow-900 dark:not-data-active:focus-visible:bg-yellow-900 dark:not-data-active:active:bg-yellow-900 dark:hover:text-yellow-50 dark:focus-visible:text-yellow-50 dark:active:text-yellow-50 data-active:bg-yellow-500 data-active:text-white data-active:border-yellow-500 dark:data-active:bg-yellow-600 focus-visible:ring-yellow-500/50 dark:focus-visible:ring-yellow-500/50'
      },
      {
        variant: 'solid',
        theme: 'orange',
        class:
          'text-orange-900 not-data-active:hover:bg-orange-200 not-data-active:focus-visible:bg-orange-200 not-data-active:active:bg-orange-200 hover:text-orange-950 focus-visible:text-orange-950 active:text-orange-950 dark:text-orange-200 dark:not-data-active:hover:bg-orange-900 dark:not-data-active:focus-visible:bg-orange-900 dark:not-data-active:active:bg-orange-900 dark:hover:text-orange-50 dark:focus-visible:text-orange-50 dark:active:text-orange-50 data-active:bg-orange-500 data-active:text-white data-active:border-orange-500 dark:data-active:bg-orange-600 focus-visible:ring-orange-500/50 dark:focus-visible:ring-orange-500/50'
      },
      {
        variant: 'solid',
        theme: 'red',
        class:
          'text-red-900 not-data-active:hover:bg-red-200 not-data-active:focus-visible:bg-red-200 not-data-active:active:bg-red-200 hover:text-red-950 focus-visible:text-red-950 active:text-red-950 dark:text-red-200 dark:not-data-active:hover:bg-red-900 dark:not-data-active:focus-visible:bg-red-900 dark:not-data-active:active:bg-red-900 dark:hover:text-red-50 dark:focus-visible:text-red-50 dark:active:text-red-50 data-active:bg-red-500 data-active:text-white data-active:border-red-500 dark:data-active:bg-red-600 focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/50'
      },
      {
        variant: 'solid',
        theme: 'purple',
        class:
          'text-purple-900 not-data-active:hover:bg-purple-200 not-data-active:focus-visible:bg-purple-200 not-data-active:active:bg-purple-200 hover:text-purple-950 focus-visible:text-purple-950 active:text-purple-950 dark:text-purple-200 dark:not-data-active:hover:bg-purple-900 dark:not-data-active:focus-visible:bg-purple-900 dark:not-data-active:active:bg-purple-900 dark:hover:text-purple-50 dark:focus-visible:text-purple-50 dark:active:text-purple-50 data-active:bg-purple-500 data-active:text-white data-active:border-purple-500 dark:data-active:bg-purple-600 focus-visible:ring-purple-500/50 dark:focus-visible:ring-purple-500/50'
      },
      // outline
      {
        variant: 'outline',
        theme: 'gray',
        class:
          'text-gray-500 not-data-active:hover:border-gray-500/40 not-data-active:focus-visible:border-gray-500/40 not-data-active:active:border-gray-500/40 hover:text-gray-700 focus-visible:text-gray-700 active:text-gray-700 dark:text-gray-400 dark:not-data-active:hover:border-gray-400/40 dark:not-data-active:focus-visible:border-gray-400/40 dark:not-data-active:active:border-gray-400/40 dark:hover:text-gray-200 dark:focus-visible:text-gray-200 dark:active:text-gray-200 data-active:border-gray-500 data-active:shadow-sm dark:data-active:border-gray-400 focus-visible:ring-gray-500/50 dark:focus-visible:ring-gray-400/50'
      },
      {
        variant: 'outline',
        theme: 'blue',
        class:
          'text-blue-600 not-data-active:hover:border-blue-600/40 not-data-active:focus-visible:border-blue-600/40 not-data-active:active:border-blue-600/40 hover:text-blue-800 focus-visible:text-blue-800 active:text-blue-800 dark:text-blue-400 dark:not-data-active:hover:border-blue-400/40 dark:not-data-active:focus-visible:border-blue-400/40 dark:not-data-active:active:border-blue-400/40 dark:hover:text-blue-200 dark:focus-visible:text-blue-200 dark:active:text-blue-200 data-active:border-blue-600 data-active:shadow-sm dark:data-active:border-blue-400 focus-visible:ring-blue-600/50 dark:focus-visible:ring-blue-400/50'
      },
      {
        variant: 'outline',
        theme: 'green',
        class:
          'text-green-600 not-data-active:hover:border-green-600/40 not-data-active:focus-visible:border-green-600/40 not-data-active:active:border-green-600/40 hover:text-green-800 focus-visible:text-green-800 active:text-green-800 dark:text-green-400 dark:not-data-active:hover:border-green-400/40 dark:not-data-active:focus-visible:border-green-400/40 dark:not-data-active:active:border-green-400/40 dark:hover:text-green-200 dark:focus-visible:text-green-200 dark:active:text-green-200 data-active:border-green-600 data-active:shadow-sm dark:data-active:border-green-400 focus-visible:ring-green-600/50 dark:focus-visible:ring-green-400/50'
      },
      {
        variant: 'outline',
        theme: 'yellow',
        class:
          'text-yellow-600 not-data-active:hover:border-yellow-600/40 not-data-active:focus-visible:border-yellow-600/40 not-data-active:active:border-yellow-600/40 hover:text-yellow-800 focus-visible:text-yellow-800 active:text-yellow-800 dark:text-yellow-400 dark:not-data-active:hover:border-yellow-400/40 dark:not-data-active:focus-visible:border-yellow-400/40 dark:not-data-active:active:border-yellow-400/40 dark:hover:text-yellow-200 dark:focus-visible:text-yellow-200 dark:active:text-yellow-200 data-active:border-yellow-600 data-active:shadow-sm dark:data-active:border-yellow-400 focus-visible:ring-yellow-600/50 dark:focus-visible:ring-yellow-400/50'
      },
      {
        variant: 'outline',
        theme: 'orange',
        class:
          'text-orange-600 not-data-active:hover:border-orange-600/40 not-data-active:focus-visible:border-orange-600/40 not-data-active:active:border-orange-600/40 hover:text-orange-800 focus-visible:text-orange-800 active:text-orange-800 dark:text-orange-400 dark:not-data-active:hover:border-orange-400/40 dark:not-data-active:focus-visible:border-orange-400/40 dark:not-data-active:active:border-orange-400/40 dark:hover:text-orange-200 dark:focus-visible:text-orange-200 dark:active:text-orange-200 data-active:border-orange-600 data-active:shadow-sm dark:data-active:border-orange-400 focus-visible:ring-orange-600/50 dark:focus-visible:ring-orange-400/50'
      },
      {
        variant: 'outline',
        theme: 'red',
        class:
          'text-red-600 not-data-active:hover:border-red-600/40 not-data-active:focus-visible:border-red-600/40 not-data-active:active:border-red-600/40 hover:text-red-800 focus-visible:text-red-800 active:text-red-800 dark:text-red-400 dark:not-data-active:hover:border-red-400/40 dark:not-data-active:focus-visible:border-red-400/40 dark:not-data-active:active:border-red-400/40 dark:hover:text-red-200 dark:focus-visible:text-red-200 dark:active:text-red-200 data-active:border-red-600 data-active:shadow-sm dark:data-active:border-red-400 focus-visible:ring-red-600/50 dark:focus-visible:ring-red-400/50'
      },
      {
        variant: 'outline',
        theme: 'purple',
        class:
          'text-purple-600 not-data-active:hover:border-purple-600/40 not-data-active:focus-visible:border-purple-600/40 not-data-active:active:border-purple-600/40 hover:text-purple-800 focus-visible:text-purple-800 active:text-purple-800 dark:text-purple-400 dark:not-data-active:hover:border-purple-400/40 dark:not-data-active:focus-visible:border-purple-400/40 dark:not-data-active:active:border-purple-400/40 dark:hover:text-purple-200 dark:focus-visible:text-purple-200 dark:active:text-purple-200 data-active:border-purple-600 data-active:shadow-sm dark:data-active:border-purple-400 focus-visible:ring-purple-600/50 dark:focus-visible:ring-purple-400/50'
      },
      // glass
      {
        variant: 'glass',
        theme: 'gray',
        class:
          'text-gray-700 hover:bg-gray-500/15 focus-visible:bg-gray-500/15 active:bg-gray-500/15 hover:text-gray-900 focus-visible:text-gray-900 active:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-500/20 dark:focus-visible:bg-gray-500/20 dark:active:bg-gray-500/20 dark:hover:text-gray-50 dark:focus-visible:text-gray-50 dark:active:text-gray-50 data-active:bg-gray-500/35 data-active:text-gray-900 dark:data-active:bg-gray-700/55 dark:data-active:text-gray-50 focus-visible:ring-gray-500/50 dark:focus-visible:ring-gray-500/50'
      },
      {
        variant: 'glass',
        theme: 'blue',
        class:
          'text-blue-900 hover:bg-blue-500/15 focus-visible:bg-blue-500/15 active:bg-blue-500/15 hover:text-blue-950 focus-visible:text-blue-950 active:text-blue-950 dark:text-blue-200 dark:hover:bg-blue-500/20 dark:focus-visible:bg-blue-500/20 dark:active:bg-blue-500/20 dark:hover:text-blue-50 dark:focus-visible:text-blue-50 dark:active:text-blue-50 data-active:bg-blue-500/30 data-active:text-blue-950 dark:data-active:bg-blue-800/50 dark:data-active:text-blue-50 focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50'
      },
      {
        variant: 'glass',
        theme: 'green',
        class:
          'text-green-900 hover:bg-green-500/15 focus-visible:bg-green-500/15 active:bg-green-500/15 hover:text-green-950 focus-visible:text-green-950 active:text-green-950 dark:text-green-200 dark:hover:bg-green-500/20 dark:focus-visible:bg-green-500/20 dark:active:bg-green-500/20 dark:hover:text-green-50 dark:focus-visible:text-green-50 dark:active:text-green-50 data-active:bg-green-500/30 data-active:text-green-950 dark:data-active:bg-green-800/50 dark:data-active:text-green-50 focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50'
      },
      {
        variant: 'glass',
        theme: 'yellow',
        class:
          'text-yellow-950 hover:bg-yellow-500/18 focus-visible:bg-yellow-500/18 active:bg-yellow-500/18 hover:text-yellow-950 focus-visible:text-yellow-950 active:text-yellow-950 dark:text-yellow-200 dark:hover:bg-yellow-500/22 dark:focus-visible:bg-yellow-500/22 dark:active:bg-yellow-500/22 dark:hover:text-yellow-50 dark:focus-visible:text-yellow-50 dark:active:text-yellow-50 data-active:bg-yellow-500/35 data-active:text-yellow-950 dark:data-active:bg-yellow-800/50 dark:data-active:text-yellow-50 focus-visible:ring-yellow-500/50 dark:focus-visible:ring-yellow-500/50'
      },
      {
        variant: 'glass',
        theme: 'orange',
        class:
          'text-orange-950 hover:bg-orange-500/15 focus-visible:bg-orange-500/15 active:bg-orange-500/15 hover:text-orange-950 focus-visible:text-orange-950 active:text-orange-950 dark:text-orange-200 dark:hover:bg-orange-500/20 dark:focus-visible:bg-orange-500/20 dark:active:bg-orange-500/20 dark:hover:text-orange-50 dark:focus-visible:text-orange-50 dark:active:text-orange-50 data-active:bg-orange-500/30 data-active:text-orange-950 dark:data-active:bg-orange-800/50 dark:data-active:text-orange-50 focus-visible:ring-orange-500/50 dark:focus-visible:ring-orange-500/50'
      },
      {
        variant: 'glass',
        theme: 'red',
        class:
          'text-red-900 hover:bg-red-500/15 focus-visible:bg-red-500/15 active:bg-red-500/15 hover:text-red-950 focus-visible:text-red-950 active:text-red-950 dark:text-red-200 dark:hover:bg-red-500/20 dark:focus-visible:bg-red-500/20 dark:active:bg-red-500/20 dark:hover:text-red-50 dark:focus-visible:text-red-50 dark:active:text-red-50 data-active:bg-red-500/30 data-active:text-red-950 dark:data-active:bg-red-800/50 dark:data-active:text-red-50 focus-visible:ring-red-500/50 dark:focus-visible:ring-red-500/50'
      },
      {
        variant: 'glass',
        theme: 'purple',
        class:
          'text-purple-950 hover:bg-purple-500/15 focus-visible:bg-purple-500/15 active:bg-purple-500/15 hover:text-purple-950 focus-visible:text-purple-950 active:text-purple-950 dark:text-purple-200 dark:hover:bg-purple-500/20 dark:focus-visible:bg-purple-500/20 dark:active:bg-purple-500/20 dark:hover:text-purple-50 dark:focus-visible:text-purple-50 dark:active:text-purple-50 data-active:bg-purple-500/30 data-active:text-purple-950 dark:data-active:bg-purple-800/50 dark:data-active:text-purple-50 focus-visible:ring-purple-500/50 dark:focus-visible:ring-purple-500/50'
      }
    ],
    defaultVariants: {
      variant: 'solid',
      theme: 'gray'
    }
  }
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
