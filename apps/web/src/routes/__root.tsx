import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <main className="w-full h-full">
      <div className="flex gap-2">
        <div className="w-full h-full flex flex-col gap-2 py-12">
          <Outlet />
        </div>
      </div>
    </main>
  ),
});
