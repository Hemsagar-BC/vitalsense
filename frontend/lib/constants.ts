export const WS_URL = "ws://localhost:8000/ws";
export const MAX_HISTORY = 60;

export const THRESHOLDS = {
  heart_rate: {
    normal: { min: 60, max: 100 },
    warning: { min: 50, max: 120 },
    critical: { min: 0, max: 200 },
  },
  spo2: {
    normal: { min: 95, max: 100 },
    warning: { min: 90, max: 94 },
    critical: { min: 0, max: 89 },
  },
  temperature: {
    normal: { min: 36.1, max: 37.2 },
    warning: { min: 37.3, max: 38.4 },
    critical: { min: 38.5, max: 42.0 },
  },
} as const;

export const STATUS_COLORS = {
  normal: "bg-green-500 text-white border-green-600",
  warning: "bg-yellow-500 text-white border-yellow-600",
  critical: "bg-red-500 text-white border-red-600",
} as const;

export const VITAL_UNITS = {
  heart_rate: "bpm",
  spo2: "%",
  temperature: "°C",
} as const;
