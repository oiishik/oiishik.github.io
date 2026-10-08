import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { profile } from "../../config/profile";
import { ManageBookingCard } from "./ManageBookingCard";

function renderCard() {
  return render(
    <MemoryRouter>
      <ManageBookingCard />
    </MemoryRouter>,
  );
}

describe("Manage booking tiles", () => {
  it("does nothing when a disabled tile is clicked", () => {
    renderCard();

    for (const name of ["Change Flight", "Cancel Flight"]) {
      const tile = screen.getByRole("button", { name });
      expect(tile).toBeDisabled();
      expect(tile).toHaveAttribute("aria-disabled", "true");
      tile.click();
    }

    expect(screen.getByRole("heading", { name: /manage booking/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /back to booking/i })).not.toBeInTheDocument();
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

    await user.click(screen.getByRole("button", { name: /select add-on/i }));

    const dialog = screen.getByRole("dialog", { name: /select add-ons/i });
    expect(dialog).not.toHaveTextContent("Tap +");
    const readMore = screen.getAllByRole("link", { name: "Read More here." });
    expect(readMore).toHaveLength(2);
    for (const link of readMore) {
      expect(link).toHaveAttribute("href", profile.resumeViewUrl);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).not.toHaveAttribute("download");
      expect(link.getAttribute("href")).not.toContain("export=download");
    }
    expect(dialog).toHaveTextContent("Included with your fare");
    expect(dialog).not.toHaveTextContent("Senior Backend Engineer");
    expect(dialog).toHaveTextContent("30 Bookings automated in last 10min!");
    expect(dialog).toHaveTextContent("100–200 flights already subscribed!");
    expect(screen.getByText("No add-ons selected")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Add +" })[0]);
    expect(screen.getByRole("button", { name: "Added" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("1 add-on selected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("ADD-ONS ON THIS BOOKING")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /select add-on/i }));
    await user.click(screen.getAllByRole("button", { name: "Add +" })[0]);
    await user.click(screen.getByRole("button", { name: "Add +" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(screen.getByText("ADD-ONS ON THIS BOOKING")).toBeInTheDocument();
    expect(screen.getByText("Booking Pending Confirmation")).toBeInTheDocument();
    expect(screen.getByText("Live Flight Alerts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /select add-on/i })).toHaveTextContent("2 added");
    expect(screen.getByRole("status")).toHaveTextContent("2 add-ons added to PNR OISHIK");
  });
});
