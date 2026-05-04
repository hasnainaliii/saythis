import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View, ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../../components/Button";
import ExerciseSlide, { Slide } from "../../../../components/exercise/ExerciseSlide";
import { Exercise } from "../../../../data/chapter1Data";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../../../theme/Theme";

export default function ExercisePlayerScreen() {
  const { exerciseData } = useLocalSearchParams<{ exerciseData: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!exerciseData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No exercise data</Text>
      </SafeAreaView>
    );
  }

  const exercise: Exercise = JSON.parse(exerciseData);

  const slides: Slide[] = [
    { id: "instructions", title: "Instructions", type: "instructions", data: exercise.instructions },
    { id: "content", title: "Learn", type: "content", data: exercise.content },
    { id: "outcomes", title: "Expected Outcomes", type: "outcomes", data: exercise.expected_outcomes },
    { id: "safety", title: "Safety Notes", type: "safety", data: exercise.safety_notes },
  ];

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Button
          title="Close"
          onPress={() => router.back()}
          variant="outline"
          size="small"
          icon={<Ionicons name="close" size={16} color={colors.secondary} />}
          iconPosition="left"
        />
        <View style={styles.progressDots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
        <View style={{ width: 70 }} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.exerciseTitle} numberOfLines={2}>
          {exercise.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={colors.black_text} />
          <Text style={styles.metaText}>{exercise.duration_minutes} min</Text>
          <Text style={styles.metaDivider}>•</Text>
          <Text style={styles.metaText}>{exercise.frequency}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => <ExerciseSlide slide={item} exercise={exercise} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={styles.flatList}
      />

      <View style={styles.swipeHint}>
        <Text style={styles.swipeHintText}>
          Swipe to navigate • {currentIndex + 1} / {slides.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.sm,
  },
  progressDots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.secondary,
    width: 24,
  },
  dotInactive: {
    backgroundColor: colors.primary20,
  },
  titleContainer: {
    paddingHorizontal: spacingX.lg,
    marginBottom: spacingY.md,
  },
  exerciseTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
  },
  metaDivider: {
    color: colors.black_text,
  },
  flatList: {
    flex: 1,
  },
  swipeHint: {
    alignItems: "center",
    paddingVertical: spacingY.md,
  },
  swipeHintText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
  },
});
