import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExerciseShell from "../../../../components/exercise/ExerciseShell";
import { Exercise, CHAPTER_1_DATA } from "../../../../data/chapter1Data";
import { colors, FONTS, fontSizes } from "../../../../theme/Theme";

export default function ExerciseDetailScreen() {
  const { exerciseData } = useLocalSearchParams<{ exerciseData: string }>();
  const router = useRouter();

  if (!exerciseData) {
    return (
      <SafeAreaView style={styles.empty}>
        <Text style={styles.emptyText}>No exercise data</Text>
      </SafeAreaView>
    );
  }

  const exercise: Exercise = JSON.parse(exerciseData);

  // find next exercise in the chapter
  const exercises = CHAPTER_1_DATA.exercises;
  const currentIdx = exercises.findIndex(e => e.id === exercise.id);
  const nextExercise = currentIdx >= 0 && currentIdx < exercises.length - 1
    ? exercises[currentIdx + 1]
    : undefined;

  const handleComplete = (_rating: number, _notes: string) => {
    // will persist later when backend is ready
  };

  const handleBack = () => {
    router.back();
  };

  const handleNextExercise = nextExercise
    ? () => {
        router.replace({
          pathname: "/(main)/(tabs)/therapy/exercise",
          params: { exerciseData: JSON.stringify(nextExercise) },
        });
      }
    : undefined;

  return (
    <ExerciseShell
      exercise={exercise}
      onComplete={handleComplete}
      onBack={handleBack}
      onNextExercise={handleNextExercise}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  emptyText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
  },
});
