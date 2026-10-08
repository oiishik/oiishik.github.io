import { describe, expect, it } from "vitest";
import {
  addCalendarDays,
  formatLongDate,
  getItinerary,
  kolkataCivilDate,
} from "./itinerary";

function atKolkata(isoLocal: string) {
  return new Date(`${isoLocal}+05:30`);
}

describe("getItinerary", () => {
  it("departs tomorrow in Asia/Kolkata at 06:15 and arrives the same day at 10:40", () => {
    const now = atKolkata("2026-10-08T15:00:00");
    const itinerary = getItinerary(now);

    expect(itinerary.departure.date).toEqual({ year: 2026, month: 10, day: 9 });
    expect(itinerary.departure.time).toBe("06:15");
    expect(itinerary.arrival.date).toEqual(itinerary.departure.date);
    expect(itinerary.arrival.time).toBe("10:40");
    expect(itinerary.arrival.time > itinerary.departure.time).toBe(true);
    expect(itinerary.durationLabel).toBe("4h 25m");
    expect(itinerary.boardingTime).toBe("05:30");
    expect(itinerary.departureLabel).toBe("Fri, 09 Oct 2026");
    expect(itinerary.boardingPassDate).toBe("09 OCT 2026");
  });

  it("uses tomorrow relative to the live Kolkata date when no instant is passed", () => {
    const itinerary = getItinerary();
    expect(itinerary.departure.date).toEqual(addCalendarDays(kolkataCivilDate(new Date()), 1));
  });

  it("rolls the travel date into the next month", () => {
    const itinerary = getItinerary(atKolkata("2026-01-31T22:00:00"));
    expect(itinerary.departure.date).toEqual({ year: 2026, month: 2, day: 1 });
    expect(formatLongDate(itinerary.departure.date)).toBe("Sun, 01 Feb 2026");
  });

  it("rolls the travel date into the next year", () => {
    const itinerary = getItinerary(atKolkata("2026-12-31T23:00:00"));
    expect(itinerary.departure.date).toEqual({ year: 2027, month: 1, day: 1 });
    expect(itinerary.departureLabel).toBe("Fri, 01 Jan 2027");
  });

  it("treats the Kolkata midnight boundary as the next local day", () => {
    const beforeMidnight = getItinerary(new Date("2026-10-08T18:29:00Z"));
    const afterMidnight = getItinerary(new Date("2026-10-08T18:30:00Z"));

    expect(beforeMidnight.departure.date).toEqual({ year: 2026, month: 10, day: 9 });
    expect(afterMidnight.departure.date).toEqual({ year: 2026, month: 10, day: 10 });
  });
});
