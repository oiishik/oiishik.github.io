export type Addon = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  icon: string;
  was: string;
  points: string[];
  how: string[];
  builtWith: string[];
};

export const addons: Addon[] = [
  {
    id: "pending-confirmation",
    title: "Booking Pending Confirmation",
    subtitle: "Event-driven, automated booking confirmation.",
    summary: "Get your booking confirmed automatically, even when the airline responds late.",
    icon: "/icons/pending.png",
    was: "INR 120",
    points: [
      "Booking confirmed even if the airline responds late.",
      "Status updates live on your confirmation page, no refresh needed.",
    ],
    how: [
      "Every PNR is published to SNS, so late airline responses are never lost.",
      "Reconciliation compares supplier and database status: successful bookings are confirmed, pending ones wait in SQS.",
      "Server-Sent Events move your page from pending to confirmed or refunded in real time.",
    ],
    builtWith: ["AWS Lambda", "SNS", "SQS", "API Gateway", "Node.js", "TypeScript", "React"],
  },
  {
    id: "live-flight-alerts",
    title: "Live Flight Alerts",
    subtitle: "Real-time flight updates, straight to WhatsApp.",
    summary: "Get real-time flight status updates on WhatsApp.",
    icon: "/icons/flight-status.png",
    was: "INR 50",
    points: [
      "Instant delay and gate updates on WhatsApp.",
      "Everyone on your booking gets the same update, at the same time.",
    ],
    how: [
      "One provider subscription per flight, fanned out internally to every passenger.",
      "DynamoDB for flight status and subscriptions; RDS for user-to-flight mappings.",
      "Token-secured webhooks, optimistic locking and timestamp checks for duplicate or out-of-order events.",
    ],
    builtWith: ["AWS Lambda", "DynamoDB", "RDS", "SNS", "API Gateway", "WhatsApp Meta API"],
  },
];
