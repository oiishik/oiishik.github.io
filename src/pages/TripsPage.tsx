import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CurrentIcon } from "../components/BrandIcon";
import { ArrowRightIcon } from "../components/icons";
import { flightLabel, profile } from "../config/profile";
import { cancelledTrips, completedTrips, type PastTrip } from "../config/trips";
import { flightPhase, rememberItinerary, type Itinerary } from "../lib/itinerary";

type Tab = "upcoming" | "completed" | "cancelled";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "upcoming", label: "Upcoming", icon: "/icons/appointment.png" },
  { id: "completed", label: "Completed", icon: "/icons/destination.png" },
  { id: "cancelled", label: "Cancelled", icon: "/icons/cancelled.png" },
];

function shortDay(label: string) {
  return label.replace(/\s+\d{4}$/, "").replace(/, 0(\d)/, ", $1");
}

function stopLabel(stops: readonly string[]) {
  return stops.length === 0 ? "Non-stop" : `${stops.length} stops`;
}

function TripCard({
  title,
  status,
  statusClass,
  note,
  pnr,
  fromWhen,
  fromPlace,
  toWhen,
  toPlace,
  flight,
  flightNote,
  passenger,
  seat,
  href,
}: {
  title: string;
  status: string;
  statusClass: string;
  note: string;
  pnr: string;
  fromWhen: string;
  fromPlace: string;
  toWhen: string;
  toPlace: string;
  flight: string;
  flightNote: string;
  passenger: string;
  seat?: string;
  href: string;
}) {
  return (
    <article className="border-b border-line py-6">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <h2 className="flex items-center gap-3 text-2xl font-semibold">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line">
              <CurrentIcon src="/icons/plane.png" />
            </span>
            {title}
          </h2>
          <p className="mt-2 text-sm">
            <span className={`font-semibold ${statusClass}`}>{status}</span>{" "}
            <span className="text-muted">{note}</span> <span className="font-semibold">PNR {pnr}</span>
          </p>
        </div>
        <Link
          to={href}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-ink/30 px-4 py-2 text-sm font-semibold"
        >
          View booking
          <ArrowRightIcon className="size-4" />
        </Link>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:col-span-2 sm:grid-cols-4">
          <div>
            <dt className="text-sm text-muted">From</dt>
            <dd className="mt-1 font-semibold">{fromWhen}</dd>
            <dd className="text-sm text-muted">{fromPlace}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">To</dt>
            <dd className="mt-1 font-semibold">{toWhen}</dd>
            <dd className="text-sm text-muted">{toPlace}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Flight</dt>
            <dd className="mt-1 font-semibold">{flight}</dd>
            <dd className="text-sm text-muted">{flightNote}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Passenger</dt>
            <dd className="mt-1 font-semibold">{profile.name}</dd>
            <dd className="text-sm text-muted">
              {passenger}
              {seat ? (
                <span className="inline-flex items-center gap-1">
                  {" · "}
                  <CurrentIcon src="/icons/seat.png" />
                  Seat {seat}
                </span>
              ) : null}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

function LiveCard({ itinerary, landed }: { itinerary: Itinerary; landed: boolean }) {
  const stops = stopLabel(profile.stops);
  return (
    <TripCard
      title={`${profile.origin.city} → ${profile.destination.city}`}
      status={landed ? "Completed" : "Upcoming"}
      statusClass={landed ? "text-good" : "text-brand"}
      note="One way flight"
      pnr={profile.pnr}
      fromWhen={`${shortDay(itinerary.departureLabel)} · ${itinerary.departure.time}`}
      fromPlace={`${profile.origin.code} · ${profile.origin.city}`}
      toWhen={`${shortDay(itinerary.arrivalLabel)} · ${itinerary.arrival.time}`}
      toPlace={`${profile.destination.code} · ${profile.destination.city}`}
      flight={flightLabel()}
      flightNote={`${itinerary.durationLabel} · ${stops}`}
      passenger={`1 ${profile.passengerType}`}
      seat={profile.seat}
      href={`/trips/${profile.pnr}`}
    />
  );
}

function PastCard({ trip }: { trip: PastTrip }) {
  const cancelled = trip.status === "cancelled";
  return (
    <TripCard
      title={`${trip.origin.city} → ${trip.destination.city}`}
      status={cancelled ? "Cancelled" : "Completed"}
      statusClass={cancelled ? "text-danger" : "text-good"}
      note="One way flight"
      pnr={trip.pnr}
      fromWhen={`${trip.dayLabel} · ${trip.departureTime}`}
      fromPlace={`${trip.origin.code} · ${trip.origin.city}`}
      toWhen={`${trip.dayLabel} · ${trip.arrivalTime}`}
      toPlace={`${trip.destination.code} · ${trip.destination.city}`}
      flight={trip.flight}
      flightNote={`${trip.duration} · ${trip.stops}`}
      passenger={cancelled ? `1 ${profile.passengerType} · Refunded` : `1 ${profile.passengerType}`}
      seat={cancelled ? undefined : trip.seat}
      href={`/trips/${trip.pnr}`}
    />
  );
}

export function TripsPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("status");
  const tab: Tab = requested === "completed" || requested === "cancelled" ? requested : "upcoming";
  const [itinerary, setItinerary] = useState(() => rememberItinerary());
  const [now, setNow] = useState(() => Date.now());
  const landed = flightPhase(itinerary.departureAt, itinerary.arrivalAt, now) === "landed";

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = rememberItinerary();
      setItinerary((current) => (current.departureAt === next.departureAt ? current : next));
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const counts: Record<Tab, number> = {
    upcoming: landed ? 0 : 1,
    completed: completedTrips.length + (landed ? 1 : 0),
    cancelled: cancelledTrips.length,
  };

  function select(next: Tab) {
    if (next === "upcoming") setParams({});
    else setParams({ status: next });
  }

  return (
    <div>
      <div className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-8 lg:px-12">
          <h1 className="font-display text-6xl text-display sm:text-7xl">Trips</h1>
        </div>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div role="tablist" aria-label="Trip status" className="mt-6 flex gap-6 overflow-x-auto border-b border-line">
          {tabs.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => select(item.id)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 py-3 text-sm font-semibold ${
                  selected ? "border-brand text-brand" : "border-transparent text-ink"
                }`}
              >
                <CurrentIcon src={item.icon} />
                {item.label}
                <span className="rounded-sm bg-page px-1.5 text-xs text-ink tabular-nums ring-1 ring-line">
                  {counts[item.id]}
                </span>
              </button>
            );
          })}
        </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 lg:px-12">
        <div role="tabpanel">
          {tab === "upcoming" && !landed ? <LiveCard itinerary={itinerary} landed={false} /> : null}
          {tab === "completed" ? (
            <>
              {landed ? <LiveCard itinerary={itinerary} landed /> : null}
              {completedTrips.map((trip) => (
                <PastCard key={trip.pnr} trip={trip} />
              ))}
            </>
          ) : null}
          {tab === "cancelled" ? cancelledTrips.map((trip) => <PastCard key={trip.pnr} trip={trip} />) : null}
        </div>
      </div>
    </div>
  );
}
