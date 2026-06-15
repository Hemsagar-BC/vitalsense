export const WS_URL = "ws://localhost:8000/ws";
export const MAX_HISTORY = 60;

export const THRESHOLDS = {
  heart_rate: {
    normal: { min: 60, max: 100 },
    warning: { min: 50, max: 120 },
    critical: { min: 0, max: 200 },
  },
} as const;

export const VITAL_UNITS = {
  heart_rate: "bpm",
} as const;
