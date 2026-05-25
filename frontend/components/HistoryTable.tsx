import type { VitalReading, VitalStatus } from "../types/vitals";

type HistoryTableProps = {
  readings: VitalReading[];
};

const ROW_STYLES: Record<VitalStatus, string> = {
  normal: "bg-green-50",
  warning: "bg-yellow-50",
  critical: "bg-red-50",
};

const PILL_STYLES: Record<VitalStatus, string> = {
  normal: "border-green-600 bg-green-100 text-green-700",
  warning: "border-yellow-600 bg-yellow-100 text-yellow-700",
  critical: "border-red-600 bg-red-100 text-red-700",
};

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export function HistoryTable({ readings }: HistoryTableProps) {
  const rows = [...readings].slice(-10).reverse();

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-700">History</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Heart Rate</th>
              <th className="px-3 py-2">SpO2</th>
              <th className="px-3 py-2">Temperature</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500" colSpan={5}>
                  No data yet
                </td>
              </tr>
            ) : (
              rows.map((reading, index) => (
                <tr key={`${reading.timestamp}-${index}`} className={ROW_STYLES[reading.status]}>
                  <td className="px-3 py-2 text-slate-700">
                    {formatTime(reading.timestamp)}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{reading.heart_rate}</td>
                  <td className="px-3 py-2 text-slate-700">{reading.spo2}</td>
                  <td className="px-3 py-2 text-slate-700">{reading.temperature}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        PILL_STYLES[reading.status]
                      }`}
                    >
                      {reading.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
