import type { VitalReading } from "../types/vitals";

type HistoryTableProps = {
  readings: VitalReading[];
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

const statusStyles = {
  normal: "text-emerald-300",
  abnormal: "text-rose-300",
};

export function HistoryTable({ readings }: HistoryTableProps) {
  const rows = [...readings].slice(-10).reverse();

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-300">BPM History</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">BPM</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-slate-500" colSpan={3}>
                  No BPM data yet
                </td>
              </tr>
            ) : (
              rows.map((reading, index) => (
                <tr
                  key={`${reading.timestamp}-${index}`}
                  className="border-t border-slate-800"
                >
                  <td className="px-3 py-2 text-slate-300">
                    {formatTime(reading.timestamp)}
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-100">
                    {Math.round(reading.heart_rate)}
                  </td>
                  <td
                    className={`px-3 py-2 text-xs font-semibold uppercase ${statusStyles[reading.status]}`}
                  >
                    {reading.status}
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
