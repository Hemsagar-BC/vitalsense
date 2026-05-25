import { useEffect, useRef, useState } from "react";

import { MAX_HISTORY, WS_URL } from "../lib/constants";
import type { VitalReading } from "../types/vitals";

const RECONNECT_DELAY_MS = 3000;

export function useVitals() {
  const [readings, setReadings] = useState<VitalReading[]>([]);
  const [latest, setLatest] = useState<VitalReading | null>(null);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(true);

  useEffect(() => {
    shouldReconnectRef.current = true;

    const connect = () => {
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as VitalReading;
          if (
            typeof payload.heart_rate !== "number" ||
            typeof payload.spo2 !== "number" ||
            typeof payload.temperature !== "number" ||
            typeof payload.status !== "string" ||
            typeof payload.timestamp !== "string"
          ) {
            return;
          }

          setLatest(payload);
          setReadings((prev) => {
            const next = [...prev, payload];
            return next.slice(-MAX_HISTORY);
          });
        } catch {
          return;
        }
      };

      socket.onclose = () => {
        setConnected(false);
        if (shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketRef.current?.close();
    };
  }, []);

  return { latest, readings, connected };
}
