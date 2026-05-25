export type VitalStatus = "normal" | "warning" | "critical";

export interface VitalReading {
  /** Beats per minute (bpm), expected range roughly 30-220. */
  heart_rate: number;
  /** Oxygen saturation percentage (%), range 0-100. */
  spo2: number;
  /** Body temperature in Celsius (C), expected range roughly 30-45. */
  temperature: number;
  /** Classification label: normal, warning, or critical. */
  status: VitalStatus;
  /** ISO 8601 timestamp for when the reading was captured. */
  timestamp: string;
}
