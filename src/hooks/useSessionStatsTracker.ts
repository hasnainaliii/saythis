import { useState, useRef, useEffect, useCallback } from 'react';

type ToolType = 'BOX_BREATHING' | 'DIAPHRAGMATIC' | 'PRE_SPEECH' | 'GENTLE_ONSET' | 'PROLONGED_SPEECH' | 'STUTTER_TAP_COUNTER' | 'TIMED_READING_WPM' | 'VIRTUAL_COFFEE_ORDER' | 'PHONE_CALL_SIMULATOR';

export const useSessionStatsTracker = (toolType: ToolType) => {
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [endedAt, setEndedAt] = useState<string | null>(null);
  const [elapsedDisplay, setElapsedDisplay] = useState('00:00');

  const startTimestamp = useRef<number | null>(null);
  const displayInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSession = useCallback(() => {
    const now = Date.now();
    startTimestamp.current = now;
    setStartedAt(new Date(now).toISOString());
    setEndedAt(null);
    setDurationSeconds(0);
    setElapsedDisplay('00:00');

    if (displayInterval.current) clearInterval(displayInterval.current);
    displayInterval.current = setInterval(() => {
      if (!startTimestamp.current) return;
      const elapsed = Math.floor((Date.now() - startTimestamp.current) / 1000);
      setDurationSeconds(elapsed);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      setElapsedDisplay(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
  }, []);

  const endSession = useCallback(() => {
    if (displayInterval.current) clearInterval(displayInterval.current);
    displayInterval.current = null;
    const now = Date.now();
    setEndedAt(new Date(now).toISOString());
    if (startTimestamp.current) {
      setDurationSeconds(Math.floor((now - startTimestamp.current) / 1000));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (displayInterval.current) clearInterval(displayInterval.current);
    };
  }, []);

  return { startSession, endSession, durationSeconds, startedAt, endedAt, elapsedDisplay };
};
