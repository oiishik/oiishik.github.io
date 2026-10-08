type Tone = "chip" | "on-brand" | "on-fill";

const toneClass: Record<Tone, string> = {
  chip: "dark:brightness-0 dark:invert",
  "on-brand": "brightness-0 invert",
  "on-fill": "brightness-0 invert dark:invert-0",
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
    <span className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-brand ${className}`}>
      <BrandIcon src="/icons/plane.png" tone="on-fill" className="size-[62%]" />
    </span>
  );
}
