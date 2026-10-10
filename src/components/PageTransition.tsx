import { Suspense } from "react";
import { useLocation, useOutlet } from "react-router-dom";

export function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div key={location.pathname} className="page-enter flex min-h-0 w-full flex-1 flex-col">
      <Suspense fallback={<div className="min-h-0 flex-1" />}>{outlet}</Suspense>
    </div>
  );
}
