import { useId, useState } from "react";
import { flightLabel, profile } from "../../config/profile";
import { flightTrackProgress, getItinerary, type Itinerary } from "../../lib/itinerary";
import { useFlightClock } from "./FlightStatus";
import { CurrentIcon } from "../BrandIcon";
import { ChevronIcon } from "../icons";

type Stop = { code: string; city?: string };

function routeStops(): Stop[] {
  return [profile.origin, ...profile.stops.map((name) => ({ code: name })), profile.destination];
}

function ticketDate(label: string) {
  return label.replace(/\s+\d{4}$/, "").replace(/0(\d)/, "$1");
}

export function FlightDetailsCard({ itinerary = getItinerary() }: { itinerary?: Itinerary }) {
  const [open, setOpen] = useState(true);
  const routeId = useId();
  const now = useFlightClock();
  const progress = flightTrackProgress(itinerary.departureAt, itinerary.arrivalAt, now);
  const stops = routeStops();
  const stopCount = profile.stops.length;

  return (
    <section className="pt-6">
      <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <CurrentIcon src="/icons/plane.png" />
          Flight details
        </h2>
        <p className="text-xs text-muted">{flightLabel()}</p>
      </div>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 sm:gap-4">
        <div>
          <p className="flex items-center gap-2">
            <span className="font-display text-5xl text-ink tabular-nums sm:text-6xl">{itinerary.departure.time}</span>
            <CurrentIcon src="/icons/airplane.png" className="size-6" />
          </p>
          <p className="mt-1 text-base font-semibold">{profile.origin.code}</p>
          <p className="text-sm text-muted">{profile.origin.city}</p>
          <p className="text-sm text-muted tabular-nums">{ticketDate(itinerary.departureLabel)}</p>
        </div>

        <div className="flex flex-col items-center px-1 pt-3 text-center sm:px-6">
          <p className="text-xs text-muted tabular-nums">{itinerary.durationLabel}</p>
          <div className="relative my-2 h-4 w-full min-w-24 sm:min-w-48">
            <span className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-ink" />
            <span
              className="absolute top-1/2 text-ink"
              style={{ left: `${progress * 100}%`, transform: `translate(-${progress * 100}%, -50%)` }}
            >
              <CurrentIcon src="/icons/plane.png" />
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand"
            aria-expanded={open}
            aria-controls={routeId}
            onClick={() => setOpen((value) => !value)}
          >
            {stopCount} stops
            <ChevronIcon className={`size-4 transition-transform ${open ? "" : "rotate-180"}`} />
          </button>
        </div>

        <div className="text-right">
          <p className="flex items-center justify-end gap-2">
            <CurrentIcon src="/icons/plane-landing.png" className="size-6" />
            <span className="font-display text-5xl text-ink tabular-nums sm:text-6xl">{itinerary.arrival.time}</span>
          </p>
          <p className="mt-1 text-base font-semibold">{profile.destination.code}</p>
          <p className="text-sm text-muted">{profile.destination.city}</p>
          <p className="text-sm text-muted tabular-nums">{ticketDate(itinerary.arrivalLabel)}</p>
        </div>
      </div>

      <div id={routeId} hidden={!open} className="mt-6">
        <ol className="flex flex-col gap-4 md:flex-row">
          {stops.map((stop, index) => {
            const endpoint = index === 0 || index === stops.length - 1;
            const last = index === stops.length - 1;
            return (
              <li
                key={`${stop.code}-${index}`}
                className="relative flex flex-1 gap-3 md:flex-col md:items-center md:text-center"
              >
                {!last && (
                  <span
                    className="absolute top-3 left-[5px] h-[calc(100%+8px)] w-px bg-ink/30 md:top-[5px] md:left-1/2 md:h-px md:w-full"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`relative size-2.5 shrink-0 border-2 border-ink ${endpoint ? "bg-brand" : "bg-page"}`}
                />
                <p className="text-sm font-semibold">
                  {stop.code}
                  {stop.city ? <span className="mt-0.5 block font-normal text-muted md:mt-0">{stop.city}</span> : null}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted">Flight</dt>
          <dd className="mt-1 font-semibold">{flightLabel()}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Duration</dt>
          <dd className="mt-1 font-semibold tabular-nums">{itinerary.durationLabel}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Stops</dt>
          <dd className="mt-1 font-semibold tabular-nums">{stopCount}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Class</dt>
          <dd className="mt-1 font-semibold">{profile.cabinClass}</dd>
        </div>
      </dl>
    </section>
  );
}
