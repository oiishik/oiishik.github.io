import { useLayoutEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import { flightLabel, profile } from "../config/profile";
import { ArrowLeftIcon } from "../components/icons";
import { BrandIcon, SdeMark } from "../components/BrandIcon";
import { getItinerary } from "../lib/itinerary";

const QR_LABEL = "QR code linking to Oishik Sengupta's LinkedIn profile";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold sm:text-base">{value}</p>
    </div>
  );
}

export function BoardingPassPage() {
  const itinerary = getItinerary();
  const passenger = profile.name.toUpperCase();
  const frameRef = useRef<HTMLDivElement>(null);
  const passRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const pass = passRef.current;
    if (!frame || !pass) return;

    const fit = () => {
      const previous = pass.style.transform;
      pass.style.transform = "none";
      const heightScale = frame.clientHeight / pass.offsetHeight;
      const widthScale = frame.clientWidth / pass.offsetWidth;
      pass.style.transform = previous;
      const next = Math.min(1, heightScale, widthScale);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-3 sm:px-6">
      <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-muted">WEB CHECK-IN COMPLETE</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Your boarding pass</h1>
        </div>
        <Link
          to="/booking"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold"
        >
          <ArrowLeftIcon className="size-4" />
          Back to booking
        </Link>
      </div>

      <div ref={frameRef} className="mt-3 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <article
          ref={passRef}
          className="w-full max-w-3xl"
          style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
        >
        <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-[0_16px_40px_rgba(23,21,43,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)] md:grid md:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <div className="flex items-center justify-between bg-[#3a2bb8] px-5 py-4 text-white">
              <span className="inline-flex items-center gap-2 font-bold">
                <SdeMark className="size-7" />
                SDE
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em]">
                <BrandIcon src="/icons/boarding-pass.png" tone="on-brand" className="size-4" />
                BOARDING PASS
              </span>
            </div>

            <div className="px-5 py-4 sm:px-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                <div>
                  <p className="text-3xl font-bold tracking-tight sm:text-4xl">{profile.origin.code}</p>
                  <p className="text-sm text-muted">{profile.origin.city}</p>
                </div>
                <div className="flex min-w-16 items-center gap-1 text-brand sm:min-w-24">
                  <span className="h-px flex-1 border-t border-dashed border-brand/60" />
                  <BrandIcon src="/icons/plane.png" className="size-4" />
                  <span className="h-px flex-1 border-t border-dashed border-brand/60" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold tracking-tight sm:text-4xl">{profile.destination.code}</p>
                  <p className="text-sm text-muted">{profile.destination.city}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
                <div className="col-span-2 md:col-span-1">
                  <Field label="PASSENGER" value={passenger} />
                </div>
                <Field label="FLIGHT" value={flightLabel()} />
                <Field label="DATE" value={itinerary.boardingPassDate} />
                <Field label="FROM" value={profile.origin.code} />
                <Field label="TO" value={profile.destination.code} />
                <Field label="BOARDING" value={itinerary.boardingTime} />
                <Field label="DEPARTURE" value={itinerary.departure.time} />
                <Field label="GATE" value={profile.gate} />
                <Field label="SEAT" value={profile.seat} />
                <Field label="SEQUENCE" value={profile.sequence} />
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-muted">CLASS</p>
                <p className="mt-1 text-lg font-bold">{profile.cabinClass}</p>
              </div>
            </div>
          </div>

          <div className="relative border-t border-dashed border-line px-5 py-6 md:border-t-0 md:border-l">
            <span
              className="absolute top-0 left-6 size-5 -translate-y-1/2 rounded-full bg-surface md:top-8 md:left-0 md:-translate-x-1/2 md:translate-y-0"
              aria-hidden="true"
            />
            <span
              className="absolute right-6 bottom-0 size-5 translate-y-1/2 rounded-full bg-surface md:top-auto md:right-auto md:bottom-8 md:left-0 md:-translate-x-1/2 md:translate-y-0"
              aria-hidden="true"
            />
            <div className="mx-auto w-fit rounded-2xl bg-white p-3">
              <QRCodeSVG
                value={profile.linkedinUrl}
                size={120}
                level="M"
                marginSize={4}
                bgColor="#ffffff"
                fgColor="#111111"
                title={QR_LABEL}
              />
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted">GATE</dt>
                <dd className="mt-1 font-bold">{profile.gate}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted">SEAT</dt>
                <dd className="mt-1 font-bold">{profile.seat}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted">SEQ</dt>
                <dd className="mt-1 font-bold">{profile.sequence}</dd>
              </div>
            </dl>
          </div>
        </div>
        {/* Design PDF includes this line under the pass. */}
        <p className="mt-3 text-center text-sm text-muted">
          Boarding closes 20 minutes before departure. Gate {profile.gate} · {itinerary.boardingPassDate}
        </p>
        </article>
      </div>
    </div>
  );
}
