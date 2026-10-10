import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ManageBookingHero } from "../components/ManageBookingHero";
import { useTheme } from "../components/ThemeProvider";
import { profile } from "../config/profile";
import { ArrowRightIcon } from "../components/icons";

const field =
  "w-full bg-transparent text-base font-semibold text-ink outline-none";

export function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/trips/${profile.pnr}`);
  }

  return (
    <div className="dot-field flex flex-1 flex-col bg-surface">
      <div className="w-full px-5 pt-10 pb-16 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
        <ManageBookingHero theme={theme}>
          <h1 className="font-display text-[clamp(3.25rem,13.5cqw,7.5rem)] leading-[0.92] text-display">
            Manage your booking
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink">
            Retrieve your booking to see flight details.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-6 flex flex-col border border-ink/25 bg-card sm:flex-row"
          >
            <label className="min-w-0 flex-1 border-b border-ink/15 px-3 py-2 sm:border-r sm:border-b-0">
              <span className="block text-[11px] text-muted">Booking reference (PNR)</span>
              <input
                id="pnr"
                name="booking-reference"
                value={profile.pnr}
                readOnly
                tabIndex={-1}
                className={`${field} uppercase tabular-nums`}
              />
            </label>
            <label className="min-w-0 flex-[1.4] border-b border-ink/15 px-3 py-2 sm:border-r sm:border-b-0">
              <span className="block text-[11px] text-muted">Email address</span>
              <input
                id="email"
                name="traveller-contact"
                type="text"
                value={profile.email}
                readOnly
                tabIndex={-1}
                className={field}
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-btn px-6 py-4 font-semibold text-btn-text"
            >
              View Booking
              <ArrowRightIcon className="size-4" />
            </button>
          </form>
          <p className="mt-3 text-sm text-ink/80">Your PNR is the 6-character code on your e-ticket.</p>
        </ManageBookingHero>
      </div>
    </div>
  );
}
