type ConnectionBadgeProps = {
  connected: boolean;
};

export function ConnectionBadge({ connected }: ConnectionBadgeProps) {
  return (
    <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
      <span
        className={`h-2 w-2 rounded-full ${
          connected ? "animate-pulse bg-green-500" : "bg-red-500"
        }`}
        aria-hidden="true"
      />
      <span className={connected ? "text-green-700" : "text-red-700"}>
        {connected ? "Live" : "Disconnected"}
      </span>
    </div>
  );
}
