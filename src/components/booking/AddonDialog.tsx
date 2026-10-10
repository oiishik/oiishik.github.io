import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { addons, type Addon } from "../../config/addons";
import { profile } from "../../config/profile";
import { CurrentIcon } from "../BrandIcon";
import { ArrowRightIcon, CheckIcon, ChevronIcon, PlusIcon } from "../icons";

function AddonCard({
  addon,
  added,
  canAdd,
  expanded,
  onExpand,
  onToggle,
}: {
  addon: Addon;
  added: boolean;
  canAdd: boolean;
  expanded: boolean;
  onExpand: (open: boolean) => void;
  onToggle: () => void;
}) {
  const label = added ? `Added: remove ${addon.title}` : `Add ${addon.title}`;

  return (
    <article className={`border-b border-line px-5 py-5 last:border-b-0 min-[720px]:px-7 min-[720px]:py-6 ${added ? "bg-brand-soft" : ""}`}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 min-[521px]:grid-cols-[auto_minmax(0,1fr)_auto]">
        <span className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-page text-brand">
          <CurrentIcon src={addon.icon} className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug">{addon.title}</h3>
          <p className="mt-1 text-[15px] font-medium text-muted">{addon.summary}</p>
          <p className="mt-2 flex items-baseline gap-2 text-[13px]">
            <s className="font-semibold text-muted decoration-2">
              <span className="sr-only">Was </span>
              {addon.was}
            </s>
            <strong className="font-semibold text-good">
              <span className="sr-only">, now </span>
              Free
            </strong>
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          disabled={!canAdd}
          aria-pressed={added}
          aria-label={label}
          className={`col-start-2 mt-2.5 inline-flex min-h-10 items-center gap-1.5 justify-self-start rounded-sm border-2 px-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 min-[521px]:col-start-3 min-[521px]:row-start-1 min-[521px]:mt-0 ${
            added ? "border-good bg-good text-white dark:text-page" : "border-brand bg-transparent text-brand enabled:hover:bg-brand-soft"
          }`}
        >
          {added ? (
            <>
              Added
              <CheckIcon className="size-4" />
            </>
          ) : (
            <>
              Add
              <PlusIcon className="size-4" />
            </>
          )}
        </button>
      </div>

      <details
        className="group mt-3 ml-14"
        open={expanded}
        onToggle={(event) => {
          onExpand(event.currentTarget.open);
        }}
      >
        <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1 text-sm font-bold text-brand hover:underline [&::-webkit-details-marker]:hidden">
          How it works
          <ChevronIcon className="size-4 rotate-180 transition-transform group-open:rotate-0" />
        </summary>
        <div className="mt-1.5 border-l-2 border-line py-1.5 pl-4">
          <p className="text-sm font-semibold">{addon.subtitle}</p>
          <h4 className="mt-3.5 mb-1.5 text-[13px] font-semibold text-muted">What you get</h4>
          <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed">
            {addon.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <h4 className="mt-3.5 mb-1.5 text-[13px] font-semibold text-muted">Under the hood</h4>
          <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed">
            {addon.how.map((paragraph) => (
              <li key={paragraph}>{paragraph}</li>
            ))}
          </ul>
          <h4 className="mt-3.5 mb-1.5 text-[13px] font-semibold text-muted">Built with</h4>
          <p className="flex flex-wrap gap-1.5">
            {addon.builtWith.map((name) => (
              <span key={name} className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold">
                {name}
              </span>
            ))}
          </p>
          <a
            className="mt-2.5 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand underline-offset-2 hover:underline"
            href={profile.resumeViewUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read more
            <ArrowRightIcon className="size-4" />
            <span className="sr-only"> about {addon.title} in the resume (opens in a new tab)</span>
          </a>
        </div>
      </details>
    </article>
  );
}

export function AddonDialog({
  selected,
  canAdd,
  onToggle,
  onCancel,
  onConfirm,
}: {
  selected: string[];
  canAdd: boolean;
  onToggle: (id: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const onCancelRef = useRef(onCancel);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const count = selected.length;
  const summary = count === 0 ? "No add-ons selected" : count === 1 ? "1 add-on selected" : `${count} add-ons selected`;

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    title.current?.focus({ preventScroll: true });

    function focusable() {
      const root = panel.current;
      if (!root) return [];
      return [...root.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], summary, [tabindex='-1']")].filter(
        (element) => {
          if (element.closest("[hidden]")) return false;
          const details = element.closest("details");
          if (details && !details.open && !element.closest("summary")) return false;
          return true;
        },
      );
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancelRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <div
      className="addon-overlay fixed inset-0 z-50 flex items-end justify-center bg-[#140a08]/60 min-[720px]:items-center min-[720px]:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="addon-sheet relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[10px] bg-page text-ink min-[720px]:max-h-[calc(100vh-48px)] min-[720px]:max-w-[680px] min-[720px]:rounded-lg"
      >
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line min-[720px]:hidden" aria-hidden="true" />
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-5 py-3.5 min-[720px]:px-7 min-[720px]:pt-5 min-[720px]:pb-4">
          <div>
            <h2 id={titleId} ref={title} tabIndex={-1} className="text-[26px] font-semibold tracking-tight outline-none">
              Select add-ons
            </h2>
            <p id={descriptionId} className="mt-0.5 text-sm font-semibold text-muted">
              Both are included with your fare
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close add-ons"
            className="inline-flex size-11 items-center justify-center rounded-sm border border-line text-lg"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {addons.map((addon) => (
            <AddonCard
              key={addon.id}
              addon={addon}
              added={selected.includes(addon.id)}
              canAdd={canAdd}
              expanded={expandedId === addon.id}
              onExpand={(open) =>
                setExpandedId((current) => {
                  if (open) return addon.id;
                  return current === addon.id ? null : current;
                })
              }
              onToggle={() => onToggle(addon.id)}
            />
          ))}
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2.5 border-t border-line px-5 py-3.5 min-[720px]:px-7 min-[720px]:py-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-muted" aria-live="polite">
              {summary}
            </p>
            {canAdd ? null : (
              <p className="mt-0.5 text-xs text-muted">Add-ons can only be added before takeoff.</p>
            )}
          </div>
          <div className="flex w-full gap-2.5 min-[720px]:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-12 flex-1 rounded-sm border border-ink px-5 text-[15px] font-bold min-[720px]:min-w-[132px] min-[720px]:flex-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={count === 0 || !canAdd}
              className="min-h-12 flex-1 rounded-sm bg-btn px-5 text-[15px] font-bold text-btn-text disabled:cursor-not-allowed disabled:opacity-40 min-[720px]:min-w-[132px] min-[720px]:flex-none"
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
