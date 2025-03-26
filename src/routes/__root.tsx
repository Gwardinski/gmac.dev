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
    <div className="relative min-h-screen flex flex-col">
      <AppBackground />
      <AppLoader />
      <main className="pt-4 flex h-full min-h-screen w-full  flex-col gap-4 overflow-y-auto px-2 md:px-4">
        <AppHeader />
        <Outlet />
        <AppFooter />
        <TanStackRouterDevtools />
      </main>
    </div>
  ),
});
