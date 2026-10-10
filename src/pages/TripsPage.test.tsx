import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { PastBookingPage } from "./PastBookingPage";
import { ProfilePage } from "./ProfilePage";
import { TripsPage } from "./TripsPage";

afterEach(() => {
  localStorage.clear();
});

describe("TripsPage", () => {
  it("lists the live booking first, then completed and cancelled trips", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <TripsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Trips" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Kolkata/ })).toBeInTheDocument();
    expect(screen.queryByText("K7QX2M")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /completed/i }));
    expect(screen.getByText(/K7QX2M/)).toBeInTheDocument();
    expect(screen.getByText(/M8FZ4H/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /cancelled/i }));
    expect(screen.getByText(/T5HV8D/)).toBeInTheDocument();
    expect(screen.getByText(/Refunded/)).toBeInTheDocument();
  });

  it("moves OISHIK to completed for the 15 minutes after landing", async () => {
    const user = userEvent.setup();
    const landedForFiveMinutes = Date.now() - (90 + 5) * 60 * 1000;
    localStorage.setItem("sde-flight-departure", String(landedForFiveMinutes));

    render(
      <MemoryRouter>
        <TripsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("tab", { name: /upcoming/i })).toHaveTextContent("0");
    expect(screen.queryByRole("heading", { name: /Kolkata/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /completed/i }));

    expect(screen.getByRole("tab", { name: /completed/i })).toHaveTextContent("5");
    const headings = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(headings[0]).toMatch(/Kolkata/);
    expect(headings[1]).toMatch(/Hyderabad/);
    expect(screen.getByText(/K7QX2M/)).toBeInTheDocument();
  });
});

describe("PastBookingPage", () => {
  it("shows a completed trip as already flown", () => {
    render(
      <MemoryRouter initialEntries={["/trips/K7QX2M"]}>
        <Routes>
          <Route path="/trips/:pnr" element={<PastBookingPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "K7QX2M" })).toBeInTheDocument();
    expect(screen.getByText(/Flight completed on Fri, 18 Sep/)).toBeInTheDocument();
    expect(screen.getByText("Baggage belt 3")).toBeInTheDocument();
    expect(screen.getByText("Change flight").closest("p")).toHaveTextContent("Unavailable");
    expect(screen.getByRole("link", { name: /contact support/i })).toHaveAttribute(
      "href",
      "mailto:oishik8sengupta@gmail.com",
    );
  });

  it("shows the cancellation record", () => {
    render(
      <MemoryRouter initialEntries={["/trips/T5HV8D"]}>
        <Routes>
          <Route path="/trips/:pnr" element={<PastBookingPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Booking cancelled on Tue, 18 Aug 2026/)).toBeInTheDocument();
    expect(screen.getByText("Full fare")).toBeInTheDocument();
  });
});

describe("ProfilePage", () => {
  it("shows the gold membership", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Oishik Sengupta/ })).toBeInTheDocument();
    expect(screen.getByText(/Gold member/)).toBeInTheDocument();
    expect(screen.getAllByText("OS14012000").length).toBeGreaterThan(0);
    expect(screen.queryByText("Platinum is 4 more years away.")).not.toBeInTheDocument();
    expect(screen.queryByText(/Flights taken/)).not.toBeInTheDocument();
    expect(screen.getByText("Travel and airline tech")).toBeInTheDocument();
    expect(screen.queryByText("Locked")).not.toBeInTheDocument();
  });
});
