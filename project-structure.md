# Project Structure — Patient Health Monitoring System

## Root Layout

```
patient-monitor/
├── backend/                   # Python FastAPI
├── frontend/                  # Next.js + TypeScript
├── prd.md                     # Product Requirements
├── project-structure.md       # This file
└── README.md
```

---

## Backend Structure

```
backend/
├── main.py                    # FastAPI app entry point
│                              # - Creates app instance
│                              # - Registers WebSocket route /ws
│                              # - Registers REST route /latest
│                              # - Starts serial reader on startup
│
├── serial_reader.py           # Arduino Serial Communication
│                              # - Opens serial port (from .env)
│                              # - Reads CSV line: "HR,SpO2,Temp"
│                              # - Parses and returns dict
│                              # - Handles reconnection on error
│
├── predictor.py               # ML Model Handler
│                              # - Loads vital_model.pkl on startup
│                              # - Loads label_encoder.pkl on startup
│                              # - predict(hr, spo2, temp) → status string
│
├── models/
│   ├── vital_model.pkl        # Trained Random Forest model
│   └── label_encoder.pkl      # Label encoder (normal/warning/critical)
│
├── requirements.txt           # Python dependencies
│                              # fastapi, uvicorn, pyserial,
│                              # scikit-learn, joblib, python-dotenv
│
└── .env                       # Environment variables
                               # SERIAL_PORT=COM3 (Windows)
                               # SERIAL_PORT=/dev/ttyUSB0 (Linux/Mac)
                               # BAUD_RATE=9600
```

---

## Frontend Structure

```
frontend/
├── app/
│   ├── layout.tsx             # Root layout — sets font, metadata, bg color
│   └── page.tsx               # Main dashboard page
│                              # - Imports all components
│                              # - Uses useVitals hook
│                              # - Arranges layout: Banner → Cards → Charts → Table
│
├── components/
│   ├── StatusBanner.tsx       # Top banner showing NORMAL / WARNING / CRITICAL
│   │                          # - Large text, full width
│   │                          # - Pulses animation on warning/critical
│   │                          # - Props: status: VitalStatus
│   │
│   ├── VitalCard.tsx          # Individual vital display card
│   │                          # - Shows icon + value + unit + label
│   │                          # - Color changes by status
│   │                          # - Props: label, value, unit, status, icon
│   │
│   ├── VitalsChart.tsx        # Recharts line chart for one vital
│   │                          # - Shows last 60 readings
│   │                          # - Props: data, dataKey, color, label, unit
│   │
│   ├── HistoryTable.tsx       # Last 10 readings table
│   │                          # - Columns: Time, HR, SpO2, Temp, Status
│   │                          # - Row color by status
│   │                          # - Props: readings: VitalReading[]
│   │
│   └── ConnectionBadge.tsx    # WebSocket connection indicator
│                              # - Green dot = connected
│                              # - Red dot = disconnected
│                              # - Props: connected: boolean
│
├── hooks/
│   └── useVitals.ts           # Main WebSocket hook
│                              # - Connects to ws://localhost:8000/ws
│                              # - Manages readings array (last 60)
│                              # - Manages latest reading
│                              # - Manages connected boolean
│                              # - Auto-reconnects on disconnect
│                              # - Returns { latest, readings, connected }
│
├── types/
│   └── vitals.ts              # All TypeScript interfaces
│                              # - VitalStatus type
│                              # - VitalReading interface
│
├── lib/
│   └── constants.ts           # App-wide constants
│                              # - WS_URL = ws://localhost:8000/ws
│                              # - MAX_HISTORY = 60
│                              # - Threshold values per vital
│                              # - Status color map
│
├── public/                    # Static assets (if any)
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
├── next.config.ts             # Next.js config
└── package.json               # Dependencies
                               # next, react, typescript,
                               # tailwindcss, recharts
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  ARDUINO                                                     │
│  Reads MAX30102 + MLX90614 → Serial.println("HR,SpO2,Temp") │
└──────────────────────┬──────────────────────────────────────┘
                       │ USB Serial (9600 baud)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (FastAPI - port 8000)                              │
│                                                             │
│  serial_reader.py → reads "98,96,37.2"                     │
│                   → parses to dict                          │
│                                                             │
│  predictor.py     → model.predict([98, 96, 37.2])          │
│                   → returns "normal"                        │
│                                                             │
│  main.py          → builds JSON payload                     │
│                   → broadcasts via WebSocket /ws            │
└──────────────────────┬──────────────────────────────────────┘
                       │ WebSocket JSON (every 1 second)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (Next.js - port 3000)                             │
│                                                             │
│  useVitals.ts     → receives JSON                          │
│                   → updates state                          │
│                                                             │
│  page.tsx         → passes data to components              │
│                                                             │
│  StatusBanner     → shows NORMAL (green)                   │
│  VitalCard x3     → HR: 98 | SpO2: 96% | Temp: 37.2°C     │
│  VitalsChart x3   → live line charts                       │
│  HistoryTable     → last 10 rows                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Build Order (Follow This Sequence)

```
1. backend/models/          ← paste your .pkl files here first
2. backend/.env             ← set your serial port
3. backend/predictor.py     ← ML model loader
4. backend/serial_reader.py ← Arduino serial reader
5. backend/main.py          ← FastAPI app + WebSocket
6. frontend/types/vitals.ts ← TypeScript types
7. frontend/lib/constants.ts← Constants
8. frontend/hooks/useVitals.ts ← WebSocket hook
9. frontend/components/     ← All 5 components
10. frontend/app/page.tsx   ← Main dashboard page
11. frontend/app/layout.tsx ← Root layout
```

---

## How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

### Arduino
- Upload the Arduino sketch
- Connect via USB
- Ensure SERIAL_PORT in .env matches your port (e.g., COM3 or /dev/ttyUSB0)
