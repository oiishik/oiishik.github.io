import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "../config/profile";
import { FlightStatus } from "../components/booking/FlightStatus";
import { BookingCardSkeleton } from "../components/booking/BookingSkeleton";
import { bookingCards, cardSpanClass } from "../components/booking/cards";
import { FlightDetailsCard } from "../components/booking/FlightDetailsCard";
import { CheckIcon } from "../components/icons";
import { rememberItinerary, type Itinerary } from "../lib/itinerary";
import { motionEnabled } from "../lib/motion";

const SKELETON_MS = 1000;

function CopyPnrButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.pnr);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={copied ? "Copied" : "Copy booking reference"}
      className="inline-flex items-center justify-center p-1 text-display"
    >
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <span
          aria-hidden="true"
          className="block size-3.5 bg-current"
          style={{
            maskImage: "url(/icons/copy.png)",
            WebkitMaskImage: "url(/icons/copy.png)",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      )}
    </button>
  );
}

export function BookingPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const ready = itinerary !== null;
  const cards = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ready || !motionEnabled()) return;
      gsap.from("[data-booking-card]", {
        opacity: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: "power2.out",
      });
    },
    { dependencies: [ready], scope: cards },
  );

  useEffect(() => {
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setItinerary(rememberItinerary()), reduce ? 0 : SKELETON_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <p className="text-xs font-semibold tracking-[0.16em] text-muted">BOOKING REFERENCE</p>
      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative inline-block pr-6">
              <h1 className="font-display text-4xl text-display sm:text-5xl">{profile.pnr}</h1>
              <div className="absolute top-0 right-0">
                <CopyPnrButton />
              </div>
            </div>
            <p className="inline-flex items-center gap-1 rounded-full bg-ok-bg px-3 py-1 text-sm font-semibold text-ok-ink">
              <CheckIcon className="size-4" />
              {profile.status}
            </p>
          </div>
          <p className="mt-2 text-sm text-muted">
            {profile.origin.code} → {profile.destination.code}
            {itinerary ? ` · ${itinerary.departureLabel}` : ""} · 1 {profile.passengerType}
          </p>
        </div>
      </div>

      {itinerary ? <FlightStatus itinerary={itinerary} /> : null}

      <div ref={cards} className="mt-6 grid gap-4 lg:grid-cols-5" aria-busy={!ready}>
        {bookingCards.map(({ id, span, Component }) => (
          <div key={id} className={cardSpanClass(span)}>
            {ready ? (
              <div data-booking-card>
                {id === "flight" && itinerary ? (
                  <FlightDetailsCard itinerary={itinerary} />
                ) : (
                  <Component />
                )}
              </div>
            ) : (
              <BookingCardSkeleton id={id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
