import type { ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CurrentIcon } from "../components/BrandIcon";
import { ArrowLeftIcon, ArrowRightIcon } from "../components/icons";
import { profile } from "../config/profile";
import { findPastTrip } from "../config/trips";

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-3 border-b border-line py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  );
}

const actions = [
  { label: "Change flight", icon: "/icons/transport.png" },
  { label: "Cancel flight", icon: "/icons/cancelled.png" },
  { label: "Select add-ons", icon: "/icons/add-on.png" },
  { label: "See boarding pass", icon: "/icons/boarding-pass.png" },
  { label: "Download e-ticket", icon: "/icons/download.png" },
];

export function PastBookingPage() {
  const { pnr = "" } = useParams();
  const trip = findPastTrip(pnr);
  if (!trip) return <Navigate to="/trips" replace />;

  const completed = trip.status === "completed";

  return (
    <div>
      <div className="bg-surface">
        <div className="mx-auto max-w-6xl px-5 pt-6 pb-6 sm:px-8 lg:px-12">
          <Link to="/trips" className="inline-flex items-center gap-2 text-sm font-semibold">
            <ArrowLeftIcon className="size-4" />
            Trips
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-display text-6xl text-display sm:text-7xl">{trip.pnr}</h1>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
              <span
                className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold ${
                  completed ? "bg-landed text-landed-ink" : "bg-brand-soft text-danger"
                }`}
              >
                {completed ? "Completed" : "Cancelled"}
              </span>
              <span className="text-muted" aria-hidden="true">
                |
              </span>
              <span>
                {trip.origin.code} → {trip.destination.code}
              </span>
              <span className="text-muted" aria-hidden="true">
                |
              </span>
              <span>{trip.dateLabel}</span>
              <span className="text-muted" aria-hidden="true">
                |
              </span>
              <span>1 {profile.passengerType}</span>
            </p>
          </div>
          {completed ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-good bg-card px-4 py-3 text-sm text-good">
              <p className="inline-flex items-center gap-2 font-semibold">
                <CurrentIcon src="/icons/plane-landing.png" />
                Flight completed on {trip.dayLabel} · Landed {trip.arrivalTime} · {trip.destination.code}
              </p>
              {trip.belt ? (
                <p className="inline-flex items-center gap-2 rounded-sm border border-ink/30 px-2 py-1 text-xs font-semibold text-ink">
                  <CurrentIcon src="/icons/conveyor-belt.png" />
                  Baggage belt {trip.belt}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 inline-flex items-start gap-2 bg-brand-soft px-4 py-3 text-sm font-semibold text-danger">
              <CurrentIcon src="/icons/cancelled.png" className="mt-0.5" />
              <span>
                Booking cancelled on {trip.cancelledOn} · Refund processed to the original payment method
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 lg:px-12">
        <section className="pt-6">
          <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <CurrentIcon src="/icons/plane.png" />
              Flight details
            </h2>
            <p className="text-xs text-muted">{trip.flight}</p>
          </div>
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 sm:gap-4">
            <div>
              <p className="flex items-center gap-2">
                <span className="font-display text-5xl text-ink sm:text-6xl">{trip.departureTime}</span>
                <CurrentIcon src="/icons/airplane.png" className="size-6" />
              </p>
              <p className="mt-1 text-base font-semibold">{trip.origin.code}</p>
              <p className="text-sm text-muted">{trip.origin.city}</p>
              <p className="text-sm text-muted">{trip.dayLabel}</p>
            </div>
            <div className="px-1 pt-3 text-center sm:px-6">
              <p className="text-xs text-muted">{trip.duration}</p>
              <div className="relative my-2 h-4 min-w-24 sm:min-w-48">
                <span className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-ink" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <CurrentIcon src="/icons/plane.png" />
                </span>
              </div>
              <p className="text-sm font-semibold text-brand">{trip.stops}</p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-2">
                <CurrentIcon src="/icons/plane-landing.png" className="size-6" />
                <span className="font-display text-5xl text-ink sm:text-6xl">{trip.arrivalTime}</span>
              </p>
              <p className="mt-1 text-base font-semibold">{trip.destination.code}</p>
              <p className="text-sm text-muted">{trip.destination.city}</p>
              <p className="text-sm text-muted">{trip.dayLabel}</p>
            </div>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
            <Summary label="Flight" value={trip.flight} />
            <Summary label="Duration" value={trip.duration} />
            <Summary label="Stops" value={trip.stops} />
            <Summary label="Class" value={profile.cabinClass} />
          </dl>
        </section>

        <div className="mt-8 grid gap-x-12 lg:grid-cols-2">
          {completed ? (
            <section>
              <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <CurrentIcon src="/icons/destination.png" />
                  Journey
                </h2>
                <p className="text-xs text-muted">Completed</p>
              </div>
              <dl>
                <DetailRow label="Departed">
                  {trip.departureTime} · {trip.origin.city}
                </DetailRow>
                <DetailRow label="Landed">
                  {trip.arrivalTime} · {trip.destination.city}
                </DetailRow>
                <DetailRow label="Seat">
                  <span className="inline-flex items-center gap-2">
                    <CurrentIcon src="/icons/seat.png" />
                    {trip.seat}
                  </span>
                </DetailRow>
                {trip.belt ? (
                  <DetailRow label="Baggage belt">
                    <span className="inline-flex items-center gap-2">
                      <CurrentIcon src="/icons/conveyor-belt.png" />
                      {trip.belt}
                    </span>
                  </DetailRow>
                ) : null}
              </dl>
            </section>
          ) : (
            <section>
              <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <CurrentIcon src="/icons/cancelled.png" />
                  Cancellation
                </h2>
                <p className="text-xs text-muted">Cancelled</p>
              </div>
              <dl>
                <DetailRow label="Cancelled on">{trip.cancelledOn}</DetailRow>
                <DetailRow label="Cancelled by">Passenger</DetailRow>
                <DetailRow label="Refund">Full fare</DetailRow>
                <DetailRow label="Refund status">Refunded to the original payment method</DetailRow>
              </dl>
            </section>
          )}

          <section className="pt-8 lg:pt-0">
            <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <CurrentIcon src="/icons/passenger.png" />
                Passenger
              </h2>
              <p className="text-xs text-muted">1 of 1</p>
            </div>
            <dl>
              <DetailRow label="Name">{profile.name}</DetailRow>
              <DetailRow label="Passenger type">{profile.passengerType}</DetailRow>
              <DetailRow label="Email">
                <a className="text-brand underline-offset-2 hover:underline" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </DetailRow>
            </dl>
          </section>

          <section className="pt-8 lg:col-span-2">
            <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <CurrentIcon src="/icons/appointment.png" />
                Manage booking
              </h2>
              <p className="text-xs text-muted">{completed ? "Flight completed" : "Booking cancelled"}</p>
            </div>
            <div className="grid sm:grid-cols-2 sm:gap-x-12">
              {actions.map((action) => (
                <p
                  key={action.label}
                  className="flex items-center gap-3 border-b border-line py-3 text-sm text-muted"
                >
                  <CurrentIcon src={action.icon} />
                  <span className="flex-1 font-semibold">{action.label}</span>
                  <span>Unavailable</span>
                </p>
              ))}
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 border-b border-line py-3 text-sm hover:text-brand"
              >
                <CurrentIcon src="/icons/customer-service.png" />
                <span className="flex-1 font-semibold">Contact support</span>
                <span className="inline-flex items-center gap-1 text-muted">
                  Email
                  <ArrowRightIcon className="size-4" />
                </span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
