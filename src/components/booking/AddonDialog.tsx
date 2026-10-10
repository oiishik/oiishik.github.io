import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
import { addons, type Addon } from "../../config/addons";
import { flightLabel, profile } from "../../config/profile";
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
    <article className={`flex flex-col p-4 sm:p-5 ${added ? "bg-brand/10" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{addon.title}</h3>
          <p className="mt-1 text-sm text-muted">{addon.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={added}
          className={`inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold ${
            added ? "bg-good text-white" : "border border-brand text-brand"
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
      </div>

      <p className="mt-3 text-sm">{addon.summary}</p>

      <p className="mt-3 text-sm">
        <span className="text-muted line-through">{addon.was}</span>{" "}
        <span className="font-semibold text-good">FREE</span>{" "}
        <span className="text-good">Included with your fare</span>
      </p>
      <p className="mt-1 text-xs text-muted">{addon.proof}</p>

      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
        {addon.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-between border-t border-line pt-3 text-sm font-semibold"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((value) => !value)}
      >
        How it works
        <ChevronIcon className={`size-4 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
      {open ? (
        <ul id={detailsId} className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          {addon.how.map((paragraph) => (
            <li key={paragraph}>{paragraph}</li>
          ))}
        </ul>
      ) : null}

      <p className="mt-3 text-sm">
        <span className="font-semibold">Built with</span> {addon.builtWith.join(" · ")}
      </p>

      <a
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand underline-offset-2 hover:underline"
        href={profile.resumeViewUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read more
        <span aria-hidden="true">→</span>
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2a1814]/55 sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close add-ons" onClick={onCancel} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(860px,calc(100dvh-1rem))] w-full max-w-4xl flex-col overflow-hidden rounded-t-lg bg-page sm:rounded-lg"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 id={titleId} className="text-2xl font-semibold">
              Select add-ons
            </h2>
            <p className="mt-1 text-sm text-muted">
              PNR {profile.pnr} · {flightLabel()} · Both add-ons are included with your fare
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex size-9 items-center justify-center rounded-md border border-line text-lg"
          >
            ×
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto sm:grid-cols-2 sm:divide-x sm:divide-line">
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
          <p className="text-sm">{summary}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-line px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-md bg-btn px-4 py-2 text-sm font-semibold text-btn-text"
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
