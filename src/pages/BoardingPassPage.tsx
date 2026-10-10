import { useLayoutEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import { flightLabel, profile } from "../config/profile";
import { ArrowLeftIcon } from "../components/icons";
import { CurrentIcon, SdeMark } from "../components/BrandIcon";
import { rememberItinerary, type CivilDate } from "../lib/itinerary";

function pad(value: string, length: number) {
  return value.slice(0, length).padEnd(length, " ");
}

/** IATA boarding-pass barcode. A scan reads the passenger and flight, not a web link. */
function boardingPassCode(date: CivilDate) {
  const day =
    Math.round(
      (Date.UTC(date.year, date.month - 1, date.day) - Date.UTC(date.year, 0, 1)) / 86400000,
    ) + 1;
  const [first, ...rest] = profile.name.trim().split(/\s+/);
  const last = (rest.at(-1) ?? first).toUpperCase();
  const given = (rest.length > 0 ? [first, ...rest.slice(0, -1)] : []).join("").toUpperCase();

  return [
    "M1",
    pad(`${last}/${given}`, 20),
    "E",
    pad(profile.pnr, 7),
    profile.origin.code,
    profile.destination.code,
    pad(profile.carrier, 3),
    pad(profile.flightNumber, 5),
    String(day).padStart(3, "0"),
    "Y",
    pad(profile.seat, 4),
    pad(profile.sequence, 5),
    "100",
  ].join("");
}

function Field({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.08em] text-muted">{label}</p>
      <p className="mt-1 inline-flex items-center gap-1.5 font-semibold tabular-nums">
        {icon ? <CurrentIcon src={icon} /> : null}
        {value}
      </p>
    </div>
  );
}

export function BoardingPassPage() {
  const [itinerary] = useState(() => rememberItinerary());
  const passenger = profile.name.toUpperCase();
  const frame = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frameEl = frame.current;
    const boardEl = board.current;
    if (!frameEl || !boardEl) return;

    const fit = () => {
      boardEl.style.transform = "";
      const available = frameEl.clientHeight;
      const needed = boardEl.offsetHeight;
      if (available > 0 && needed > available) {
        boardEl.style.transform = `scale(${available / needed})`;
        boardEl.style.transformOrigin = "top center";
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frameEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div ref={frame} className="min-h-0 flex-1 overflow-hidden">
        <div ref={board} className="mx-auto w-full max-w-4xl px-5 py-4 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold">Boarding pass</h1>
        <Link
          to={`/trips/${profile.pnr}`}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-ink/30 px-4 py-2 text-sm font-semibold"
        >
          <ArrowLeftIcon className="size-4" />
          Back to booking
        </Link>
      </div>

      <article className="mt-4 overflow-hidden rounded-lg border border-ink/30 md:grid md:grid-cols-[minmax(0,1fr)_248px]">
        <div>
          <div className="flex items-center justify-between bg-brand px-5 py-3 text-btn-text">
            <span className="inline-flex items-center gap-2 font-semibold">
              <SdeMark className="size-7" />
              SDE
            </span>
            <span className="text-xs font-semibold tracking-[0.14em]">BOARDING PASS</span>
          </div>

          <div className="px-5 py-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
              <div>
                <p className="font-display text-5xl text-display sm:text-6xl">{profile.origin.code}</p>
                <p className="text-sm text-muted">{profile.origin.city}</p>
              </div>
              <div className="flex min-w-16 items-center gap-2 text-ink sm:min-w-28">
                <span className="h-px flex-1 bg-ink" />
                <span className="text-sm" aria-hidden="true">
                  ✈
                </span>
                <span className="h-px flex-1 bg-ink" />
              </div>
              <div className="text-right">
                <p className="font-display text-5xl text-display sm:text-6xl">{profile.destination.code}</p>
                <p className="text-sm text-muted">{profile.destination.city}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-4 md:grid-cols-3">
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
              <Field label="SEAT" value={profile.seat} icon="/icons/seat.png" />
              <Field label="SEQUENCE" value={profile.sequence} />
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <p className="text-[11px] font-semibold tracking-[0.08em] text-muted">CLASS</p>
              <p className="mt-1 text-lg font-semibold">{profile.cabinClass}</p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-dashed border-ink/30 px-5 py-6 md:border-t-0 md:border-l">
          <span
            className="absolute top-0 left-6 size-4 -translate-y-1/2 rounded-full bg-page md:top-8 md:left-0 md:-translate-x-1/2 md:translate-y-0"
            aria-hidden="true"
          />
          <span
            className="absolute right-6 bottom-0 size-4 translate-y-1/2 rounded-full bg-page md:top-auto md:right-auto md:bottom-8 md:left-0 md:-translate-x-1/2 md:translate-y-0"
            aria-hidden="true"
          />
          <div className="mx-auto w-fit border border-line bg-white p-3">
            <QRCodeSVG
              value={boardingPassCode(itinerary.departure.date)}
              size={168}
              level="M"
              marginSize={4}
              bgColor="#ffffff"
              fgColor="#111111"
              aria-hidden="true"
            />
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div>
              <dt className="text-[11px] font-semibold tracking-[0.08em] text-muted">GATE</dt>
              <dd className="mt-1 font-semibold tabular-nums">{profile.gate}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold tracking-[0.08em] text-muted">SEAT</dt>
              <dd className="mt-1 flex items-center justify-center gap-1 font-semibold tabular-nums">
                <CurrentIcon src="/icons/seat.png" />
                {profile.seat}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold tracking-[0.08em] text-muted">SEQ</dt>
              <dd className="mt-1 font-semibold tabular-nums">{profile.sequence}</dd>
            </div>
          </dl>
        </div>
        <div className="bp-barcode md:col-span-2" aria-hidden="true" />
      </article>

      <p className="mt-3 text-sm text-muted">
        Boarding closes 20 minutes before departure. Gate {profile.gate} · {itinerary.boardingPassDate}
      </p>
        </div>
      </div>
    </div>
  );
}
