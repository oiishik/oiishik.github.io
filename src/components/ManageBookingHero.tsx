import { useEffect, useState, type ReactNode } from "react";
import type { Theme } from "./ThemeProvider";
import { PlaneScene } from "./PlaneScene";

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
    <div className="grid items-center gap-6 min-[960px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="min-w-0">{children}</div>
      <div className="relative hidden h-[460px] min-[960px]:block" aria-hidden="true">
        {desktop ? (
          <PlaneScene
            theme={theme}
            className="absolute inset-[-40px_-32px_-40px_0] block h-[calc(100%+80px)] w-[calc(100%+32px)]"
          />
        ) : null}
      </div>
    </div>
  );
}
