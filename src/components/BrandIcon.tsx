type Tone = "chip" | "on-brand";

const toneClass: Record<Tone, string> = {
  chip: "dark:brightness-0 dark:invert",
  "on-brand": "brightness-0 invert",
};

export function BrandIcon({
  src,
  className = "size-5",
  tone = "chip",
}: {
  src: string;
  className?: string;
  tone?: Tone;
}) {
  return <img src={src} alt="" className={`object-contain ${toneClass[tone]} ${className}`} />;
}

export function SdeMark({ className = "size-8" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-[#3a2bb8] ${className}`}>
      <BrandIcon src="/icons/plane.png" tone="on-brand" className="size-[62%]" />
    </span>
  );
}
