export interface VitalReading {
  /** Beats per minute (bpm), expected range roughly 30-220. */
  heart_rate: number;
  /** Model prediction for the current heart-rate reading. */
  status: "normal" | "abnormal";
  /** ISO 8601 timestamp for when the reading was captured. */
  timestamp: string;
}
