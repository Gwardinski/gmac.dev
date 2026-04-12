import { AppBackground, AppFooter, AppHeader } from '@/components/layout';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <div className="relative mx-auto flex min-h-screen max-w-screen-2xl flex-col px-2 pt-10 pb-16 md:px-4">
      <AppBackground />
      <AppHeader />
      <main className="flex h-full w-full flex-col gap-4 pt-10 sm:px-4">
        <Outlet />
      </main>
      <AppFooter />
      <TanStackRouterDevtools />
    </div>
  )
});
