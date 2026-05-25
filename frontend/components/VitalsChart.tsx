"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  CartesianGrid,
} from "recharts";

import { MAX_HISTORY, THRESHOLDS } from "../lib/constants";
import type { VitalReading } from "../types/vitals";

type VitalsChartProps = {
  data: VitalReading[];
  dataKey: keyof VitalReading;
  color: string;
  label: string;
  unit: string;
};

const isThresholdKey = (
  key: keyof VitalReading
): key is "heart_rate" | "spo2" | "temperature" =>
  key === "heart_rate" || key === "spo2" || key === "temperature";

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function VitalsChart({ data, dataKey, color, label, unit }: VitalsChartProps) {
  const displayData = data.slice(-MAX_HISTORY);
  const thresholdKey = isThresholdKey(dataKey) ? dataKey : null;
  const normalRange = thresholdKey ? THRESHOLDS[thresholdKey].normal : null;

  return (
    <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-700">{label}</div>
      <div className="h-56 min-h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
          <LineChart data={displayData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              tick={{ fontSize: 11, fill: "#64748b" }}
              minTickGap={16}
            />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} width={32} />
            <Tooltip
              formatter={(value) => [`${value} ${unit}`, label]}
              labelFormatter={(value) => formatTime(String(value))}
            />
            {normalRange ? (
              <ReferenceArea
                y1={normalRange.min}
                y2={normalRange.max}
                fill="#22c55e"
                fillOpacity={0.08}
                strokeOpacity={0}
              />
            ) : null}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
