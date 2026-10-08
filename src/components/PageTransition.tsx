import { useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motionEnabled } from "../lib/motion";

export function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = root.current;
      if (!node || !motionEnabled()) return;
      gsap.fromTo(node, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    },
    { dependencies: [location.pathname], scope: root },
  );

  return (
    <div key={location.pathname} ref={root} className="flex min-h-0 w-full flex-1 flex-col">
      {outlet}
    </div>
  );
}
