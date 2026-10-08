import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addons } from "../../config/addons";
import { profile } from "../../config/profile";
import { BrandIcon } from "../BrandIcon";
import { CheckIcon } from "../icons";
import { AddonDialog } from "./AddonDialog";

const tileClass =
  "relative flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-chip px-3 py-4 text-center text-sm font-semibold text-ink";

const MOBILE_LAYOUT = "(max-width: 639px)";

function useMobileLayout() {
  const [mobile, setMobile] = useState(
    () => typeof window.matchMedia === "function" && window.matchMedia(MOBILE_LAYOUT).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(MOBILE_LAYOUT);
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return mobile;
}

function DisabledTile({ label, src }: { label: string; src: string }) {
  return (
    <button type="button" className={`${tileClass} cursor-not-allowed opacity-45`} disabled aria-disabled="true">
      <BrandIcon src={src} />
      {label}
    </button>
  );
}

export function ManageBookingCard() {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [draft, setDraft] = useState<string[]>([]);
  const [toastCount, setToastCount] = useState(0);
  const mobile = useMobileLayout();

  useEffect(() => {
    if (toastCount === 0) return;
    const timer = window.setTimeout(() => setToastCount(0), 4000);
    return () => window.clearTimeout(timer);
  }, [toastCount]);

  function openDialog() {
    setDraft(confirmed);
    setOpen(true);
  }

  function toggle(id: string) {
    setDraft((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function confirm() {
    setConfirmed(draft);
    setOpen(false);
    setToastCount(draft.length);
  }

  const chosen = addons.filter((addon) => confirmed.includes(addon.id));

  return (
    <section className="rounded-3xl border border-line bg-card p-4 shadow-[0_10px_30px_rgba(23,21,43,0.06)] sm:p-6 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <h2 className="flex items-center gap-3 text-base font-semibold">
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <BrandIcon src="/icons/setting.png" />
        </span>
        Manage booking
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <DisabledTile label="Change Flight" src="/icons/transport.png" />
        <DisabledTile label="Cancel Flight" src="/icons/cancelled.png" />
        <button type="button" className={`${tileClass} hover:border-brand`} onClick={openDialog}>
          {chosen.length > 0 ? (
            <span className="absolute top-2 right-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-btn-text">
              {chosen.length} added
            </span>
          ) : null}
          <BrandIcon src="/icons/add-on.png" />
          Select Add-on
        </button>
        <Link
          to="/boarding-pass"
          target={mobile ? undefined : "_blank"}
          rel={mobile ? undefined : "noopener noreferrer"}
          className={`${tileClass} hover:border-brand`}
        >
          <BrandIcon src="/icons/boarding-pass.png" />
          See Boarding Pass
          {mobile ? null : <span className="sr-only"> (opens in a new tab)</span>}
        </Link>
        <a className={`${tileClass} hover:border-brand`} href={profile.resumePath} download>
          <BrandIcon src="/icons/ticket.png" />
          Download E-ticket
        </a>
        <a className={`${tileClass} hover:border-brand`} href={`mailto:${profile.email}`}>
          <BrandIcon src="/icons/customer-service.png" />
          Contact Support
        </a>
      </div>

      {chosen.length > 0 ? (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted">ADD-ONS ON THIS BOOKING</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {chosen.map((addon) => (
              <li
                key={addon.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-ok-bg px-3 py-1 text-sm font-medium text-ok-ink"
              >
                <CheckIcon className="size-3.5" />
                {addon.title}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {open ? (
        <AddonDialog selected={draft} onToggle={toggle} onCancel={() => setOpen(false)} onConfirm={confirm} />
      ) : null}

      {toastCount > 0 ? (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-toast px-4 py-2.5 text-sm font-medium text-toast-ink shadow-lg"
        >
          <span className="live-dot size-2 rounded-full bg-live" aria-hidden="true" />
          {toastCount} {toastCount === 1 ? "add-on" : "add-ons"} added to {profile.pnr}
        </p>
      ) : null}
    </section>
  );
}
