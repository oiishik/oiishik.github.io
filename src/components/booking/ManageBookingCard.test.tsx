import { render, screen } from "@testing-library/react";
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
});
