import { profile } from "../config/profile";

type CountVars = {
  path: string;
  title?: string;
  event?: boolean;
};

declare global {
  interface Window {
    goatcounter?: {
      count: (vars: CountVars) => void;
    };
  }
}

const pending: CountVars[] = [];
let flushing = false;

function send(vars: CountVars) {
  window.goatcounter?.count(vars);
}

function flush() {
  if (!window.goatcounter?.count) return false;
  while (pending.length > 0) {
    const vars = pending.shift();
    if (vars) send(vars);
  }
  return true;
}

function scheduleFlush() {
  if (flushing) return;
  flushing = true;
  const started = Date.now();
  const timer = window.setInterval(() => {
    const done = flush() || Date.now() - started > 8000;
    if (!done) return;
    window.clearInterval(timer);
    flushing = false;
    if (pending.length > 0) scheduleFlush();
  }, 200);
}

export function trackEvent(path: string, title: string) {
  const vars: CountVars = { path, title, event: true };
  if (window.goatcounter?.count) {
    send(vars);
    return;
  }
  if (!document.querySelector("script[data-goatcounter]")) return;
  pending.push(vars);
  scheduleFlush();
}

export function visitEvent(pathname: string) {
  if (pathname === "/") return { path: "visit-landing", title: "Visited landing page" };
  if (pathname === "/profile") return { path: "visit-profile", title: "Visited profile page" };
  if (pathname === "/boarding-pass") return { path: "visit-boarding-pass", title: "Visited boarding pass page" };
  if (pathname.toUpperCase() === `/trips/${profile.pnr}`.toUpperCase()) {
    return { path: "visit-oishik", title: "Visited OISHIK page" };
  }
  return null;
}
