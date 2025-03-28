import {
  AppBackground,
  AppFooter,
  AppHeader,
  AppLoader,
} from "@/components/layout";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="relative flex min-h-screen flex-col">
      <AppBackground />
      <AppLoader />
      <main className="mx-auto flex h-full min-h-screen w-full max-w-screen-2xl flex-col gap-4 overflow-y-auto px-2 pt-28 md:px-4">
        <AppHeader />
        <Outlet />
        <AppFooter />
        <TanStackRouterDevtools />
      </main>
    </div>
  ),
});
