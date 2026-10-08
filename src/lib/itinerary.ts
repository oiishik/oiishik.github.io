/**
 * Departure, arrival, duration, and boarding time for the booking and the
 * boarding pass. Both screens call this so the dates always match.
 *
 * The duration stays 1h 30m. Departure is 30 minutes after the visit, in
 * Asia/Kolkata, and arrival is one duration later. Either clock can fall on
 * the next calendar day. The aircraft leaves the gate 5 minutes after
 * departure. Boarding is 45 minutes before departure.
 */

const DEPARTURE_LEAD_MS = 30 * 60 * 1000;
const DURATION_MINUTES = 1 * 60 + 30;
const DURATION_MS = DURATION_MINUTES * 60 * 1000;
/** The aircraft stays at the gate for 5 minutes after the scheduled departure. */
export const READY_WINDOW_MS = 5 * 60 * 1000;
/** Keep a finished flight so a later visit can still see that it landed. */
const KEEP_AFTER_LANDING_MS = 30 * 60 * 1000;
const FLIGHT_STORAGE_KEY = "sde-flight-departure";

export type FlightPhase = "countdown" | "ready" | "departed" | "landed";

export const KOLKATA_TIME_ZONE = "Asia/Kolkata";

const BOARDING_LEAD_MS = 45 * 60 * 1000;

export type CivilDate = {
  year: number;
  month: number;
  day: number;
};

export type Itinerary = {
  departure: { date: CivilDate; time: string };
  arrival: { date: CivilDate; time: string };
  /** Epoch milliseconds of the departure instant. The countdown reads this. */
  departureAt: number;
  /** Epoch milliseconds of the arrival instant. */
  arrivalAt: number;
  boardingTime: string;
  durationLabel: string;
  departureLabel: string;
  arrivalLabel: string;
  /** Same calendar day as departure, masked the way the boarding pass is drawn. */
  boardingPassDate: string;
};

export function kolkataCivilDate(instant: Date): CivilDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: KOLKATA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return { year: read("year"), month: read("month"), day: read("day") };
}

export function addCalendarDays(date: CivilDate, days: number): CivilDate {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function utcDate(date: CivilDate) {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

export function formatLongDate(date: CivilDate) {
  const instant = utcDate(date);
  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  }).format(instant);
  const month = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    timeZone: "UTC",
  }).format(instant);
  const day = String(date.day).padStart(2, "0");
  return `${weekday}, ${day} ${month} ${date.year}`;
}

export function formatBoardingPassDate(date: CivilDate) {
  const month = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    timeZone: "UTC",
  })
    .format(utcDate(date))
    .toUpperCase();
  return `${String(date.day).padStart(2, "0")} ${month} ${date.year}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function kolkataSchedule(instant: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: KOLKATA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const hour = read("hour") === "24" ? "00" : read("hour").padStart(2, "0");

  return {
    date: {
      year: Number(read("year")),
      month: Number(read("month")),
      day: Number(read("day")),
    },
    time: `${hour}:${read("minute").padStart(2, "0")}`,
  };
}

export function formatDepartureCountdown(departureAt: number, now: number) {
  const remaining = Math.max(0, departureAt - now);
  const totalSeconds = remaining === 0 ? 0 : Math.ceil(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

export function itineraryFromDeparture(departureAt: number): Itinerary {
  const departureInstant = new Date(departureAt);
  const arrivalInstant = new Date(departureAt + DURATION_MS);
  const boardingInstant = new Date(departureAt - BOARDING_LEAD_MS);
  const departure = kolkataSchedule(departureInstant);
  const arrival = kolkataSchedule(arrivalInstant);

  return {
    departure,
    arrival,
    departureAt,
    arrivalAt: arrivalInstant.getTime(),
    boardingTime: kolkataSchedule(boardingInstant).time,
    durationLabel: formatDuration(DURATION_MINUTES),
    departureLabel: formatLongDate(departure.date),
    arrivalLabel: formatLongDate(arrival.date),
    boardingPassDate: formatBoardingPassDate(departure.date),
  };
}

export function getItinerary(now: Date = new Date()): Itinerary {
  return itineraryFromDeparture(now.getTime() + DEPARTURE_LEAD_MS);
}

export function flightPhase(departureAt: number, arrivalAt: number, now: number): FlightPhase {
  if (now < departureAt) return "countdown";
  if (now < departureAt + READY_WINDOW_MS) return "ready";
  if (now < arrivalAt) return "departed";
  return "landed";
}

/** 0 at the gate, then 0–1 while airborne, then 1 after landing. */
export function flightTrackProgress(departureAt: number, arrivalAt: number, now: number) {
  const airborneAt = departureAt + READY_WINDOW_MS;
  if (now <= airborneAt) return 0;
  if (now >= arrivalAt) return 1;
  return (now - airborneAt) / (arrivalAt - airborneAt);
}

function readStoredDeparture(now: number) {
  try {
    const raw = localStorage.getItem(FLIGHT_STORAGE_KEY);
    const departureAt = raw === null ? NaN : Number(raw);
    if (!Number.isFinite(departureAt)) return null;
    if (now > departureAt + DURATION_MS + KEEP_AFTER_LANDING_MS) {
      localStorage.removeItem(FLIGHT_STORAGE_KEY);
      return null;
    }
    return departureAt;
  } catch {
    return null;
  }
}

function writeStoredDeparture(departureAt: number) {
  try {
    localStorage.setItem(FLIGHT_STORAGE_KEY, String(departureAt));
  } catch {
    // Private mode can refuse storage. The page still shows this visit's flight.
  }
}

/** Reuse the saved departure while this flight is still relevant. Otherwise start a new one. */
export function rememberItinerary(now: Date = new Date()): Itinerary {
  const saved = readStoredDeparture(now.getTime());
  if (saved !== null) return itineraryFromDeparture(saved);
  const created = getItinerary(now);
  writeStoredDeparture(created.departureAt);
  return created;
}
