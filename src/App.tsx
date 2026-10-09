import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { SiteShell } from "./components/SiteShell";
import { ThemeProvider } from "./components/ThemeProvider";
import { profile } from "./config/profile";
import { BoardingPassPage } from "./pages/BoardingPassPage";
import { BookingPage } from "./pages/BookingPage";
import { HomePage } from "./pages/HomePage";
import { PastBookingPage } from "./pages/PastBookingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TripsPage } from "./pages/TripsPage";

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
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
