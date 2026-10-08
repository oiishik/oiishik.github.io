import { type FocusEvent, type FormEvent, type KeyboardEvent, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profile } from "../config/profile";
import { BOOKING_NOT_FOUND, matchesBooking } from "../lib/booking";
import { emailDomainSuggestions } from "../lib/emailSuggestions";
import { ArrowRightIcon } from "../components/icons";
import { BrandIcon } from "../components/BrandIcon";

/** Chrome treats autocomplete="off" as "on" for email-like fields. Any other token is left alone. */
const noBrowserSuggestions = {
  autoComplete: "nope",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  "data-1p-ignore": "true",
  "data-lpignore": "true",
  "data-form-type": "other",
} as const;

function skipBrowserSuggestions(event: FocusEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  input.readOnly = true;
  window.setTimeout(() => {
    input.readOnly = false;
  }, 0);
}

export function HomePage() {
  const navigate = useNavigate();
  const [pnr, setPnr] = useState<string>(profile.pnr);
  const [email, setEmail] = useState<string>(profile.email);
  const [emailQuery, setEmailQuery] = useState<string>(profile.email);
  const [error, setError] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailActive, setEmailActive] = useState(0);
  const emailListId = useId();
  const suggestions = emailDomainSuggestions(emailQuery);
  const showSuggestions = emailOpen && suggestions.length > 0;

  function previewEmail(next: string, index: number) {
    setEmail(next);
    setEmailActive(index);
    setError("");
  }

  function chooseEmail(next: string) {
    setEmail(next);
    setEmailQuery(next);
    setError("");
    setEmailOpen(false);
  }

  function onEmailKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setEmailActive((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setEmailActive((index) => (index - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      chooseEmail(suggestions[emailActive] ?? suggestions[0]);
    } else if (event.key === "Escape") {
      setEmailOpen(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (matchesBooking(pnr, email)) {
      navigate("/booking");
      return;
    }
    setError(BOOKING_NOT_FOUND);
  }

  return (
    <div className="flex w-full flex-col">
      <section className="shrink-0 bg-hero text-left text-white">
        <div className="px-5 pt-5 pb-10 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold tracking-[0.16em] text-hero-muted sm:text-sm">
            {profile.role.toUpperCase()} · MANAGE BOOKING
          </p>
          <h1 className="mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
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
          autoComplete="off"
          className="rounded-3xl border border-line bg-card p-4 shadow-[0_16px_40px_rgba(23,21,43,0.08)] sm:p-5 dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
          noValidate
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
              value={pnr}
              {...noBrowserSuggestions}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "booking-error" : undefined}
              onFocus={skipBrowserSuggestions}
              onChange={(event) => {
                setPnr(event.target.value);
                setError("");
              }}
              className="mt-1.5 w-full rounded-xl border border-line bg-input px-4 py-2.5 text-ink uppercase"
            />
          </div>

          <div className="relative mt-4">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="traveller-contact"
              type="text"
              inputMode="email"
              value={email}
              {...noBrowserSuggestions}
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls={emailListId}
              aria-autocomplete="list"
              aria-activedescendant={showSuggestions ? `${emailListId}-${emailActive}` : undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "booking-error" : undefined}
              onFocus={skipBrowserSuggestions}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailQuery(event.target.value);
                setError("");
                setEmailActive(0);
                setEmailOpen(true);
              }}
              onKeyDown={onEmailKeyDown}
              onBlur={() => setEmailOpen(false)}
              className="mt-1.5 w-full rounded-xl border border-line bg-input px-4 py-2.5 text-ink"
            />
            {showSuggestions ? (
              <ul
                id={emailListId}
                role="listbox"
                className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-line bg-card py-1 shadow-[0_12px_30px_rgba(23,21,43,0.12)]"
              >
                {suggestions.map((option, index) => (
                  <li key={option} role="presentation">
                    <button
                      id={`${emailListId}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={index === emailActive}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        index === emailActive ? "bg-brand-soft text-ink" : "text-ink"
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => previewEmail(option, index)}
                      onClick={() => chooseEmail(option)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-btn px-4 py-3 font-semibold text-btn-text"
          >
            View Booking
            <ArrowRightIcon className="size-4" />
          </button>

          {error ? (
            <p id="booking-error" role="alert" className="mt-3 text-sm font-medium text-danger">
              {error}
            </p>
          ) : null}

          <p className="mt-2 text-xs text-muted">Your PNR is the 6-character code on your e-ticket.</p>
        </form>
      </div>
    </div>
  );
}
