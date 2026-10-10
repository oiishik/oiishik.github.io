import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
import { profile } from "../config/profile";
import { FlightStatus } from "../components/booking/FlightStatus";
import { BookingCardSkeleton } from "../components/booking/BookingSkeleton";
import { FlightDetailsCard } from "../components/booking/FlightDetailsCard";
import { ManageBookingCard } from "../components/booking/ManageBookingCard";
import { CurrentIcon } from "../components/BrandIcon";
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
      {copied ? <CheckIcon className="size-4" /> : <CurrentIcon src="/icons/copy.png" />}
    </button>
  );
}

export function BookingPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const ready = itinerary !== null;
  const page = useRef<HTMLDivElement>(null);

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
    { dependencies: [ready], scope: page },
  );

  useEffect(() => {
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setItinerary(rememberItinerary()), reduce ? 0 : SKELETON_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!itinerary) return;
    const timer = window.setInterval(() => {
      const next = rememberItinerary();
      setItinerary((current) => (current && current.departureAt === next.departureAt ? current : next));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [itinerary]);

  return (
    <div ref={page}>
      <div className="dot-field bg-surface">
        <div className="mx-auto max-w-6xl px-5 pt-6 pb-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-1">
              <h1 className="font-display text-6xl leading-none text-display tabular-nums sm:text-7xl">{profile.pnr}</h1>
              <CopyPnrButton />
            </div>
            {itinerary ? (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-1 rounded-sm bg-ok-bg px-2 py-0.5 text-xs font-semibold text-ok-ink">
                  <CheckIcon className="size-3.5" />
                  {profile.status}
                </span>
                <span>
                  {profile.origin.code} → {profile.destination.code}
                </span>
                <span className="tabular-nums">{itinerary.departureLabel}</span>
                <span>1 {profile.passengerType}</span>
              </p>
            ) : null}
          </div>
          {itinerary ? <FlightStatus itinerary={itinerary} /> : null}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 lg:px-12" aria-busy={!ready}>
        {ready && itinerary ? (
          <div data-booking-card>
            <FlightDetailsCard itinerary={itinerary} />
            <ManageBookingCard />
          </div>
        ) : (
          <BookingCardSkeleton id="flight" />
        )}
      </div>
    </div>
  );
}
