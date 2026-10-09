/**
 * All visitor-facing profile content. Edit this file instead of components.
 *
 * Fare benefits follow the design PDF (six tiles) because that is the
 * requested visual, including the supplied logo files.
 */
export const roleTitle = "Senior Software Developer";

export const profile = {
  name: "Oishik Sengupta",
  passengerType: "Adult",
  email: "oishik8sengupta@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/oishiksengupta",
  pnr: "OISHIK",
  carrier: "SDE",
  flightNumber: "2",
  origin: { code: "CCU", city: "Kolkata" },
  destination: { code: "PNQ", city: "Pune" },
  stops: ["AlgoDomain Solutions", "AnalytixKraft", "udChalo"],
  /** Job title. Header, hero, fare brand, and footer all read this. */
  role: roleTitle,
  fareBrand: roleTitle,
  cabinClass: "Economy",
  baggage: { checkIn: "15 kg", cabin: "7 kg" },
  fareBenefits: [
    { category: "TYPESCRIPT", label: "Node.js, React.js", logo: "/logos/nodejs.png" },
    { category: "JAVA", label: "Java, Spring Boot", logo: "/logos/java.png" },
    { category: "CLOUD", label: "AWS, Docker", logo: "/logos/cloud.png" },
    { category: "DATABASE", label: "MySQL, Postgres, Redis, DynamoDB", logo: "/logos/database.png" },
    { category: "GIT", label: "GitHub", logo: "/logos/github.png" },
    { category: "SCRUM", label: "Jira", logo: "/logos/jira.png" },
  ],
  resumePath:
    "https://drive.usercontent.google.com/download?id=1QWyXqQ5doDSB-Dl_rMZlPtb04pp20OhE&export=download&confirm=t",
  resumeViewUrl: "https://drive.google.com/file/d/1QWyXqQ5doDSB-Dl_rMZlPtb04pp20OhE/view",
  /** Gate, seat, and sequence are taken from the design PDF. */
  gate: "B7",
  seat: "2A",
  sequence: "002",
  status: "Confirmed",
} as const;

export type Profile = typeof profile;

export function flightLabel(source: Profile = profile) {
  return `${source.carrier} ${source.flightNumber}`;
}

export function linkedinLabel(url: string) {
  return url.replace(/^https?:\/\/(?:www\.)?/, "");
}

export function passengerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
