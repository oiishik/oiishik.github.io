import { profile } from "../../config/profile";
import { BrandIcon } from "../BrandIcon";
import { CheckIcon } from "../icons";

export function FareBenefitsCard() {
  return (
    <section className="flex h-full flex-col rounded-3xl bg-fare p-4 text-fare-ink shadow-[0_10px_30px_rgba(58,43,184,0.25)] sm:p-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-fare-muted">FARE & BENEFITS</p>
      <h2 className="font-display mt-2 text-3xl sm:text-4xl">{profile.fareBrand}</h2>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/12 px-3 py-4">
          <BrandIcon src="/icons/luggage.png" tone="on-fill" />
          <p className="mt-3 text-lg font-bold">{profile.baggage.checkIn}</p>
          <p className="text-sm text-fare-muted">Check-in baggage</p>
        </div>
        <div className="rounded-2xl bg-white/12 px-3 py-4">
          <BrandIcon src="/icons/luggage-cabin.png" tone="on-fill" />
          <p className="mt-3 text-lg font-bold">{profile.baggage.cabin}</p>
          <p className="text-sm text-fare-muted">Cabin baggage</p>
        </div>
      </div>

      <h3 className="mt-6 text-sm font-semibold">Fare Benefits Included</h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {profile.fareBenefits.map((benefit) => (
          <li key={benefit.label} className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-fare-mark">
              <img
                src={benefit.logo}
                alt=""
                className="size-5 object-contain brightness-0 invert"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-[0.14em] text-fare-muted">
                {benefit.category}
              </span>
              <span className="block text-sm font-semibold leading-snug">{benefit.label}</span>
            </span>
            <CheckIcon className="size-5 shrink-0 text-fare-ink" />
          </li>
        ))}
      </ul>
    </section>
  );
}
