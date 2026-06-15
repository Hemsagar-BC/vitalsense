from __future__ import annotations

import os
import threading
import time
from typing import Optional

import serial
from dotenv import load_dotenv

load_dotenv()

_SERIAL_PORT = os.getenv("SERIAL_PORT", "COM4")
_BAUD_RATE = int(os.getenv("BAUD_RATE", "9600"))

_RECONNECT_DELAY_SEC = 2.0

_latest_reading: Optional[dict[str, float]] = None
_latest_lock = threading.Lock()

_reader_thread: Optional[threading.Thread] = None
_stop_event = threading.Event()


def _read_loop() -> None:
    while not _stop_event.is_set():
        try:
            with serial.Serial(_SERIAL_PORT, _BAUD_RATE, timeout=1) as ser:
                while not _stop_event.is_set():
                    raw = ser.readline().decode("utf-8", errors="ignore").strip()
                    if not raw:
                        continue
                    try:
                        heart_rate = float(raw.split(",", 1)[0].strip())
                    except ValueError:
                        continue

                    reading = {
                        "heart_rate": heart_rate,
                    }
                    with _latest_lock:
                        global _latest_reading
                        _latest_reading = reading
        except serial.SerialException:
            time.sleep(_RECONNECT_DELAY_SEC)


def _ensure_started() -> None:
    global _reader_thread
    if _reader_thread and _reader_thread.is_alive():
        return

    _stop_event.clear()
    _reader_thread = threading.Thread(target=_read_loop, daemon=True)
    _reader_thread.start()


def get_latest_reading() -> Optional[dict[str, float]]:
    _ensure_started()
    with _latest_lock:
        if _latest_reading is None:
            return None
        return dict(_latest_reading)


def stop_reader() -> None:
    _stop_event.set()
