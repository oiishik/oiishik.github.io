import type { ReactNode } from "react";
import { linkedinLabel, profile } from "../../config/profile";
import { CurrentIcon } from "../BrandIcon";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-3 border-b border-line py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="min-w-0 font-semibold">{children}</dd>
    </div>
  );
}

export function PassengerDetailsCard() {
  return (
    <section className="pt-8">
      <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <CurrentIcon src="/icons/passenger.png" />
          Passenger
        </h2>
        <p className="text-xs text-muted">1 of 1</p>
      </div>
      <dl className="mt-1">
        <Row label="Name">{profile.name}</Row>
        <Row label="Passenger type">{profile.passengerType}</Row>
        <Row label="Email">
          <a className="break-all text-brand underline-offset-2 hover:underline" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </Row>
        <Row label="LinkedIn">
          <a
            className="break-all text-brand underline-offset-2 hover:underline"
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkedinLabel(profile.linkedinUrl)}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Row>
      </dl>
    </section>
  );
}
