import { useState, useEffect, useCallback } from 'react';

export const useSessionTimer = (isActive: boolean, isConversationMode: boolean = false) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const resetTimer = useCallback(() => {
    setElapsedSeconds(0);
  }, []);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const elapsedFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const estimatedWords = isConversationMode ? 0 : Math.floor((elapsedSeconds / 60) * 130);

  return {
    elapsedSeconds,
    elapsedFormatted,
    estimatedWords,
    resetTimer,
  };
};
