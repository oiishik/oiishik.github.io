import { useId, useState } from "react";
import { profile } from "../../config/profile";
import { getItinerary } from "../../lib/itinerary";
import { BrandIcon } from "../BrandIcon";
import { ChevronIcon } from "../icons";

type Stop = { code: string; city?: string };

function routeStops(): Stop[] {
  return [
    profile.origin,
    ...profile.stops.map((name) => ({ code: name })),
    profile.destination,
  ];
}

export function FlightDetailsCard() {
  const [open, setOpen] = useState(true);
  const routeId = useId();
  const itinerary = getItinerary();
  const stops = routeStops();
  const stopCount = profile.stops.length;

  return (
    <section className="rounded-3xl border border-line bg-card p-4 shadow-[0_10px_30px_rgba(23,21,43,0.06)] sm:p-6 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-base font-semibold">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <BrandIcon src="/icons/plane.png" />
          </span>
          Flight details
        </h2>
        <p className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold tracking-wide text-brand">
          {profile.carrier} {profile.flightNumber}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 sm:gap-4">
        <div>
          <p className="font-display text-4xl text-display sm:text-6xl">{itinerary.departure.time}</p>
          <p className="mt-1 text-base font-semibold">{profile.origin.code}</p>
          <p className="text-sm text-muted">{profile.origin.city}</p>
          <p className="text-xs text-muted sm:text-sm">{itinerary.departureLabel}</p>
        </div>

        <div className="flex flex-col items-center px-1 pt-2 text-center sm:px-4">
          <p className="text-xs font-medium text-muted sm:text-sm">{itinerary.durationLabel}</p>
          <div className="my-2 flex w-full min-w-24 items-center gap-2 text-brand sm:min-w-40">
            <span className="h-px flex-1 border-t border-dashed border-brand/50" />
            <BrandIcon src="/icons/plane.png" className="size-4 shrink-0" />
            <span className="h-px flex-1 border-t border-dashed border-brand/50" />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand underline underline-offset-4"
            aria-expanded={open}
            aria-controls={routeId}
            onClick={() => setOpen((value) => !value)}
          >
            {stopCount} stops
            <ChevronIcon className={`size-4 transition-transform ${open ? "" : "rotate-180"}`} />
          </button>
        </div>

        <div className="text-right">
          <p className="font-display text-4xl text-display sm:text-6xl">{itinerary.arrival.time}</p>
          <p className="mt-1 text-base font-semibold">{profile.destination.code}</p>
          <p className="text-sm text-muted">{profile.destination.city}</p>
          <p className="text-xs text-muted sm:text-sm">{itinerary.departureLabel}</p>
        </div>
      </div>

      <div id={routeId} hidden={!open} className="mt-6">
        <ol className="flex flex-col rounded-2xl bg-track px-4 py-4 md:flex-row md:px-3 md:py-5">
          {stops.map((stop, index) => {
            const endpoint = index === 0 || index === stops.length - 1;
            const last = index === stops.length - 1;
            return (
              <li
                key={`${stop.code}-${index}`}
                className="relative flex flex-1 gap-3 pb-4 last:pb-0 md:flex-col md:items-center md:pb-0 md:text-center"
              >
                {!last && (
                  <span
                    className="absolute top-4 left-[7px] h-[calc(100%-8px)] w-0.5 bg-brand/40 md:top-[7px] md:left-1/2 md:h-0.5 md:w-full"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`relative mt-0.5 size-4 shrink-0 rounded-full border-2 border-brand md:mt-0 ${endpoint ? "bg-brand" : "bg-card"}`}
                />
                <p className="text-sm font-semibold">
                  {stop.code}
                  {stop.city ? <span className="mt-0.5 block font-medium text-muted md:mt-0">{stop.city}</span> : null}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
