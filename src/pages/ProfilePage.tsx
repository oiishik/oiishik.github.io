import type { ReactNode } from "react";
import { CurrentIcon } from "../components/BrandIcon";
import { linkedinLabel, profile } from "../config/profile";

const tiers = ["Bronze", "Silver", "Gold", "Platinum"] as const;

const benefits: { benefit: string; value: string }[] = [
  { benefit: "Experience", value: "4+ years" },
  { benefit: "Industry", value: "Travel and airline tech" },
  { benefit: "Languages", value: "TypeScript, JavaScript, Java" },
  { benefit: "Backend Frameworks", value: "Node js, Nest js, Spring Boot" },
  { benefit: "Frontend Frameworks", value: "React js, Next js" },
  { benefit: "Database", value: "MySQL, Postgres, Dynamo DB, Redis" },
  { benefit: "Monitoring", value: "Elasticsearch, Grafana, Kibana" },
  { benefit: "System design", value: "HLD/LLD, event-driven architecture, SOLID Principle" },
];

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-3 border-b border-line py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="min-w-0 font-semibold">{children}</dd>
    </div>
  );
}

export function ProfilePage() {
  return (
    <div>
      <div className="bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-8 sm:gap-6 sm:px-8 lg:px-12">
          <img
            src="/oishik.jpg"
            alt=""
            className="size-20 shrink-0 rounded-full object-cover ring-2 ring-ink/15 sm:size-24"
          />
          <div className="min-w-0">
            <h1 className="font-display text-3xl text-display sm:text-6xl">{profile.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-sm bg-[#a6842c] px-2 py-0.5 text-xs font-semibold text-[#fffaf8]">
                <CurrentIcon src="/icons/award.png" className="size-3" />
                Gold member
              </span>
              <span>
                Membership ID <span className="font-semibold">OS14012000</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid min-w-0 max-w-6xl gap-x-12 px-5 pt-8 pb-12 sm:px-8 lg:grid-cols-2 lg:px-12">
        <section className="min-w-0">
          <h2 className="flex items-center gap-2 border-b border-ink pb-2 text-base font-semibold">
            <CurrentIcon src="/icons/user.png" />
            Profile
          </h2>
          <dl>
            <Row label="Name">{profile.name}</Row>
            <Row label="Email">
              <a className="break-words text-brand underline-offset-2 hover:underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </Row>
            <Row label="LinkedIn">
              <a
                className="break-words text-brand underline-offset-2 hover:underline"
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkedinLabel(profile.linkedinUrl)}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Row>
            <Row label="Membership ID">OS14012000</Row>
            <Row label="Tier">Gold</Row>
          </dl>
        </section>

        <section className="min-w-0 pt-8 lg:pt-0">
          <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <CurrentIcon src="/icons/loyalty-program.png" />
              Loyalty bonus
            </h2>
            <p className="text-xs text-muted">Gold → Platinum</p>
          </div>
          <div className="relative mt-6">
            <div className="absolute top-1.5 right-[12.5%] left-[12.5%] h-1 bg-line" />
            <div className="absolute top-1.5 left-[12.5%] h-1 w-1/2 bg-brand" />
            <ol className="relative grid grid-cols-4">
              {tiers.map((tier, index) => {
                const current = tier === "Gold";
                return (
                  <li key={tier} className="flex flex-col items-center gap-2">
                    <span
                      className={`size-4 ${current ? "bg-brand" : index < 2 ? "bg-brand" : "border border-line bg-page"}`}
                      aria-hidden="true"
                    />
                    <span className={`text-xs font-semibold ${current ? "text-brand" : "text-muted"}`}>{tier}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <dl className="mt-6">
            <div className="flex items-baseline justify-between gap-3 border-b border-line py-2.5">
              <dt className="text-sm text-muted">Years of experience</dt>
              <dd className="font-semibold">
                <span className="text-brand">4</span>
                <span className="text-muted"> / 8</span>
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-muted">Platinum is 4 more years away.</p>
        </section>

        <section className="min-w-0 pt-8 lg:col-span-2">
          <h2 className="flex items-center gap-2 border-b border-ink pb-2 text-base font-semibold">
            <CurrentIcon src="/icons/prize.png" />
            Tier benefits
          </h2>
          <table className="mt-2 w-full text-left text-sm">
            <thead>
              <tr className="bg-tier-gold-bg text-tier-gold-text">
                <th className="rounded-none border-t-2 border-tier-gold-line px-3 py-2 font-semibold">Benefit</th>
                <th className="rounded-none border-t-2 border-tier-gold-line px-3 py-2 font-semibold">
                  <span className="flex items-baseline justify-between gap-3">
                    Full Stack Developer
                    <span className="text-xs font-semibold">Current</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {benefits.map((row) => (
                <tr key={row.benefit} className="border-b border-line">
                  <th className="px-3 py-2.5 pr-4 font-normal text-muted">{row.benefit}</th>
                  <td className="px-3 py-2.5 font-semibold">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
