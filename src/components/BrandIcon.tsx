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

export function CurrentIcon({ src, className = "size-4" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

export function SdeMark({ className = "size-8" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-sm bg-white text-brand ${className}`}>
      <CurrentIcon src="/icons/plane.png" className="size-4" />
    </span>
  );
}
