import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { ThemeProvider } from "../components/ThemeProvider";
import { profile } from "../config/profile";

function LocationProbe() {
  const { pathname } = useLocation();
  return <div data-testid="path">{pathname}</div>;
}

function renderAt(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <LocationProbe />
        <AppRoutes />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("Home retrieve booking", () => {
  it("shows the PNR and email as fixed values", () => {
    renderAt();

    const pnr = screen.getByLabelText(/pnr/i);
    const email = screen.getByLabelText(/email address/i);

    expect(pnr).toHaveValue(profile.pnr);
    expect(pnr).toHaveAttribute("readonly");
    expect(email).toHaveValue(profile.email);
    expect(email).toHaveAttribute("readonly");
  });

  it("opens the booking with the prefilled values", async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole("button", { name: /view booking/i }));

    expect(await screen.findByRole("heading", { name: "OISHIK" })).toBeInTheDocument();
    expect(screen.getByTestId("path")).toHaveTextContent("/trips/OISHIK");
  });
});
