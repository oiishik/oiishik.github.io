import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { itineraryFromDeparture } from "../../lib/itinerary";
import { FlightStatus } from "./FlightStatus";

afterEach(() => {
  vi.useRealTimers();
});

describe("FlightStatus", () => {
  it("ticks the countdown down once a second", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-08T15:00:00Z"));
    const itinerary = itineraryFromDeparture(Date.now() + 30 * 60 * 1000);

    render(<FlightStatus itinerary={itinerary} />);

    expect(screen.getByText(/Flight scheduled to depart in/)).toBeInTheDocument();
    expect(screen.getByText((_, node) => node?.classList.contains("odo") === true && node.textContent === "00:30:00")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText((_, node) => node?.classList.contains("odo") === true && node.textContent === "00:29:59")).toBeInTheDocument();
  });

  it("shows the gate once the departure time has passed", () => {
    vi.useFakeTimers();
    const departureAt = Date.parse("2026-10-08T15:00:00Z");
    vi.setSystemTime(new Date(departureAt + 60 * 1000));

    render(<FlightStatus itinerary={itineraryFromDeparture(departureAt)} />);

    expect(screen.getByText("Flight is ready to depart · Gate B7 · Boarding closed")).toBeInTheDocument();
  });

  it("counts down to landing while the aircraft is airborne", () => {
    vi.useFakeTimers();
    const departureAt = Date.parse("2026-10-08T15:00:00Z");
    const airborneAt = departureAt + (2 * 60 + 30) * 1000;
    vi.setSystemTime(new Date(airborneAt));

    render(<FlightStatus itinerary={itineraryFromDeparture(departureAt)} />);

    expect(screen.getByText(/Flight departed · Lands in/)).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Flight progress" })).toHaveAttribute("aria-valuenow", "0");
  });

  it("shows the arrival once the duration is over", () => {
    vi.useFakeTimers();
    const departureAt = Date.parse("2026-10-08T15:00:00Z");
    const itinerary = itineraryFromDeparture(departureAt);
    vi.setSystemTime(new Date(itinerary.arrivalAt));

    render(<FlightStatus itinerary={itinerary} />);

    expect(
      screen.getByText(
        `Flight landed in Pune · Arrived ${itinerary.arrival.time} · PNQ`,
      ),
    ).toBeInTheDocument();
  });
});
