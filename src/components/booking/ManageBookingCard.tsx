import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { addons } from "../../config/addons";
import { profile } from "../../config/profile";
import { trackEvent } from "../../lib/goatcounter";
import { CurrentIcon } from "../BrandIcon";
import { FareBenefitsCard } from "./FareBenefitsCard";
import { PassengerDetailsCard } from "./PassengerDetailsCard";
import { AddonDialog } from "./AddonDialog";
import { ArrowRightIcon } from "../icons";

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

function Row({
  icon,
  label,
  meta,
  disabled,
  onClick,
  href,
  download,
  external,
}: {
  icon: ReactNode;
  label: string;
  meta: string;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  download?: boolean;
  external?: boolean;
}) {
  const className = `flex w-full items-center gap-3 border-b border-line py-3 text-left text-sm ${
    disabled ? "cursor-not-allowed text-muted" : "hover:text-brand"
  }`;
  const body = (
    <>
      <span className="text-muted">{icon}</span>
      <span className="flex-1 font-semibold">{label}</span>
      <span className="text-muted" aria-hidden="true">
        {meta}
      </span>
    </>
  );

  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link to={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={className}>
          {body}
          {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </Link>
      );
    }
    return (
      <a href={href} download={download || undefined} className={className}>
        {body}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled} aria-disabled={disabled || undefined}>
      {body}
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
    trackEvent("click-add-ons", "Clicked add-ons");
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

  const addedCount = confirmed.length;
  const manageMeta = addedCount > 0 ? `${addedCount} added` : `${addons.length} included`;

  return (
    <div className="grid gap-x-12 lg:grid-cols-2">
      <FareBenefitsCard />

      <section className="pt-8">
        <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <CurrentIcon src="/icons/add-on.png" />
            Add-ons
          </h2>
          <p className="text-xs text-muted">Projects</p>
        </div>
        <ul className="mt-1">
          {addons.map((addon) => {
            const added = confirmed.includes(addon.id);
            return (
              <li key={addon.id} className="border-b border-line py-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">
                    {addon.title}
                    {added ? (
                      <span className="ml-2 inline-flex items-center rounded-sm bg-good px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        Added
                      </span>
                    ) : null}
                  </p>
                  <button type="button" className="shrink-0 text-sm font-semibold text-brand" onClick={openDialog}>
                    Details →
                  </button>
                </div>
                <p className="mt-1 text-sm text-muted">{addon.summary}</p>
                <p className="mt-2 text-sm">
                  <span className="text-muted line-through">{addon.was}</span>{" "}
                  <span className="font-semibold text-good">FREE</span>{" "}
                  <span className="text-muted">Included with your fare</span>
                </p>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={openDialog}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-btn px-4 py-2.5 text-sm font-semibold text-btn-text"
        >
          {addedCount > 0 ? "Manage add-ons" : "Select add-ons"}
          <ArrowRightIcon className="size-4" />
        </button>
      </section>

      <PassengerDetailsCard />

      <section className="pt-8">
        <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <CurrentIcon src="/icons/appointment.png" />
            Manage booking
          </h2>
        </div>
        <div className="mt-1">
          <Row icon={<CurrentIcon src="/icons/transport.png" />} label="Change flight" meta="Unavailable" disabled />
          <Row icon={<CurrentIcon src="/icons/cancelled.png" />} label="Cancel flight" meta="Unavailable" disabled />
          <Row
            icon={<CurrentIcon src="/icons/add-on.png" />}
            label="Select add-ons"
            meta={`${manageMeta} ›`}
            onClick={openDialog}
          />
          <Row
            icon={<CurrentIcon src="/icons/boarding-pass.png" />}
            label="See boarding pass"
            meta="›"
            href="/boarding-pass"
            external={!mobile}
          />
          <Row
            icon={<CurrentIcon src="/icons/download.png" />}
            label="Download e-ticket"
            meta="PDF ↓"
            href={profile.resumePath}
            download
          />
          <Row
            icon={<CurrentIcon src="/icons/customer-service.png" />}
            label="Contact support"
            meta="Email ›"
            href={`mailto:${profile.email}`}
          />
        </div>
      </section>

      {open ? (
        <AddonDialog selected={draft} onToggle={toggle} onCancel={() => setOpen(false)} onConfirm={confirm} />
      ) : null}

      {toastCount > 0 ? (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-md bg-toast px-4 py-2 text-sm font-semibold text-toast-ink"
        >
          {toastCount} {toastCount === 1 ? "add-on" : "add-ons"} added to PNR {profile.pnr}
        </p>
      ) : null}
    </div>
  );
}
