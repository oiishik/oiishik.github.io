import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FlightDetailsCard } from "./FlightDetailsCard";

describe("Flight stops", () => {
  it("expands and collapses the route", async () => {
    const user = userEvent.setup();
    render(<FlightDetailsCard />);

    const toggle = screen.getByRole("button", { name: /3 stops/i });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("AlgoDomain Solutions")).toBeVisible();
    expect(screen.getByText("AnalytixKraft")).toBeVisible();
    expect(screen.getByText("udChalo")).toBeVisible();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("AlgoDomain Solutions")).not.toBeVisible();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("AlgoDomain Solutions")).toBeVisible();
    expect(screen.getByText("udChalo")).toBeVisible();
  });
});
