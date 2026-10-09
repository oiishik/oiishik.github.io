export type TripStop = "Non-stop" | "3 stops";

export type PastTrip = {
  pnr: string;
  status: "completed" | "cancelled";
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  departureTime: string;
  arrivalTime: string;
  /** Day label without the year, as drawn on the trip card. */
  dayLabel: string;
  dateLabel: string;
  flight: string;
  duration: string;
  stops: TripStop;
  seat?: string;
  belt?: string;
  cancelledOn?: string;
};

export const completedTrips: PastTrip[] = [
  {
    pnr: "K7QX2M",
    status: "completed",
    origin: { code: "HYD", city: "Hyderabad" },
    destination: { code: "PNQ", city: "Pune" },
    departureTime: "06:40",
    arrivalTime: "08:05",
    dayLabel: "Fri, 18 Sep",
    dateLabel: "Fri, 18 Sep 2026",
    flight: "SDE 214",
    duration: "1h 25m",
    stops: "Non-stop",
    seat: "2A",
    belt: "3",
  },
  {
    pnr: "R3TB9L",
    status: "completed",
    origin: { code: "PNQ", city: "Pune" },
    destination: { code: "HYD", city: "Hyderabad" },
    departureTime: "19:10",
    arrivalTime: "20:35",
    dayLabel: "Sun, 2 Aug",
    dateLabel: "Sun, 2 Aug 2026",
    flight: "SDE 215",
    duration: "1h 25m",
    stops: "Non-stop",
    seat: "3C",
  },
  {
    pnr: "W2NC6P",
    status: "completed",
    origin: { code: "CJB", city: "Coimbatore" },
    destination: { code: "BOM", city: "Mumbai" },
    departureTime: "16:45",
    arrivalTime: "18:35",
    dayLabel: "Fri, 5 Jun",
    dateLabel: "Fri, 5 Jun 2026",
    flight: "SDE 432",
    duration: "1h 50m",
    stops: "Non-stop",
    seat: "5F",
  },
  {
    pnr: "M8FZ4H",
    status: "completed",
    origin: { code: "BOM", city: "Mumbai" },
    destination: { code: "CJB", city: "Coimbatore" },
    departureTime: "11:20",
    arrivalTime: "13:15",
    dayLabel: "Sat, 30 May",
    dateLabel: "Sat, 30 May 2026",
    flight: "SDE 431",
    duration: "1h 55m",
    stops: "Non-stop",
    seat: "1A",
  },
];

export const cancelledTrips: PastTrip[] = [
  {
    pnr: "T5HV8D",
    status: "cancelled",
    origin: { code: "CCU", city: "Kolkata" },
    destination: { code: "BLR", city: "Bengaluru" },
    departureTime: "07:15",
    arrivalTime: "09:50",
    dayLabel: "Tue, 25 Aug",
    dateLabel: "Tue, 25 Aug 2026",
    flight: "SDE 116",
    duration: "2h 35m",
    stops: "Non-stop",
    cancelledOn: "Tue, 18 Aug 2026",
  },
];

export function findPastTrip(pnr: string) {
  return [...completedTrips, ...cancelledTrips].find((trip) => trip.pnr === pnr) ?? null;
}
