import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
    DEFAULT_THERAPY_PROGRESS,
    getTherapyProgress,
    TherapyProgress,
} from "../utils/therapyProgress";

export const useTherapyProgress = () => {
  const [progress, setProgress] = useState<TherapyProgress>(
    DEFAULT_THERAPY_PROGRESS,
  );
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await getTherapyProgress();
    setProgress(next);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { progress, isLoading, refresh, setProgress };
};
