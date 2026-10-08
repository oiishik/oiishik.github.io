import { profile, type Profile } from "../config/profile";

type BookingFields = Pick<Profile, "pnr" | "email">;

function same(value: string, expected: string) {
  return value.trim().toLowerCase() === expected.trim().toLowerCase();
}

/** Local part, @, and a .com domain. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.com$/i;

export const PNR_MAX_LENGTH = 6;

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

export function matchesBooking(pnr: string, email: string, source: BookingFields = profile) {
  return same(pnr, source.pnr) && same(email, source.email);
}

/** Names only the fields that do not match, and shows the correct value for each. */
export function bookingMismatchMessage(pnr: string, email: string, source: BookingFields = profile) {
  const pnrOk = same(pnr, source.pnr);
  const formatOk = isValidEmail(email);
  const emailOk = formatOk && same(email, source.email);

  if (!formatOk && !pnrOk) {
    return `Booking not found. Try PNR "${source.pnr}". Enter a valid email with @ and .com.`;
  }
  if (!formatOk) return "Enter a valid email with @ and .com.";
  if (!pnrOk && !emailOk) {
    return `Booking not found. Try PNR "${source.pnr}" and email "${source.email}".`;
  }
  if (!pnrOk) return `Booking not found. Try PNR "${source.pnr}".`;
  return `Booking not found. Try email "${source.email}".`;
}
