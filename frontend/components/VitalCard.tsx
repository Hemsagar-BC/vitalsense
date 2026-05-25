import type { VitalStatus } from "../types/vitals";

type VitalCardProps = {
  label: string;
  value: number | null;
  unit: string;
  status: VitalStatus;
  icon: string;
};

const STATUS_STYLES: Record<VitalStatus, string> = {
  normal: "border-green-600 bg-green-50 text-green-700",
  warning: "border-yellow-600 bg-yellow-50 text-yellow-700",
  critical: "border-red-600 bg-red-50 text-red-700",
};

export function VitalCard({ label, value, unit, status, icon }: VitalCardProps) {
  const statusClass = STATUS_STYLES[status];
  const displayValue = value === null ? "––" : value.toString();

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <span className="text-lg" aria-hidden="true">
            {icon}
          </span>
          <span>{label}</span>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClass}`}
        >
          {status.toUpperCase()}
        </span>
      </div>
      <div className="mt-4 flex items-end gap-2">
        <div className="text-4xl font-extrabold tracking-tight text-slate-900">
          {displayValue}
        </div>
        <div className="pb-1 text-sm font-semibold text-slate-500">{unit}</div>
      </div>
    </div>
  );
}
