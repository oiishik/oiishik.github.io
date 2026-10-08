import { useEffect, useState } from "react";
import { profile } from "../../config/profile";
import {
  flightPhase,
  flightTrackProgress,
  formatDepartureCountdown,
  type Itinerary,
} from "../../lib/itinerary";
import { BrandIcon } from "../BrandIcon";

function useNow() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

export function useFlightClock() {
  return useNow();
}

const pill = "mt-4 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium";

export function FlightStatus({ itinerary }: { itinerary: Itinerary }) {
  const now = useNow();
  const phase = flightPhase(itinerary.departureAt, itinerary.arrivalAt, now);

  if (phase === "ready") {
    return (
      <p className={`${pill} bg-brand text-btn-text`}>
        <span className="live-dot size-2 shrink-0 rounded-full bg-btn-text" aria-hidden="true" />
        <BrandIcon src="/icons/runway.png" tone="on-fill" className="size-4" />
        <span>
          Flight is ready to depart · Gate {profile.gate} · Boarding closed
        </span>
      </p>
    );
  }

  if (phase === "departed") {
    const progress = flightTrackProgress(itinerary.departureAt, itinerary.arrivalAt, now);
    return (
      <div className="mt-4 max-w-md">
        <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-brand/30 bg-brand/15 px-3 py-1.5 text-sm font-medium text-brand">
          <BrandIcon src="/icons/direct-flight.png" className="size-4" />
          <span>Flight departed · Lands in </span>
          <span className="rounded-full bg-brand px-2.5 py-0.5 font-bold tabular-nums text-btn-text">
            {formatDepartureCountdown(itinerary.arrivalAt, now)}
          </span>
        </p>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand/20"
          role="progressbar"
          aria-label="Flight progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <span className="block h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    );
  }

  if (phase === "landed") {
    return (
      <p className={`${pill} bg-landed text-landed-ink`}>
        <BrandIcon src="/icons/plane-landing.png" className="size-4" />
        <span>
          Flight landed in {profile.destination.city} · On time · Arrived {itinerary.arrival.time} ·{" "}
          {profile.destination.code} · Baggage Belt: 5
        </span>
      </p>
    );
  }

  return (
    <p className={`${pill} border border-brand/30 bg-brand/15 text-brand`}>
      <BrandIcon src="/icons/time.png" className="size-4" />
      <span>Flight scheduled to depart in </span>
      <span className="rounded-full bg-brand px-2.5 py-0.5 font-bold tabular-nums text-btn-text">
        {formatDepartureCountdown(itinerary.departureAt, now)}
      </span>
    </p>
  );
}
