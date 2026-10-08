import { describe, expect, it } from "vitest";
import { profile } from "../config/profile";
import { BOOKING_NOT_FOUND, matchesBooking } from "./booking";

describe("matchesBooking", () => {
  it("accepts the configured PNR and email", () => {
    expect(matchesBooking(profile.pnr, profile.email)).toBe(true);
  });

  it("trims whitespace and ignores case", () => {
    expect(matchesBooking("  oishik  ", "  Oishik8Sengupta@Gmail.com  ")).toBe(true);
  });

  it("rejects a wrong PNR", () => {
    expect(matchesBooking("ABC123", profile.email)).toBe(false);
  });

  it("rejects a wrong email", () => {
    expect(matchesBooking(profile.pnr, "someone@example.com")).toBe(false);
  });

  it("rejects when either value is empty", () => {
    expect(matchesBooking("   ", profile.email)).toBe(false);
    expect(matchesBooking(profile.pnr, "   ")).toBe(false);
  });
});

describe("booking error copy", () => {
  it("uses the required message", () => {
    expect(BOOKING_NOT_FOUND).toBe('Booking not found. Try "OISHIK".');
  });
});
