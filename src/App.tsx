import { lazy, useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { SiteShell } from "./components/SiteShell";
import { ThemeProvider } from "./components/ThemeProvider";
import { profile } from "./config/profile";
import { trackEvent } from "./lib/goatcounter";
import { HomePage } from "./pages/HomePage";

const BookingPage = lazy(() => import("./pages/BookingPage").then((module) => ({ default: module.BookingPage })));
const PastBookingPage = lazy(() =>
  import("./pages/PastBookingPage").then((module) => ({ default: module.PastBookingPage })),
);
const ProfilePage = lazy(() => import("./pages/ProfilePage").then((module) => ({ default: module.ProfilePage })));
const TripsPage = lazy(() => import("./pages/TripsPage").then((module) => ({ default: module.TripsPage })));
const BoardingPassPage = lazy(() =>
  import("./pages/BoardingPassPage").then((module) => ({ default: module.BoardingPassPage })),
);

function GoatCounterPageViews() {
  const location = useLocation();
  const initial = useRef(true);

  useEffect(() => {
    if (!initial.current) {
      window.goatcounter?.count({
        path: `${location.pathname}${location.search}`,
      });
    } else {
      initial.current = false;
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("mailto:")) trackEvent("click-email", "Clicked email");
      if (link.hasAttribute("download")) trackEvent("download-e-ticket", "Downloaded e-ticket");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

function TripPage() {
  const { pnr = "" } = useParams();
  if (pnr.toUpperCase() === profile.pnr) return <BookingPage />;
  return <PastBookingPage />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<Navigate to={`/trips/${profile.pnr}`} replace />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:pnr" element={<TripPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/boarding-pass" element={<BoardingPassPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <GoatCounterPageViews />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
