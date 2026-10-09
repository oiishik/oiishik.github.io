import type { ReactNode } from "react";
import { profile } from "../../config/profile";
import { CurrentIcon } from "../BrandIcon";
import { TicketIcon } from "../icons";

type Skill = { name: string; icon?: string; wide?: boolean };

const stack: { label: string; items: Skill[] }[] = [
  {
    label: "Languages",
    items: [
      { name: "TypeScript", icon: "/logos/typescript.png" },
      { name: "Java", icon: "/logos/java.png" },
    ],
  },
  {
    label: "Frameworks",
    items: [
      { name: "Node.js", icon: "/logos/nodejs.png" },
      { name: "React", icon: "/logos/react.png" },
      { name: "Spring Boot", icon: "/logos/spring-boot.png" },
    ],
  },
  {
    label: "Cloud",
    items: [
      { name: "AWS", icon: "/logos/aws.png", wide: true },
      { name: "Docker", icon: "/logos/docker.png" },
    ],
  },
  {
    label: "Databases",
    items: [
      { name: "MySQL", icon: "/logos/mysql.png" },
      { name: "Postgres", icon: "/logos/postgres.png" },
      { name: "Redis", icon: "/logos/redis.png" },
      { name: "DynamoDB", icon: "/logos/dynamodb.png" },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Git", icon: "/logos/git.png" },
      { name: "GitHub", icon: "/logos/github.png" },
      { name: "Jira", icon: "/logos/jira.png" },
    ],
  },
];

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 border-b border-line py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  );
}

export function FareBenefitsCard() {
  return (
    <section className="pt-8">
      <div className="flex items-end justify-between gap-3 border-b border-ink pb-2">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <TicketIcon className="size-4" />
          Fare benefits
        </h2>
        <p className="text-xs text-muted">Tech stack</p>
      </div>
      <dl className="mt-1">
        <Row label="Brand">{profile.fareBrand}</Row>
        <Row label="Baggage">
          <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-2">
              <CurrentIcon src="/icons/luggage.png" />
              Check-in <span className="tabular-nums">{profile.baggage.checkIn}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <CurrentIcon src="/icons/luggage-cabin.png" />
              Cabin <span className="tabular-nums">{profile.baggage.cabin}</span>
            </span>
          </span>
        </Row>
        {stack.map(({ label, items }) => (
          <Row key={label} label={label}>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {items.map((item) => (
                <span key={item.name} className="inline-flex items-center gap-1.5">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt=""
                      className={`${item.wide ? "h-4 w-7" : "size-4"} shrink-0 object-contain dark:invert`}
                    />
                  ) : null}
                  {item.name}
                </span>
              ))}
            </span>
          </Row>
        ))}
      </dl>
    </section>
  );
}
