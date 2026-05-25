"use client";

import { ConnectionBadge } from "../components/ConnectionBadge";
import { HistoryTable } from "../components/HistoryTable";
import { StatusBanner } from "../components/StatusBanner";
import { VitalCard } from "../components/VitalCard";
import { VitalsChart } from "../components/VitalsChart";
import { useVitals } from "../hooks/useVitals";
import { VITAL_UNITS } from "../lib/constants";

export default function Home() {
  const { latest, readings, connected } = useVitals();
  const status = latest?.status ?? "normal";

  return (
    <div className="min-h-screen bg-gray-900 text-slate-100">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <div className="relative flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Patient Monitor
          </h1>
          <ConnectionBadge connected={connected} />
        </div>

        <StatusBanner status={status} />

        <div className="grid gap-4 md:grid-cols-3">
          <VitalCard
            label="Heart Rate"
            icon="❤️"
            value={latest?.heart_rate ?? null}
            unit={VITAL_UNITS.heart_rate}
            status={status}
          />
          <VitalCard
            label="SpO2"
            icon="🫁"
            value={latest?.spo2 ?? null}
            unit={VITAL_UNITS.spo2}
            status={status}
          />
          <VitalCard
            label="Temperature"
            icon="🌡️"
            value={latest?.temperature ?? null}
            unit={VITAL_UNITS.temperature}
            status={status}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <VitalsChart
            data={readings}
            dataKey="heart_rate"
            color="#22c55e"
            label="Heart Rate"
            unit={VITAL_UNITS.heart_rate}
          />
          <VitalsChart
            data={readings}
            dataKey="spo2"
            color="#0ea5e9"
            label="SpO2"
            unit={VITAL_UNITS.spo2}
          />
          <VitalsChart
            data={readings}
            dataKey="temperature"
            color="#f97316"
            label="Temperature"
            unit={VITAL_UNITS.temperature}
          />
        </div>

        <HistoryTable readings={readings} />
      </div>
    </div>
  );
}
