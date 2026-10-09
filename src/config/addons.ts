export type Addon = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  icon: string;
  was: string;
  proof: string;
  points: string[];
  how: string[];
  builtWith: string[];
};

export const addons: Addon[] = [
  {
    id: "pending-confirmation",
    title: "Booking Pending Confirmation",
    subtitle: "Event-Driven Automated Booking Pending Confirmation",
    summary: "Get your booking confirmed automatically, even when the airline responds late.",
    icon: "/icons/pending.png",
    was: "INR 120",
    proof: "30 Bookings automated in last 10min!",
    points: [
      "Booking confirmed even if the airline responds late.",
      "Status updates live on your confirmation page, no refresh needed.",
    ],
    how: [
      "When an airline responds after the API timeout, the PNR exists with the supplier but has no database record. In this feature, every PNR is published to SNS.",
      "Reconciliation compares supplier and database status.",
      "Successful bookings are confirmed.",
      "Pending ones wait in SQS until auto-confirmation or failure.",
      "Server-Sent Events move your confirmation page from pending to confirmed or refunded in real time.",
    ],
    builtWith: ["AWS Lambda", "SNS", "SQS", "API Gateway", "Node.js", "TypeScript", "React"],
  },
  {
    id: "live-flight-alerts",
    title: "Live Flight Alerts",
    subtitle: "Real-time flight updates, straight to WhatsApp",
    summary: "Get real-time flight status updates on WhatsApp.",
    icon: "/icons/flight-status.png",
    was: "INR 50",
    proof: "100–200 flights already subscribed!",
    points: [
      "Instant delay and gate updates on WhatsApp.",
      "Everyone on your booking gets the same update, at the same time.",
    ],
    how: [
      "Provider subscriptions are deduplicated to one per flight, with internal fan-out to passengers.",
      "DynamoDB handles flight status and subscription lookups; RDS stores user-to-flight mappings.",
      "Provider webhooks are secured with token auth.",
      "Optimistic locking with retries and timestamp-based handling for duplicate or out-of-order events.",
    ],
    builtWith: ["AWS Lambda", "DynamoDB", "RDS", "SNS", "API Gateway", "WhatsApp Meta API"],
  },
];
