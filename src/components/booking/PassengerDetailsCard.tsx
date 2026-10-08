import { profile, linkedinLabel, passengerInitials } from "../../config/profile";
import { BrandIcon } from "../BrandIcon";
import { ExternalIcon, IdIcon, LinkIcon, MailIcon } from "../icons";

const rows = [
  { label: "Name", value: profile.name, icon: "id" as const },
  { label: "Type", value: profile.passengerType, icon: "passenger" as const },
];

export function PassengerDetailsCard() {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-line bg-card p-4 shadow-[0_10px_30px_rgba(23,21,43,0.06)] sm:p-6 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-base font-semibold">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <BrandIcon src="/icons/passenger.png" />
          </span>
          Passenger details
        </h2>
        <p className="text-xs font-semibold text-muted">1 of 1</p>
      </div>

      <div className="mt-5 flex items-center gap-3 border-b border-line pb-5">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#3a2bb8] text-sm font-bold text-white">
          {passengerInitials(profile.name)}
        </span>
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm text-muted">{profile.passengerType}</p>
        </div>
      </div>

      <dl className="mt-2">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3 border-b border-line py-3">
            {row.icon === "passenger" ? (
              <BrandIcon src="/icons/passenger.png" className="mt-0.5 size-5 shrink-0" />
            ) : (
              <IdIcon className="mt-0.5 size-5 shrink-0 text-muted" />
            )}
            <div>
              <dt className="text-xs text-muted">{row.label}</dt>
              <dd className="font-medium">{row.value}</dd>
            </div>
          </div>
        ))}
        <div className="flex gap-3 border-b border-line py-3">
          <MailIcon className="mt-0.5 size-5 shrink-0 text-muted" />
          <div className="min-w-0">
            <dt className="text-xs text-muted">Email</dt>
            <dd>
              <a className="font-medium break-all text-brand underline-offset-2 hover:underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex gap-3 py-3">
          <LinkIcon className="mt-0.5 size-5 shrink-0 text-muted" />
          <div className="min-w-0">
            <dt className="text-xs text-muted">LinkedIn</dt>
            <dd>
              <a
                className="inline-flex items-center gap-1 font-medium break-all text-brand underline-offset-2 hover:underline"
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkedinLabel(profile.linkedinUrl)}
                <ExternalIcon className="size-3.5 shrink-0" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
