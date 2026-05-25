import type { VitalStatus } from "../types/vitals";

type StatusBannerProps = {
  status: VitalStatus;
};

const STATUS_COPY = {
  normal: {
    label: "● NORMAL",
    subtitle: "All vitals within normal range.",
    className: "bg-green-500 text-white",
    pulse: false,
  },
  warning: {
    label: "⚠ WARNING",
    subtitle: "One or more vitals are slightly off range.",
    className: "bg-yellow-500 text-white",
    pulse: true,
  },
  critical: {
    label: "🚨 CRITICAL",
    subtitle: "Vitals are critical. Immediate attention advised.",
    className: "bg-red-500 text-white",
    pulse: true,
  },
} as const;

export function StatusBanner({ status }: StatusBannerProps) {
  const { label, subtitle, className, pulse } = STATUS_COPY[status];

  return (
    <div
      className={`w-full rounded-lg border px-6 py-5 ${className} ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      <div className="text-2xl font-extrabold tracking-wide sm:text-3xl">
        {label}
      </div>
      <div className="mt-1 text-sm opacity-90 sm:text-base">{subtitle}</div>
    </div>
  );
}
