import { useCallback, useEffect, useMemo, useState } from "react";

type TimerStatus = "idle" | "running" | "paused";

export function useTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [status, setStatus] = useState<TimerStatus>("idle");

  useEffect(() => {
    if (status !== "running") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status]);

  const start = useCallback((initialSeconds = 0) => {
    setElapsedSeconds(initialSeconds);
    setStatus("running");
  }, []);

  const pause = useCallback(() => {
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    setStatus("running");
  }, []);

  const reset = useCallback((initialSeconds = 0) => {
    setElapsedSeconds(initialSeconds);
    setStatus("idle");
  }, []);

  const formattedTime = useMemo(() => formatSeconds(elapsedSeconds), [elapsedSeconds]);

  return {
    elapsedSeconds,
    formattedTime,
    isRunning: status === "running",
    status,
    start,
    pause,
    resume,
    reset,
  };
}

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}
