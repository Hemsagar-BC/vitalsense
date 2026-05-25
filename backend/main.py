from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

import predictor
import serial_reader

@asynccontextmanager
async def lifespan(_: FastAPI):
    serial_reader.get_latest_reading()
    predictor._load_assets()

    global _broadcaster_task
    if _broadcaster_task is None or _broadcaster_task.done():
        _broadcaster_task = asyncio.create_task(_broadcast_loop())

    try:
        yield
    finally:
        serial_reader.stop_reader()
        if _broadcaster_task:
            _broadcaster_task.cancel()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_connections: set[WebSocket] = set()
_connections_lock = asyncio.Lock()
_connections_event = asyncio.Event()
_broadcaster_task: Optional[asyncio.Task] = None


def _build_payload(reading: dict[str, float]) -> dict[str, object]:
    status = predictor.predict(
        heart_rate=reading["heart_rate"],
        spo2=reading["spo2"],
        temperature=reading["temperature"],
    )
    timestamp = datetime.now(timezone.utc).isoformat()
    return {
        "heart_rate": reading["heart_rate"],
        "spo2": reading["spo2"],
        "temperature": reading["temperature"],
        "status": status,
        "timestamp": timestamp,
    }


async def _broadcast(payload: dict[str, object]) -> None:
    async with _connections_lock:
        connections = list(_connections)

    if not connections:
        return

    to_remove: list[WebSocket] = []
    for websocket in connections:
        try:
            await websocket.send_json(payload)
        except WebSocketDisconnect:
            to_remove.append(websocket)
        except Exception:
            to_remove.append(websocket)

    if to_remove:
        async with _connections_lock:
            for websocket in to_remove:
                _connections.discard(websocket)
            if not _connections:
                _connections_event.clear()


async def _broadcast_loop() -> None:
    while True:
        await _connections_event.wait()
        while _connections_event.is_set():
            reading = serial_reader.get_latest_reading()
            if reading is not None:
                try:
                    payload = _build_payload(reading)
                    await _broadcast(payload)
                except Exception:
                    pass
            await asyncio.sleep(1.0)


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/latest")
def get_latest() -> dict[str, object]:
    reading = serial_reader.get_latest_reading()
    if reading is None:
        raise HTTPException(status_code=404, detail="No readings available yet.")
    return _build_payload(reading)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    async with _connections_lock:
        _connections.add(websocket)
        _connections_event.set()

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        async with _connections_lock:
            _connections.discard(websocket)
            if not _connections:
                _connections_event.clear()
