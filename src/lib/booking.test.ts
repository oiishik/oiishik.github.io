import { describe, expect, it } from "vitest";
import { profile } from "../config/profile";
import { bookingMismatchMessage, matchesBooking } from "./booking";

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

describe("bookingMismatchMessage", () => {
  it("names the correct email when only the email is wrong", () => {
    expect(bookingMismatchMessage(profile.pnr, "oishiksengupta@gmail.com")).toBe(
      'Booking not found. Try email "oishik8sengupta@gmail.com".',
    );
  });

  it("names the correct PNR when only the PNR is wrong", () => {
    expect(bookingMismatchMessage("ABC123", profile.email)).toBe('Booking not found. Try PNR "OISHIK".');
  });

  it("rejects an email without @ or .com", () => {
    expect(bookingMismatchMessage(profile.pnr, "oishik8sengupta")).toBe(
      "Enter a valid email with @ and .com.",
    );
    expect(bookingMismatchMessage(profile.pnr, "oishik8sengupta@gmail")).toBe(
      "Enter a valid email with @ and .com.",
    );
  });

  it("names the PNR and the email format when both fail", () => {
    expect(bookingMismatchMessage("ABC", "not-an-email")).toBe(
      'Booking not found. Try PNR "OISHIK". Enter a valid email with @ and .com.',
    );
  });

  it("names both when the PNR and email are wrong", () => {
    expect(bookingMismatchMessage("ABC123", "someone@example.com")).toBe(
      'Booking not found. Try PNR "OISHIK" and email "oishik8sengupta@gmail.com".',
    );
  });
});
