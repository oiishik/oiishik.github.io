import { useEffect, useState, type ReactNode } from "react";
import type { Theme } from "./ThemeProvider";
import { CabinWindow } from "./CabinWindow";

const desktopQuery = "(min-width: 960px)";

function desktopViewport() {
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia(desktopQuery).matches;
}

export function ManageBookingHero({ theme, children }: { theme: Theme; children: ReactNode }) {
  const [desktop, setDesktop] = useState(desktopViewport);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(desktopQuery);
    const onChange = () => setDesktop(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="grid w-full items-center gap-6 min-[960px]:grid-cols-[minmax(0,1.65fr)_minmax(0,1.46fr)] min-[960px]:gap-x-[clamp(1.75rem,4vw,4rem)]">
      <div className="@container min-w-0">{children}</div>
      <div className="hidden min-w-0 min-[960px]:block" aria-hidden="true">
        <div className="relative ml-[clamp(1.5rem,3.5vw,4.5rem)] aspect-[400/520] w-[min(68%,calc((100dvh-17rem)*400/520))]">
          <div className="absolute inset-0">{desktop ? <CabinWindow theme={theme} /> : null}</div>
        </div>
      </div>
    </div>
  );
}
