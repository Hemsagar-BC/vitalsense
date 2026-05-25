# GitHub Copilot Prompts — Patient Health Monitoring System
# Paste these ONE BY ONE in Copilot Chat after attaching prd.md and project-structure.md

---

## ✅ HOW TO USE

1. Open VS Code
2. Open Copilot Chat (Ctrl+Shift+I)
3. Click the paperclip icon → attach `prd.md` and `project-structure.md`
4. Paste prompts below ONE BY ONE in order
5. After each response, create the file, then move to next prompt

---

## ── BACKEND ──────────────────────────────────────────────

### PROMPT 1 — requirements.txt
```
Based on the attached prd.md and project-structure.md, generate the complete
requirements.txt for the FastAPI backend. Include: fastapi, uvicorn, pyserial,
scikit-learn, joblib, python-dotenv, numpy, pandas. Pin versions that are
stable as of 2024.
```

---

### PROMPT 2 — .env
```
Based on the attached project-structure.md, generate the .env file for the
backend. Include SERIAL_PORT and BAUD_RATE variables. Add a comment explaining
how to find the correct serial port on Windows vs Linux vs Mac.
```

---

### PROMPT 3 — backend/predictor.py
```
Based on the attached prd.md and project-structure.md, generate predictor.py
for the FastAPI backend. It should:
- Load vital_model.pkl and label_encoder.pkl from the models/ folder using joblib
- Have a predict(heart_rate: float, spo2: float, temperature: float) -> str function
- Return one of: "normal", "warning", "critical"
- Handle file not found errors gracefully with a clear message
- Use numpy array for model input
```

---

### PROMPT 4 — backend/serial_reader.py
```
Based on the attached prd.md and project-structure.md, generate serial_reader.py
for the FastAPI backend. It should:
- Read from serial port defined in .env using pyserial
- Parse comma-separated line format: "heart_rate,spo2,temperature"
- Return a dict with keys: heart_rate, spo2, temperature as floats
- Handle serial disconnection and reconnect automatically
- Have a get_latest_reading() function
- Run as a background thread
- Handle empty or malformed lines without crashing
```

---

### PROMPT 5 — backend/main.py
```
Based on the attached prd.md and project-structure.md, generate main.py for
the FastAPI backend. It should:
- Create a FastAPI app with CORS enabled for http://localhost:3000
- On startup: start serial_reader background thread, load predictor
- GET / → health check returning {"status": "ok"}
- GET /latest → return last VitalReading as JSON
- WebSocket /ws → every 1 second, read from serial_reader, predict using
  predictor, build JSON payload with heart_rate, spo2, temperature, status,
  timestamp and send to all connected clients
- Handle WebSocket disconnect gracefully
- Manage multiple WebSocket connections using a connections set
```

---

## ── FRONTEND ─────────────────────────────────────────────

### PROMPT 6 — frontend/types/vitals.ts
```
Based on the attached prd.md, generate types/vitals.ts for the Next.js
TypeScript frontend. Include:
- VitalStatus type: "normal" | "warning" | "critical"
- VitalReading interface with: heart_rate, spo2, temperature, status, timestamp
- Add JSDoc comments for each field explaining the unit and range
```

---

### PROMPT 7 — frontend/lib/constants.ts
```
Based on the attached prd.md and project-structure.md, generate lib/constants.ts
for the Next.js frontend. Include:
- WS_URL constant pointing to ws://localhost:8000/ws
- MAX_HISTORY = 60 (data points to keep)
- THRESHOLDS object with normal/warning/critical ranges for heart_rate, spo2, temperature
- STATUS_COLORS map: normal → green tailwind classes, warning → yellow, critical → red
- VITAL_UNITS map: heart_rate → "bpm", spo2 → "%", temperature → "°C"
```

---

### PROMPT 8 — frontend/hooks/useVitals.ts
```
Based on the attached prd.md, project-structure.md, and types/vitals.ts,
generate hooks/useVitals.ts for the Next.js frontend. It should:
- Connect to WS_URL from constants.ts using native WebSocket API
- Parse incoming JSON into VitalReading type
- Maintain a readings array of last MAX_HISTORY readings using useState
- Maintain a latest VitalReading | null state
- Maintain a connected boolean state
- Auto-reconnect after 3 seconds if WebSocket closes unexpectedly
- Clean up WebSocket on component unmount
- Return { latest, readings, connected }
- Use useEffect and useRef properly
```

---

### PROMPT 9 — frontend/components/ConnectionBadge.tsx
```
Based on the attached prd.md and types/vitals.ts, generate
components/ConnectionBadge.tsx for the Next.js frontend. It should:
- Accept props: connected: boolean
- Show a pulsing green dot + "Live" text when connected
- Show a static red dot + "Disconnected" text when not connected
- Use Tailwind CSS only
- Be small and placed in top right corner of dashboard
```

---

### PROMPT 10 — frontend/components/StatusBanner.tsx
```
Based on the attached prd.md and types/vitals.ts, generate
components/StatusBanner.tsx for the Next.js frontend. It should:
- Accept props: status: VitalStatus
- Display large bold text: "● NORMAL" / "⚠ WARNING" / "🚨 CRITICAL"
- Full width banner
- Green background for normal, yellow for warning, red for critical
- Animate with a pulse effect when status is warning or critical
- Use Tailwind CSS only
- Show a subtitle with brief advice: e.g. "All vitals within normal range"
```

---

### PROMPT 11 — frontend/components/VitalCard.tsx
```
Based on the attached prd.md and types/vitals.ts, generate
components/VitalCard.tsx for the Next.js frontend. It should:
- Accept props: label: string, value: number | null, unit: string,
  status: VitalStatus, icon: string (emoji)
- Show icon, label, large value, unit, and a small status pill
- Color border and status pill based on status (green/yellow/red)
- Show "––" when value is null (not connected)
- Use Tailwind CSS only
- Look like a clean medical monitor card
```

---

### PROMPT 12 — frontend/components/VitalsChart.tsx
```
Based on the attached prd.md, project-structure.md, and types/vitals.ts,
generate components/VitalsChart.tsx for the Next.js frontend. It should:
- Accept props: data: VitalReading[], dataKey: keyof VitalReading,
  color: string, label: string, unit: string
- Use Recharts LineChart
- Show last 60 data points, X-axis as formatted timestamp, Y-axis as value
- Smooth line with dot hidden, animated
- Show a tooltip with value + unit on hover
- Add a reference area for normal range using THRESHOLDS from constants.ts
- Use ResponsiveContainer for full width
- Dark or light card background with chart title on top
```

---

### PROMPT 13 — frontend/components/HistoryTable.tsx
```
Based on the attached prd.md and types/vitals.ts, generate
components/HistoryTable.tsx for the Next.js frontend. It should:
- Accept props: readings: VitalReading[]
- Show last 10 readings in reverse order (newest first)
- Columns: Time | Heart Rate | SpO2 | Temperature | Status
- Each row background color based on status (subtle green/yellow/red tint)
- Status column shows colored pill badge
- Format time as HH:MM:SS
- Show "No data yet" when readings is empty
- Use Tailwind CSS only
```

---

### PROMPT 14 — frontend/app/page.tsx
```
Based on the attached prd.md, project-structure.md, and all generated
components, generate app/page.tsx for the Next.js frontend. It should:
- Be a client component ("use client")
- Use the useVitals hook
- Layout from top to bottom:
  1. Header row: "Patient Monitor" title + ConnectionBadge (top right)
  2. StatusBanner (full width)
  3. Three VitalCard components side by side: HR (❤️), SpO2 (🫁), Temp (🌡️)
  4. Three VitalsChart components stacked or in a 3-column grid
  5. HistoryTable at the bottom
- Pass correct props to each component from useVitals data
- Use Tailwind CSS for layout (max-w-7xl, mx-auto, padding)
- Dark theme preferred (bg-gray-900 or similar)
```

---

### PROMPT 15 — frontend/app/layout.tsx
```
Based on the attached prd.md, generate app/layout.tsx for the Next.js frontend.
It should:
- Set page title to "Patient Health Monitor"
- Set meta description
- Apply dark background globally (bg-gray-900 text-white)
- Import and apply a clean medical/professional Google Font (e.g. IBM Plex Mono
  or Space Mono for values, and a clean sans-serif for labels)
- Set viewport meta tag
```

---

## ── FINAL STEPS ──────────────────────────────────────────

### PROMPT 16 — README.md
```
Based on the attached prd.md and project-structure.md, generate a complete
README.md for the project. Include:
- Project title and 2-line description
- Hardware components list
- Setup instructions for backend (pip install, .env config, how to run)
- Setup instructions for frontend (npm install, npm run dev)
- How to find Arduino serial port on Windows/Mac/Linux
- Screenshot placeholder
- Tech stack summary table
```

---

## ✅ ORDER SUMMARY

```
Prompt 1  → backend/requirements.txt
Prompt 2  → backend/.env
Prompt 3  → backend/predictor.py
Prompt 4  → backend/serial_reader.py
Prompt 5  → backend/main.py
Prompt 6  → frontend/types/vitals.ts
Prompt 7  → frontend/lib/constants.ts
Prompt 8  → frontend/hooks/useVitals.ts
Prompt 9  → frontend/components/ConnectionBadge.tsx
Prompt 10 → frontend/components/StatusBanner.tsx
Prompt 11 → frontend/components/VitalCard.tsx
Prompt 12 → frontend/components/VitalsChart.tsx
Prompt 13 → frontend/components/HistoryTable.tsx
Prompt 14 → frontend/app/page.tsx
Prompt 15 → frontend/app/layout.tsx
Prompt 16 → README.md
```

---

## ⚠️ TIPS FOR USING COPILOT

1. Always attach BOTH prd.md and project-structure.md before each prompt
2. If Copilot generates incomplete code, follow up with:
   "Continue from where you left off"
3. If imports are missing, follow up with:
   "Add all missing imports to the file"
4. After generating page.tsx, if layout looks off, follow up with:
   "Adjust the Tailwind layout to match the order described in prd.md"
5. After all files are generated, test backend first:
   uvicorn main:app --reload
   Then test frontend: npm run dev
