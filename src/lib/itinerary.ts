/**
 * Departure, arrival, duration, and boarding time for the booking and the
 * boarding pass. Both screens call this so the dates always match.
 *
 * Departure stays 06:15. Landing is 10:40, and the duration is the
 * difference between those two clocks. Boarding is 45 minutes earlier.
 */

export const KOLKATA_TIME_ZONE = "Asia/Kolkata";

const DEPARTURE_MINUTES = 6 * 60 + 15;
const ARRIVAL_MINUTES = 10 * 60 + 40;
const BOARDING_LEAD_MINUTES = 45;

export type CivilDate = {
  year: number;
  month: number;
  day: number;
};

export type Itinerary = {
  departure: { date: CivilDate; time: string };
  arrival: { date: CivilDate; time: string };
  boardingTime: string;
  durationLabel: string;
  departureLabel: string;
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

function clockFromMinutes(totalMinutes: number) {
  let minutes = totalMinutes;
  let dayOffset = 0;

  while (minutes < 0) {
    minutes += 24 * 60;
    dayOffset -= 1;
  }

  while (minutes >= 24 * 60) {
    minutes -= 24 * 60;
    dayOffset += 1;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return {
    time: `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
    dayOffset,
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

export function getItinerary(now: Date = new Date()): Itinerary {
  const travelDate = addCalendarDays(kolkataCivilDate(now), 1);
  const departure = clockFromMinutes(DEPARTURE_MINUTES);
  const arrival = clockFromMinutes(ARRIVAL_MINUTES);
  const boarding = clockFromMinutes(DEPARTURE_MINUTES - BOARDING_LEAD_MINUTES);

  let durationMinutes = ARRIVAL_MINUTES - DEPARTURE_MINUTES;
  if (durationMinutes < 0) durationMinutes += 24 * 60;

  return {
    departure: { date: travelDate, time: departure.time },
    arrival: {
      date: addCalendarDays(travelDate, arrival.dayOffset),
      time: arrival.time,
    },
    boardingTime: boarding.time,
    durationLabel: formatDuration(durationMinutes),
    departureLabel: formatLongDate(travelDate),
    boardingPassDate: formatBoardingPassDate(travelDate),
  };
}
