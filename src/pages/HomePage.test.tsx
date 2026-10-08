import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../App";
import { ThemeProvider } from "../components/ThemeProvider";

function renderAt(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("Home retrieve booking", () => {
  it("opens the booking with the prefilled values", async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole("button", { name: /view booking/i }));

    expect(await screen.findByRole("heading", { name: /pnr oishik/i })).toBeInTheDocument();
  });

  it("accepts a lowercase PNR when the email matches", async () => {
    const user = userEvent.setup();
    renderAt();

    const pnr = screen.getByLabelText(/pnr/i);
    await user.clear(pnr);
    await user.type(pnr, "oishik");
    await user.click(screen.getByRole("button", { name: /view booking/i }));

    expect(await screen.findByRole("heading", { name: /pnr oishik/i })).toBeInTheDocument();
  });

  it("shows an error and stays on the form when the booking does not match", async () => {
    const user = userEvent.setup();
    renderAt();

    const email = screen.getByLabelText(/email address/i);
    await user.clear(email);
    await user.type(email, "wrong@example.com");
    await user.click(screen.getByRole("button", { name: /view booking/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      'Booking not found. Try email "oishik8sengupta@gmail.com".',
    );
    expect(screen.getByRole("heading", { name: /manage your booking/i })).toBeInTheDocument();
  });

  it("clears the error when either field changes", async () => {
    const user = userEvent.setup();
    renderAt();

    const pnr = screen.getByLabelText(/pnr/i);
    await user.clear(pnr);
    await user.type(pnr, "NOPE");
    await user.click(screen.getByRole("button", { name: /view booking/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.type(pnr, "1");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps the PNR to 6 characters", async () => {
    const user = userEvent.setup();
    renderAt();

    const pnr = screen.getByLabelText(/pnr/i);
    await user.clear(pnr);
    await user.type(pnr, "DADFAFFDFDFD");

    expect(pnr).toHaveValue("DADFAF");
  });

  it("rejects an email that has no @ or .com", async () => {
    const user = userEvent.setup();
    renderAt();

    const email = screen.getByLabelText(/email address/i);
    await user.clear(email);
    await user.type(email, "oishik8sengupta");
    await user.click(screen.getByRole("button", { name: /view booking/i }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email with @ and .com.");
  });

  it("fills the email when a suggestion is hovered", async () => {
    const user = userEvent.setup();
    renderAt();

    const email = screen.getByLabelText(/email address/i);
    await user.clear(email);
    await user.type(email, "oishik@");
    await user.hover(screen.getByRole("option", { name: "oishik@outlook.com" }));

    expect(email).toHaveValue("oishik@outlook.com");
    expect(screen.getByRole("option", { name: "oishik@gmail.com" })).toBeInTheDocument();
  });

  it("submits when Enter is pressed in a field", async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByLabelText(/email address/i));
    await user.keyboard("{Enter}");

    expect(await screen.findByRole("heading", { name: /pnr oishik/i })).toBeInTheDocument();
  });
});
