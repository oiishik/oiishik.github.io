import { Link } from "react-router-dom";
import { profile } from "../config/profile";
import { SdeMark } from "./BrandIcon";
import { MoonIcon, SunIcon } from "./icons";
import { useTheme } from "./ThemeProvider";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <header className="bg-header text-header-ink">
      <div className="flex h-16 items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex min-w-0 items-center gap-3 text-header-ink">
          <SdeMark />
          <span className="min-w-0 text-sm font-semibold sm:truncate sm:text-base">{profile.role}</span>
          <span className="hidden h-5 w-px shrink-0 bg-header-ink/40 sm:block" aria-hidden="true" />
          <span className="hidden truncate text-sm text-header-ink/80 sm:inline">Manage Booking</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={nextLabel}
          className="inline-flex size-9 items-center justify-center rounded-md border border-header-ink/50 text-header-ink"
        >
          {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
        </button>
      </div>
    </header>
  );
}
