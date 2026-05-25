# PRD — Real-Time Patient Health Monitoring Dashboard

## 1. Project Overview

A real-time patient vitals monitoring web dashboard for a biomedical mini project.
Hardware sensors (MAX30102 + MLX90614) connected to Arduino send Heart Rate, SpO2,
and Body Temperature data every second via USB Serial to a Python FastAPI backend.
The backend runs an ML model to classify vitals and streams live data to a Next.js
frontend via WebSocket.

---

## 2. Goals

- Display live patient vitals in real time
- Show ML model prediction (Normal / Warning / Critical) with color-coded status
- Alert the user visually when vitals go abnormal
- Show historical vitals in a chart (last 60 seconds)
- Keep UI clean, minimal, and medically professional

---

## 3. Users

- Lab demonstrators / professors evaluating the project
- Students demonstrating the system

---

## 4. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| WebSocket client | Native browser WebSocket API |
| Backend | Python FastAPI |
| WebSocket server | FastAPI WebSocket |
| Serial Communication | pyserial |
| ML Model | scikit-learn (Random Forest) via joblib |
| Model files | vital_model.pkl + label_encoder.pkl |

---

## 5. Features

### 5.1 Live Vitals Cards (Required)
- Heart Rate card — shows current BPM with icon
- SpO2 card — shows current % with icon
- Temperature card — shows current °C with icon
- Each card color-coded: Green (normal) / Yellow (warning) / Red (critical)

### 5.2 Patient Status Banner (Required)
- Large status banner at top: NORMAL / WARNING / CRITICAL
- Color changes based on ML model output
- Pulses/flashes when WARNING or CRITICAL

### 5.3 Live Charts (Required)
- Line chart for Heart Rate (last 60 data points)
- Line chart for SpO2 (last 60 data points)
- Line chart for Temperature (last 60 data points)
- X-axis = time, Y-axis = value

### 5.4 Vitals History Table (Required)
- Last 10 readings in a table
- Columns: Time | HR | SpO2 | Temp | Status
- Rows color-coded by status

### 5.5 Connection Status Indicator (Required)
- Small badge: Connected (green) / Disconnected (red)
- Shows if WebSocket + Arduino are live

### 5.6 Threshold Reference Panel (Nice to have)
- Small panel showing normal ranges for each vital
- Static — just for reference during demo

---

## 6. Pages

| Route | Page |
|---|---|
| `/` | Main dashboard (single page — all features here) |

---

## 7. Data Flow

```
Arduino (Serial) → Python reads via pyserial
                 → ML model predicts label
                 → FastAPI sends JSON via WebSocket every 1 second

Next.js frontend → WebSocket client connects to ws://localhost:8000/ws
                 → Receives JSON every second
                 → Updates state → re-renders cards + charts + table
```

---

## 8. WebSocket Message Format

### Backend sends (every 1 second):
```json
{
  "heart_rate": 98,
  "spo2": 96,
  "temperature": 37.2,
  "status": "normal",
  "timestamp": "2024-01-01T10:00:00"
}
```

### Status values:
- `"normal"` — all vitals in range
- `"warning"` — one vital slightly off
- `"critical"` — one or more vitals critically off

---

## 9. Backend Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/latest` | Last recorded vitals (REST) |
| WebSocket | `/ws` | Live vitals stream |

---

## 10. Backend File Structure

```
backend/
├── main.py              # FastAPI app + WebSocket endpoint
├── serial_reader.py     # Reads Arduino serial data
├── predictor.py         # Loads ML model, makes predictions
├── models/
│   ├── vital_model.pkl
│   └── label_encoder.pkl
├── requirements.txt
└── .env                 # Serial port config (COM3 or /dev/ttyUSB0)
```

---

## 11. Frontend File Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── VitalCard.tsx       # HR / SpO2 / Temp card
│   ├── StatusBanner.tsx    # NORMAL / WARNING / CRITICAL banner
│   ├── VitalsChart.tsx     # Line chart component
│   ├── HistoryTable.tsx    # Last 10 readings table
│   └── ConnectionBadge.tsx # WebSocket connection status
├── hooks/
│   └── useVitals.ts        # WebSocket hook — manages live data state
├── types/
│   └── vitals.ts           # TypeScript types
├── lib/
│   └── constants.ts        # Threshold values, WS URL
└── tailwind.config.ts
```

---

## 12. TypeScript Types

```typescript
// types/vitals.ts

export type VitalStatus = "normal" | "warning" | "critical";

export interface VitalReading {
  heart_rate: number;
  spo2: number;
  temperature: number;
  status: VitalStatus;
  timestamp: string;
}

export interface VitalsHistory {
  readings: VitalReading[];
  latest: VitalReading | null;
}
```

---

## 13. Color System

| Status | Background | Text | Border |
|---|---|---|---|
| Normal | green-500 | white | green-600 |
| Warning | yellow-500 | white | yellow-600 |
| Critical | red-500 | white | red-600 |
| Disconnected | gray-400 | white | gray-500 |

---

## 14. Non-Functional Requirements

- WebSocket reconnects automatically if disconnected
- Charts smooth-update without full re-render
- Works on Chrome/Firefox
- Runs locally (no deployment needed for demo)
- Backend runs on port 8000, Frontend on port 3000

---

## 15. Out of Scope

- User authentication / login
- Multiple patient support
- Camera / OpenCV integration
- Mobile responsiveness (desktop only is fine)
- Database / persistent storage
