import { Link } from "react-router-dom";
import { profile } from "../../config/profile";
import { BrandIcon } from "../BrandIcon";
import { HeadsetIcon } from "../icons";

const tileClass =
  "flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-chip px-3 py-4 text-center text-sm font-semibold text-ink";

function DisabledTile({ label, src }: { label: string; src: string }) {
  return (
    <button type="button" className={`${tileClass} cursor-not-allowed opacity-45`} disabled aria-disabled="true">
      <BrandIcon src={src} />
      {label}
    </button>
  );
}

export function ManageBookingCard() {
  return (
    <section className="rounded-3xl border border-line bg-card p-4 shadow-[0_10px_30px_rgba(23,21,43,0.06)] sm:p-6 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <h2 className="flex items-center gap-3 text-base font-semibold">
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <BrandIcon src="/icons/setting.png" />
        </span>
        Manage booking
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <DisabledTile label="Change Flight" src="/icons/transport.png" />
        <DisabledTile label="Cancel Flight" src="/icons/cancelled.png" />
        <Link
          to="/boarding-pass"
          target="_blank"
          rel="noopener noreferrer"
          className={`${tileClass} hover:border-brand`}
        >
          <BrandIcon src="/icons/boarding-pass.png" />
          Web Check-in
          <span className="sr-only"> (opens in a new tab)</span>
        </Link>
        <a className={`${tileClass} hover:border-brand`} href={profile.resumePath} download>
          <BrandIcon src="/icons/ticket.png" />
          Download E-ticket
        </a>
        <a className={`${tileClass} hover:border-brand max-lg:col-span-2 lg:col-span-1`} href={`mailto:${profile.email}`}>
          <HeadsetIcon className="size-5 text-brand" />
          Contact Support
        </a>
      </div>
    </section>
  );
}
