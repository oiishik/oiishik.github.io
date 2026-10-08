import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { profile } from "../config/profile";
import { ArrowRightIcon } from "../components/icons";
import { BrandIcon } from "../components/BrandIcon";

const lockedField =
  "mt-1.5 w-full cursor-default rounded-xl border border-line bg-input px-4 py-2.5 text-ink outline-none";

export function HomePage() {
  const navigate = useNavigate();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/booking");
  }

  return (
    <div className="flex w-full flex-col">
      <section className="shrink-0 bg-hero text-left text-ink">
        <div className="px-5 pt-5 pb-10 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold tracking-[0.16em] text-hero-muted sm:text-sm">
            {profile.role.toUpperCase()} · MANAGE BOOKING
          </p>
          <h1 className="font-display mt-2 max-w-3xl text-4xl text-display sm:text-6xl">
            Manage your booking
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-hero-muted sm:text-base">
            Retrieve your booking to view flight details, fare benefits and passenger
            information, or check in for your flight.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-10 w-full max-w-md px-4">
        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-line bg-card p-4 shadow-[0_16px_40px_rgba(23,21,43,0.08)] sm:p-5 dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
        >
          <h2 className="flex items-center gap-3 text-base font-semibold">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <BrandIcon src="/icons/ticket.png" />
            </span>
            Retrieve booking
          </h2>

          <div className="mt-4">
            <label htmlFor="pnr" className="text-sm font-medium">
              PNR / Booking reference
            </label>
            <input
              id="pnr"
              name="booking-reference"
              value={profile.pnr}
              readOnly
              tabIndex={-1}
              className={`font-semibold tracking-wide uppercase ${lockedField}`}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="traveller-contact"
              type="text"
              value={profile.email}
              readOnly
              tabIndex={-1}
              className={lockedField}
            />
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-btn px-4 py-3 font-semibold text-btn-text"
          >
            View Booking
            <ArrowRightIcon className="size-4" />
          </button>

          <p className="mt-2 text-xs text-muted">Your PNR is the 6-character code on your e-ticket.</p>
        </form>
      </div>
    </div>
  );
}
