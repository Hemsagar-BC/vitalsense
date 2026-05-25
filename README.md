# Patient Health Monitor

A real-time patient vitals monitoring dashboard for a biomedical mini project.
Reads Heart Rate, SpO2, and Temperature from Arduino sensors, classifies status with
an ML model, and streams live updates to a Next.js UI.

## Hardware Components

- Arduino board (Uno/Nano or compatible)
- MAX30102 (heart rate + SpO2)
- MLX90614 (infrared temperature)
- USB cable for serial connection
- Jumper wires and breadboard

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | FastAPI, Uvicorn |
| WebSockets | FastAPI WebSocket |
| Serial | pyserial |
| ML | scikit-learn + joblib |

## Backend Setup

1. Create and activate a virtual environment.
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Configure environment variables in `backend/.env`:
   ```env
   SERIAL_PORT=COM3
   BAUD_RATE=9600
   ```
4. Run the backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

## Find the Arduino Serial Port

- Windows: Device Manager -> Ports (COM & LPT) -> look for COMx
- macOS: `ls /dev/tty.*` (often `/dev/tty.usbmodem*` or `/dev/tty.usbserial*`)
- Linux: `ls /dev/ttyUSB*` or `ls /dev/ttyACM*`

## Screenshot

Add a dashboard screenshot here after first run.

## Notes

- Backend runs on port 8000, frontend on port 3000.
- Place `vital_model.pkl` and `label_encoder.pkl` inside `backend/models/`.
