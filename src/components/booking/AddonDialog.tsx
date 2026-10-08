import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { addons, type Addon } from "../../config/addons";
import { flightLabel, profile } from "../../config/profile";
import { BrandIcon } from "../BrandIcon";
import { CheckIcon, ChevronIcon } from "../icons";
import { motionEnabled } from "../../lib/motion";

function AddonCard({
  addon,
  added,
  onToggle,
}: {
  addon: Addon;
  added: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <article className="rounded-2xl border border-line bg-card p-4">
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-3 sm:grid-cols-[auto_1fr_auto] sm:items-start">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand">
          <BrandIcon src={addon.icon} tone="on-fill" />
        </span>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={added}
          className={`inline-flex items-center justify-self-end gap-1 rounded-full px-3 py-1.5 text-sm font-semibold sm:col-start-3 sm:row-start-1 ${
            added ? "bg-brand text-btn-text" : "border border-brand text-brand"
          }`}
        >
          {added ? (
            <>
              <CheckIcon className="size-3.5" />
              Added
            </>
          ) : (
            "Add +"
          )}
        </button>
        <div className="col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
          <h3 className="font-semibold">{addon.title}</h3>
          <p className="mt-0.5 text-sm text-muted">{addon.subtitle}</p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-brand">
        <CheckIcon className="size-4" />
        Included with your fare
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-chip px-3 py-2.5">
        <p className="text-sm">
          <span className="text-muted line-through">{addon.was}</span>{" "}
          <span className="text-lg font-bold text-ok-ink">FREE</span>
        </p>
        <p className="inline-flex items-center gap-2 text-sm font-medium text-ok-ink">
          <span className="live-dot size-2 shrink-0 rounded-full bg-live" aria-hidden="true" />
          {addon.proof}
        </p>
      </div>

      <ul className="mt-3 space-y-2">
        {addon.points.map((point) => (
          <li key={point} className="flex gap-2 text-sm">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-ok-ink" />
            {point}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded-xl bg-chip px-3 py-2.5 text-sm font-semibold"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((value) => !value)}
      >
        How it works
        <ChevronIcon className={`size-4 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
      {open ? (
        <div id={detailsId} className="mt-2 space-y-2 px-1 text-sm leading-relaxed text-muted">
          {addon.how.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      <p className="mt-3 text-[11px] font-semibold tracking-[0.14em] text-muted">BUILT WITH</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {addon.builtWith.map((tool) => (
          <li key={tool} className="rounded-full bg-chip px-2.5 py-1 text-xs font-medium">
            {tool}
          </li>
        ))}
      </ul>

      <a
        className="mt-3 inline-flex text-sm font-semibold text-brand underline-offset-2 hover:underline"
        href={profile.resumeViewUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read More here.
      </a>
    </article>
  );
}

export function AddonDialog({
  selected,
  onToggle,
  onCancel,
  onConfirm,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const count = selected.length;

  useGSAP(
    () => {
      if (!panel.current || !motionEnabled()) return;
      gsap.from(panel.current, {
        opacity: 0,
        duration: 0.28,
        ease: "power2.out",
      });
    },
    { scope: panel },
  );
  const summary = count === 0 ? "No add-ons selected" : count === 1 ? "1 add-on selected" : `${count} add-ons selected`;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2a2836]/55 sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close add-ons" onClick={onCancel} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(760px,calc(100dvh-1rem))] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-header shadow-[0_24px_60px_rgba(23,21,43,0.28)] sm:rounded-3xl"
      >
        <span className="mx-auto mt-2 h-1 w-10 rounded-full bg-line sm:hidden" aria-hidden="true" />
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-semibold text-muted">
              PNR <span className="font-pnr">{profile.pnr}</span> · {flightLabel()}
            </p>
            <h2 id={titleId} className="font-display mt-1 text-3xl text-display">
              Select add-ons
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex size-9 items-center justify-center rounded-full border border-line text-lg"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto px-5 py-4">
          {addons.map((addon) => (
            <AddonCard
              key={addon.id}
              addon={addon}
              added={selected.includes(addon.id)}
              onToggle={() => onToggle(addon.id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
          <p className="text-sm text-muted">{summary}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-btn-text"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
