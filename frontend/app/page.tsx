"use client";

import { ConnectionBadge } from "../components/ConnectionBadge";
import { HistoryTable } from "../components/HistoryTable";
import { VitalCard } from "../components/VitalCard";
import { VitalsChart } from "../components/VitalsChart";
import { useVitals } from "../hooks/useVitals";
import { VITAL_UNITS } from "../lib/constants";

export default function Home() {
  const { latest, readings, connected } = useVitals();

  return (
    <div className="min-h-screen bg-gray-900 text-slate-100">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <div className="relative flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Patient BPM Monitor
          </h1>
          <ConnectionBadge connected={connected} />
        </div>

        <VitalCard
          label="BPM"
          value={latest?.heart_rate ?? null}
          status={latest?.status}
          unit={VITAL_UNITS.heart_rate}
        />

        <VitalsChart
          data={readings}
          dataKey="heart_rate"
          color="#22c55e"
          label="BPM"
          unit={VITAL_UNITS.heart_rate}
        />

        <HistoryTable readings={readings} />
      </div>
    </div>
  );
}
