import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingPage } from "./BookingPage";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("BookingPage", () => {
  it("starts the departure timer only after the booking data arrives", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-08T15:00:00Z"));

    render(
      <MemoryRouter>
        <BookingPage />
      </MemoryRouter>,
    );

    expect(screen.queryByText(/Flight scheduled to depart in/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "OISHIK" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/Flight scheduled to depart in/)).toBeInTheDocument();
    expect(screen.getByText("00:30:00")).toBeInTheDocument();
  });

  it("copies the PNR", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(
      <MemoryRouter>
        <BookingPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Copy booking reference" }));

    expect(writeText).toHaveBeenCalledWith("OISHIK");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });
});
