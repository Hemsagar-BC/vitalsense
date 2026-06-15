type VitalCardProps = {
  label: string;
  value: number | null;
  status?: "normal" | "abnormal";
  unit: string;
};

const statusStyles = {
  normal: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  abnormal: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

export function VitalCard({ label, value, status, unit }: VitalCardProps) {
  const displayValue = value === null ? "--" : Math.round(value).toString();

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </div>
        {status ? (
          <div
            className={`rounded border px-2 py-1 text-xs font-semibold uppercase ${statusStyles[status]}`}
          >
            {status}
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex items-end gap-3">
        <div className="text-6xl font-extrabold tracking-tight text-white">
          {displayValue}
        </div>
        <div className="pb-2 text-base font-semibold text-slate-400">{unit}</div>
      </div>
    </div>
  );
}
