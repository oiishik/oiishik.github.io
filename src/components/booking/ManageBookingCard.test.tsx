import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { profile } from "../../config/profile";
import { getItinerary, itineraryFromDeparture } from "../../lib/itinerary";
import { ManageBookingCard } from "./ManageBookingCard";

function renderCard(itinerary = getItinerary()) {
  return render(
    <MemoryRouter>
      <ManageBookingCard itinerary={itinerary} />
    </MemoryRouter>,
  );
}

function mockMatchMedia(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

afterEach(() => {
  Reflect.deleteProperty(window, "matchMedia");
});

describe("Manage booking tiles", () => {
  it("does nothing when a disabled tile is clicked", () => {
    renderCard();

    for (const name of ["Change flight", "Cancel flight"]) {
      const tile = screen.getByRole("button", { name });
      expect(tile).toBeDisabled();
      expect(tile).toHaveAttribute("aria-disabled", "true");
      tile.click();
    }

    expect(screen.getByRole("heading", { name: /manage booking/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /back to booking/i })).not.toBeInTheDocument();
  });

  it("opens the boarding pass in the same tab on a phone", () => {
    mockMatchMedia(true);
    renderCard();
    const link = screen.getByRole("link", { name: "See boarding pass" });
    expect(link).toHaveAttribute("href", "/boarding-pass");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens the boarding pass in a new tab on a wide screen", () => {
    mockMatchMedia(false);
    renderCard();
    const link = screen.getByRole("link", { name: /see boarding pass/i });
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("downloads the Drive PDF instead of opening the viewer", () => {
    renderCard();
    const link = screen.getByRole("link", { name: /download e-ticket/i });
    expect(link).toHaveAttribute("href", profile.resumePath);
    expect(link.getAttribute("href")).toContain("export=download");
    expect(link).toHaveAttribute("download");
    expect(link).not.toHaveAttribute("target");
  });

  it("adds a free add-on and keeps it on the booking after confirm", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getAllByRole("button", { name: /select add-on/i })[0]);

    const dialog = screen.getByRole("dialog", { name: /select add-ons/i });
    expect(dialog).not.toHaveTextContent("Tap +");
    const readMore = screen.getAllByRole("link", { name: /read more/i });
    expect(readMore).toHaveLength(2);
    for (const link of readMore) {
      expect(link).toHaveAttribute("href", profile.resumeViewUrl);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).not.toHaveAttribute("download");
      expect(link.getAttribute("href")).not.toContain("export=download");
    }
    expect(dialog).toHaveTextContent("Both are included with your fare");
    expect(dialog).not.toHaveTextContent("Senior Backend Engineer");
    expect(dialog).toHaveTextContent("Event-driven, automated booking confirmation.");
    expect(dialog).toHaveTextContent("Every PNR is published to SNS, so late airline responses are never lost.");
    expect(dialog).not.toHaveTextContent("30 Bookings automated in last 10min!");
    expect(screen.getByText("No add-ons selected")).toBeInTheDocument();
    expect(screen.queryByText("Add-ons can only be added before takeoff.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Add Booking Pending Confirmation" }));
    expect(screen.getByRole("button", { name: "Added: remove Booking Pending Confirmation" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("1 add-on selected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Added")).not.toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /select add-on/i })[0]);
    await user.click(screen.getByRole("button", { name: "Add Booking Pending Confirmation" }));
    await user.click(screen.getByRole("button", { name: "Add Live Flight Alerts" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(screen.getAllByText("Added")).toHaveLength(2);
    expect(screen.getByText("Booking Pending Confirmation")).toBeInTheDocument();
    expect(screen.getByText("Live Flight Alerts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /select add-on/i })).toHaveTextContent("2 added");
    expect(screen.getByRole("status")).toHaveTextContent("2 add-ons added to PNR OISHIK");
  });

  it("keeps only one How it works section open", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getAllByRole("button", { name: /select add-on/i })[0]);
    const summaries = screen.getAllByText("How it works");
    const sections = () => [...document.querySelectorAll("details")];

    await user.click(summaries[0]);
    expect(sections()[0]?.open).toBe(true);
    expect(sections()[1]?.open).toBe(false);

    await user.click(summaries[1]);
    expect(sections()[0]?.open).toBe(false);
    expect(sections()[1]?.open).toBe(true);

    await user.click(summaries[1]);
    expect(sections()[1]?.open).toBe(false);
  });

  it("opens add-ons after departure but keeps Add disabled", async () => {
    const user = userEvent.setup();
    renderCard(itineraryFromDeparture(Date.now() - 60_000));

    await user.click(screen.getAllByRole("button", { name: "Details →" })[0]);

    expect(screen.getByRole("dialog", { name: /select add-ons/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Booking Pending Confirmation" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Add Live Flight Alerts" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();
    expect(screen.getByText("Add-ons can only be added before takeoff.")).toBeInTheDocument();
    expect(screen.getAllByText("How it works").length).toBeGreaterThan(0);
  });
});
