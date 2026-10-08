import { Outlet } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteShell() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-surface text-ink">
      <SiteHeader />
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
