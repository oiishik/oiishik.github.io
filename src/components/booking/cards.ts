import type { ComponentType } from "react";
import { FareBenefitsCard } from "./FareBenefitsCard";
import { FlightDetailsCard } from "./FlightDetailsCard";
import { ManageBookingCard } from "./ManageBookingCard";
import { PassengerDetailsCard } from "./PassengerDetailsCard";

export type BookingCardSpan = "full" | "main" | "side";

export const bookingCards: Array<{
  id: string;
  span: BookingCardSpan;
  Component: ComponentType;
}> = [
  { id: "flight", span: "full", Component: FlightDetailsCard },
  { id: "fare", span: "main", Component: FareBenefitsCard },
  { id: "passenger", span: "side", Component: PassengerDetailsCard },
  { id: "manage", span: "full", Component: ManageBookingCard },
];

export function cardSpanClass(span: BookingCardSpan) {
  if (span === "main") return "lg:col-span-3";
  if (span === "side") return "lg:col-span-2";
  return "lg:col-span-5";
}
