import { Link, useLocation } from "react-router-dom";
import { profile } from "../config/profile";
import { CurrentIcon } from "./BrandIcon";

const pnrPath = /^\/trips\/[^/]+$/;

/** Set to true to show Trips and View Booking in the navbar. The booking screen stays reachable from Manage Booking either way. */
const tripsNavEnabled = false;

export function accountLinks(pathname: string) {
  const onPnr = pnrPath.test(pathname);
  const links = [
    { to: "/", label: "Manage Booking", icon: "/icons/appointment.png", active: pathname === "/" },
    {
      to: onPnr ? pathname : `/trips/${profile.pnr}`,
      label: "View Booking",
      icon: "/icons/booking.png",
      active: onPnr,
    },
    { to: "/trips", label: "Trips", icon: "/icons/travel-agency.png", active: pathname === "/trips" },
    { to: "/profile", label: "Profile", icon: "/icons/user.png", active: pathname === "/profile" },
  ];
  return tripsNavEnabled ? links : links.filter((link) => link.label !== "Trips" && link.label !== "View Booking");
}

export function AccountNav() {
  const { pathname } = useLocation();
  const visible = pathname === "/profile" || pathname.startsWith("/trips");
  if (!visible) return null;

  const links = accountLinks(pathname);

  return (
    <nav aria-label="Account" className="border-b border-line bg-page">
      <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-5 sm:px-8 lg:px-12">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            aria-current={link.active ? "page" : undefined}
            className={`nav-tab inline-flex shrink-0 items-center gap-2 py-3 text-sm font-semibold ${
              link.active ? "text-brand" : "text-ink"
            }`}
          >
            <CurrentIcon src={link.icon} />
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
