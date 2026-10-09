import { afterEach, describe, expect, it } from "vitest";
import {
  flightPhase,
  flightTrackProgress,
  formatDepartureCountdown,
  getItinerary,
  kolkataCivilDate,
  rememberItinerary,
} from "./itinerary";

function atKolkata(isoLocal: string) {
  return new Date(`${isoLocal}+05:30`);
}

describe("getItinerary", () => {
  it("departs 15 minutes after the visit and lands 1h 30m later", () => {
    const now = atKolkata("2026-10-08T20:31:00");
    const itinerary = getItinerary(now);

    expect(itinerary.departure.date).toEqual({ year: 2026, month: 10, day: 8 });
    expect(itinerary.departure.time).toBe("20:46");
    expect(itinerary.arrival.date).toEqual({ year: 2026, month: 10, day: 8 });
    expect(itinerary.arrival.time).toBe("22:16");
    expect(itinerary.durationLabel).toBe("1h 30m");
    expect(itinerary.boardingTime).toBe("20:01");
    expect(itinerary.departureLabel).toBe("Thu, 08 Oct 2026");
    expect(itinerary.arrivalLabel).toBe("Thu, 08 Oct 2026");
    expect(itinerary.boardingPassDate).toBe("08 OCT 2026");
    expect(itinerary.departureAt).toBe(now.getTime() + 15 * 60 * 1000);
  });

  it("keeps the duration fixed when the visit is in the morning", () => {
    const itinerary = getItinerary(atKolkata("2026-10-08T09:00:00"));
    expect(itinerary.departure.time).toBe("09:15");
    expect(itinerary.arrival.time).toBe("10:45");
    expect(itinerary.arrival.date).toEqual(itinerary.departure.date);
    expect(itinerary.durationLabel).toBe("1h 30m");
  });

  it("rolls departure into the next day after 23:59", () => {
    const itinerary = getItinerary(atKolkata("2026-10-08T23:50:00"));
    expect(itinerary.departure).toEqual({
      date: { year: 2026, month: 10, day: 9 },
      time: "00:05",
    });
    expect(itinerary.arrival).toEqual({
      date: { year: 2026, month: 10, day: 9 },
      time: "01:35",
    });
    expect(itinerary.boardingTime).toBe("23:20");
  });

  it("rolls arrival into the next day when departure is late", () => {
    const itinerary = getItinerary(atKolkata("2026-10-08T23:00:00"));
    expect(itinerary.departure.time).toBe("23:15");
    expect(itinerary.departure.date).toEqual({ year: 2026, month: 10, day: 8 });
    expect(itinerary.arrival.time).toBe("00:45");
    expect(itinerary.arrival.date).toEqual({ year: 2026, month: 10, day: 9 });
  });

  it("rolls the departure date into the next month", () => {
    const itinerary = getItinerary(atKolkata("2026-01-31T23:50:00"));
    expect(itinerary.departure.date).toEqual({ year: 2026, month: 2, day: 1 });
    expect(itinerary.departure.time).toBe("00:05");
    expect(itinerary.arrivalLabel).toBe("Sun, 01 Feb 2026");
  });

  it("rolls the departure date into the next year", () => {
    const itinerary = getItinerary(atKolkata("2026-12-31T23:50:00"));
    expect(itinerary.departure.date).toEqual({ year: 2027, month: 1, day: 1 });
    expect(itinerary.departure.time).toBe("00:05");
    expect(itinerary.departureLabel).toBe("Fri, 01 Jan 2027");
  });

  it("treats the Kolkata midnight boundary as the next local day", () => {
    const beforeMidnight = getItinerary(new Date("2026-10-08T18:29:00Z"));
    const afterMidnight = getItinerary(new Date("2026-10-08T18:30:00Z"));

    expect(kolkataCivilDate(new Date("2026-10-08T18:29:00Z"))).toEqual({
      year: 2026,
      month: 10,
      day: 8,
    });
    expect(beforeMidnight.departure).toEqual({
      date: { year: 2026, month: 10, day: 9 },
      time: "00:14",
    });
    expect(afterMidnight.departure).toEqual({
      date: { year: 2026, month: 10, day: 9 },
      time: "00:15",
    });
  });
});

describe("flightPhase", () => {
  const departureAt = Date.parse("2026-10-08T15:00:00Z");
  const arrivalAt = departureAt + (1 * 60 + 30) * 60 * 1000;

  it("moves from the gate to the air and then to landed", () => {
    expect(flightPhase(departureAt, arrivalAt, departureAt - 1)).toBe("countdown");
    expect(flightPhase(departureAt, arrivalAt, departureAt)).toBe("ready");
    expect(flightPhase(departureAt, arrivalAt, departureAt + (2 * 60 + 30) * 1000 - 1)).toBe("ready");
    expect(flightPhase(departureAt, arrivalAt, departureAt + (2 * 60 + 30) * 1000)).toBe("departed");
    expect(flightPhase(departureAt, arrivalAt, arrivalAt - 1)).toBe("departed");
    expect(flightPhase(departureAt, arrivalAt, arrivalAt)).toBe("landed");
  });

  it("keeps the aircraft at the origin until it leaves the gate", () => {
    expect(flightTrackProgress(departureAt, arrivalAt, departureAt + 2 * 60 * 1000)).toBe(0);
    expect(flightTrackProgress(departureAt, arrivalAt, arrivalAt)).toBe(1);
  });
});

describe("rememberItinerary", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("keeps the same departure when the page is opened again", () => {
    const first = rememberItinerary(new Date("2026-10-08T15:00:00Z"));
    const later = rememberItinerary(new Date("2026-10-08T16:00:00Z"));
    expect(later.departureAt).toBe(first.departureAt);
    expect(later.arrivalAt - later.departureAt).toBe((1 * 60 + 30) * 60 * 1000);
  });

  it("starts a new flight after the saved one has been finished for a while", () => {
    const first = rememberItinerary(new Date("2026-10-08T15:00:00Z"));
    const muchLater = new Date(first.arrivalAt + 15 * 60 * 1000 + 1);
    const next = rememberItinerary(muchLater);
    expect(next.departureAt).not.toBe(first.departureAt);
  });
});

describe("formatDepartureCountdown", () => {
  const start = Date.parse("2026-10-08T15:00:00Z");

  it("starts at 01:20:00 and counts down by whole seconds", () => {
    const departureAt = start + (1 * 60 + 20) * 60 * 1000;
    expect(formatDepartureCountdown(departureAt, start)).toBe("01:20:00");
    expect(formatDepartureCountdown(departureAt, start + 1000)).toBe("01:19:59");
    expect(formatDepartureCountdown(departureAt, start + 60 * 1000)).toBe("01:19:00");
  });

  it("holds at 00:00:00 after departure", () => {
    expect(formatDepartureCountdown(start, start)).toBe("00:00:00");
    expect(formatDepartureCountdown(start, start + 5000)).toBe("00:00:00");
  });
});
