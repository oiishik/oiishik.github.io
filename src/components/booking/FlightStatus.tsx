import { useEffect, useState } from "react";
import { profile } from "../../config/profile";
import {
  flightPhase,
  flightTrackProgress,
  formatDepartureCountdown,
  type Itinerary,
} from "../../lib/itinerary";
import { CurrentIcon } from "../BrandIcon";

function RollingTime({ value }: { value: string }) {
  return (
    <span className="odo">
      {value.split("").map((char, index) =>
        char === ":" ? (
          <span key={`sep-${index}`}>{char}</span>
        ) : (
          <span key={index} className={Number(char) % 2 ? "roll-b" : "roll-a"}>
            {char}
          </span>
        ),
      )}
    </span>
  );
}

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

export function FlightStatus({ itinerary }: { itinerary: Itinerary }) {
  const now = useNow();
  const phase = flightPhase(itinerary.departureAt, itinerary.arrivalAt, now);

  if (phase === "ready") {
    return (
      <p className="mt-4 flex items-center gap-2 bg-brand px-4 py-3 text-sm font-semibold text-btn-text">
        <CurrentIcon src="/icons/runway.png" className="size-4" />
        Flight is ready to depart · Gate {profile.gate} · Boarding closed
      </p>
    );
  }

  if (phase === "departed") {
    const progress = flightTrackProgress(itinerary.departureAt, itinerary.arrivalAt, now);
    return (
      <div className="mt-4 border-t-2 border-brand bg-card">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <p className="inline-flex items-center gap-2 text-sm">
            <CurrentIcon src="/icons/travel.png" className="size-4 text-brand" />
            Flight departed · Lands in
          </p>
          <p className="font-display text-3xl text-ink tabular-nums sm:text-4xl">
            <RollingTime value={formatDepartureCountdown(itinerary.arrivalAt, now)} />
          </p>
        </div>
        <div
          className="h-0.5 bg-line"
          role="progressbar"
          aria-label="Flight progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <span className="block h-full bg-brand" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    );
  }

  if (phase === "landed") {
    return (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-landed px-4 py-3 text-sm text-landed-ink">
        <p className="inline-flex items-center gap-2 font-semibold">
          <CurrentIcon src="/icons/plane-landing.png" className="size-4" />
          Flight landed in {profile.destination.city} · Arrived {itinerary.arrival.time} · {profile.destination.code}
        </p>
        <p className="inline-flex items-center gap-2 rounded-sm border border-landed-ink/40 px-2 py-1 text-xs font-semibold">
          <CurrentIcon src="/icons/conveyor-belt.png" />
          Baggage belt 5
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-4 border-t-2 border-brand bg-card px-4 py-3">
      <p className="inline-flex items-center gap-2 text-sm">
        <CurrentIcon src="/icons/timer.png" className="size-4 text-brand" />
        Flight scheduled to depart in
      </p>
      <p className="font-display text-3xl text-ink tabular-nums sm:text-4xl">
        <RollingTime value={formatDepartureCountdown(itinerary.departureAt, now)} />
      </p>
    </div>
  );
}
