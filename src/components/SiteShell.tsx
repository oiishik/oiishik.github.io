import { AccountNav } from "./AccountNav";
import { PageTransition } from "./PageTransition";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteShell() {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-page text-ink">
      <SiteHeader />
      <AccountNav />
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
        <PageTransition />
      </main>
      <SiteFooter />
    </div>
  );
}
