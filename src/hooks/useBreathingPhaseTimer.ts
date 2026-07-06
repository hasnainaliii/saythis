import { useState, useRef, useCallback, useEffect } from 'react';

export interface BreathingPhase {
  id: string;
  label: string;
  durationMs: number;
  color: string;
}

interface UseBreathingPhaseTimerProps {
  phases: BreathingPhase[];
  totalCycles: number;
  onPhaseChange?: (phase: BreathingPhase, phaseIndex: number) => void;
  onCycleComplete?: (cycleNumber: number) => void;
  onComplete?: () => void;
}

export const useBreathingPhaseTimer = ({
  phases,
  totalCycles,
  onPhaseChange,
  onCycleComplete,
  onComplete,
}: UseBreathingPhaseTimerProps) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalElapsedMs, setTotalElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseElapsedRef = useRef(0);
  const phaseIndexRef = useRef(0);
  const cyclesRef = useRef(0);
  const lastTickRef = useRef(0);
  const completedRef = useRef(false);

  // Stable callback refs
  const onPhaseChangeRef = useRef(onPhaseChange);
  const onCycleCompleteRef = useRef(onCycleComplete);
  const onCompleteRef = useRef(onComplete);
  const phasesRef = useRef(phases);
  const totalCyclesRef = useRef(totalCycles);

  useEffect(() => { onPhaseChangeRef.current = onPhaseChange; }, [onPhaseChange]);
  useEffect(() => { onCycleCompleteRef.current = onCycleComplete; }, [onCycleComplete]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => { phasesRef.current = phases; }, [phases]);
  useEffect(() => { totalCyclesRef.current = totalCycles; }, [totalCycles]);

  const tick = useCallback(() => {
    const now = Date.now();
    const dt = now - lastTickRef.current;
    lastTickRef.current = now;

    if (completedRef.current || phasesRef.current.length === 0) return;

    phaseElapsedRef.current += dt;
    setTotalElapsedMs(prev => prev + dt);

    const currentPhase = phasesRef.current[phaseIndexRef.current];
    const dur = currentPhase.durationMs;
    const p = Math.min(1, phaseElapsedRef.current / dur);
    setProgress(p);

    if (phaseElapsedRef.current >= dur) {
      phaseElapsedRef.current = 0;
      let nextIdx = phaseIndexRef.current + 1;

      if (nextIdx >= phasesRef.current.length) {
        nextIdx = 0;
        const newCycles = cyclesRef.current + 1;
        cyclesRef.current = newCycles;
        setCyclesCompleted(newCycles);
        onCycleCompleteRef.current?.(newCycles);

        if (newCycles >= totalCyclesRef.current) {
          completedRef.current = true;
          setIsRunning(false);
          setProgress(1);
          if (intervalRef.current) clearInterval(intervalRef.current);
          onCompleteRef.current?.();
          return;
        }
      }

      phaseIndexRef.current = nextIdx;
      setPhaseIndex(nextIdx);
      setProgress(0);
      onPhaseChangeRef.current?.(phasesRef.current[nextIdx], nextIdx);
    }
  }, []);

  const start = useCallback(() => {
    if (phasesRef.current.length === 0) return;
    phaseElapsedRef.current = 0;
    phaseIndexRef.current = 0;
    cyclesRef.current = 0;
    completedRef.current = false;
    lastTickRef.current = Date.now();

    setPhaseIndex(0);
    setProgress(0);
    setCyclesCompleted(0);
    setTotalElapsedMs(0);
    setIsRunning(true);
    setIsPaused(false);

    onPhaseChangeRef.current?.(phasesRef.current[0], 0);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 16);
  }, [tick]);

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (completedRef.current) return;
    lastTickRef.current = Date.now();
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 16);
  }, [tick]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    completedRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
    setPhaseIndex(0);
    setProgress(0);
    phaseElapsedRef.current = 0;
    phaseIndexRef.current = 0;
  }, []);

  const skipToNext = useCallback(() => {
    if (!isRunning || completedRef.current) return;
    phaseElapsedRef.current = phasesRef.current[phaseIndexRef.current].durationMs;
    tick();
  }, [isRunning, tick]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    currentPhase: phases[phaseIndex] || phases[0],
    phaseIndex,
    progress,
    cyclesCompleted,
    totalElapsedMs,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    skipToNext,
  };
};
