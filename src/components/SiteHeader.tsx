import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { profile } from "../config/profile";
import { accountLinks } from "./AccountNav";
import { CurrentIcon, SdeMark } from "./BrandIcon";
import { MoonIcon, SunIcon } from "./icons";
import { useTheme } from "./ThemeProvider";

function AccountMenu() {
  const { pathname } = useLocation();
  const menuLinks = accountLinks(pathname).filter((link) => link.label !== "View Booking");
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={root}>
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-9 items-center justify-center rounded-md border border-header-ink/50 text-header-ink"
      >
        <CurrentIcon src="/icons/settings.png" />
      </button>
      {open ? (
        <div role="menu" className="absolute top-full right-0 z-20 mt-2 w-52 border border-line bg-card text-ink">
          {menuLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              role="menuitem"
              aria-current={link.active ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 border-b border-line px-4 py-3 text-sm font-semibold whitespace-nowrap last:border-b-0 ${
                link.active ? "text-brand" : "text-ink hover:bg-brand-soft hover:text-brand"
              }`}
            >
              <CurrentIcon src={link.icon} />
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <header className="bg-header text-header-ink">
      <div className="flex h-16 items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex min-w-0 items-center gap-3 text-header-ink">
          <SdeMark />
          <span className="min-w-0 text-sm font-semibold sm:truncate sm:text-base">{profile.role}</span>
        </Link>
        <div className="flex items-center gap-2">
          <AccountMenu />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={nextLabel}
            className="inline-flex size-9 items-center justify-center rounded-md border border-header-ink/50 text-header-ink"
          >
            {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
