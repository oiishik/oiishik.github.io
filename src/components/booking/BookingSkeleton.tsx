function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-line ${className}`} />;
}

const card =
  "rounded-3xl border border-line bg-card p-4 shadow-[0_10px_30px_rgba(23,21,43,0.06)] sm:p-6 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]";

export function BookingCardSkeleton({ id }: { id: string }) {
  if (id === "flight") {
    return (
      <div className={card} aria-hidden="true">
        <Bone className="h-5 w-40" />
        <div className="mt-6 flex items-center justify-between gap-4">
          <Bone className="h-14 w-28" />
          <Bone className="h-4 flex-1" />
          <Bone className="h-14 w-28" />
        </div>
        <Bone className="mt-6 h-16 w-full" />
      </div>
    );
  }

  if (id === "fare") {
    return (
      <div className="h-full rounded-3xl bg-[#3a2bb8] p-4 sm:p-6" aria-hidden="true">
        <Bone className="h-3 w-28 bg-white/25" />
        <Bone className="mt-3 h-8 w-64 bg-white/25" />
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Bone className="h-16 bg-white/20" />
          <Bone className="h-16 bg-white/20" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Bone key={index} className="h-14 bg-white/20" />
          ))}
        </div>
      </div>
    );
  }

  if (id === "passenger") {
    return (
      <div className={`${card} h-full`} aria-hidden="true">
        <Bone className="h-5 w-40" />
        <div className="mt-5 flex items-center gap-3">
          <Bone className="size-12 rounded-full" />
          <div className="flex-1">
            <Bone className="h-4 w-36" />
            <Bone className="mt-2 h-3 w-16" />
          </div>
        </div>
        <Bone className="mt-5 h-10 w-full" />
        <Bone className="mt-3 h-10 w-full" />
        <Bone className="mt-3 h-10 w-full" />
      </div>
    );
  }

  return (
    <div className={card} aria-hidden="true">
      <Bone className="h-5 w-40" />
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Bone key={index} className="h-24" />
        ))}
      </div>
    </div>
  );
}
