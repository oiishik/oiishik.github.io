import { profile, type Profile } from "../config/profile";

export const BOOKING_NOT_FOUND = 'Booking not found. Try "OISHIK".';

export function matchesBooking(
  pnr: string,
  email: string,
  source: Pick<Profile, "pnr" | "email"> = profile,
) {
  return (
    pnr.trim().toLowerCase() === source.pnr.trim().toLowerCase() &&
    email.trim().toLowerCase() === source.email.trim().toLowerCase()
  );
}
