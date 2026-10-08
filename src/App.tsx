import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteShell } from "./components/SiteShell";
import { ThemeProvider } from "./components/ThemeProvider";
import { BoardingPassPage } from "./pages/BoardingPassPage";
import { BookingPage } from "./pages/BookingPage";
import { HomePage } from "./pages/HomePage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
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
