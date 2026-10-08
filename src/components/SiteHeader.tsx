import { Link } from "react-router-dom";
import { profile } from "../config/profile";
import { SdeMark } from "./BrandIcon";
import { MoonIcon, SunIcon } from "./icons";
import { useTheme } from "./ThemeProvider";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <header className="border-b border-line bg-header">
      <div className="flex h-16 items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 rounded-lg text-ink"
        >
          <SdeMark />
          <span className="min-w-0 text-sm font-bold tracking-tight sm:truncate sm:text-base">{profile.role}</span>
          <span className="hidden h-5 w-px shrink-0 bg-line sm:block" aria-hidden="true" />
          <span className="hidden truncate text-sm font-medium text-muted sm:inline">Manage Booking</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={nextLabel}
          className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-card text-ink"
        >
          {theme === "dark" ? (
            <SunIcon className="size-5" />
          ) : (
            <MoonIcon className="size-5" />
          )}
        </button>
      </div>
    </header>
  );
}
