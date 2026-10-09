function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-sm bg-line ${className}`} />;
}

export function BookingCardSkeleton({ id }: { id: string }) {
  if (id !== "flight") return null;
  return (
    <div className="pt-6" aria-hidden="true">
      <Bone className="h-5 w-40" />
      <div className="mt-5 flex items-center justify-between gap-4">
        <Bone className="h-14 w-28" />
        <Bone className="h-4 flex-1" />
        <Bone className="h-14 w-28" />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Bone className="h-64" />
        <Bone className="h-64" />
        <Bone className="h-48" />
        <Bone className="h-48" />
      </div>
    </div>
  );
}
