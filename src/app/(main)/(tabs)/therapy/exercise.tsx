import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View, ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../../components/Button";
import ExerciseSlide, { Slide } from "../../../../components/exercise/ExerciseSlide";
import { Exercise } from "../../../../data/chapter1Data";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../../../theme/Theme";

const CATEGORY_COLOR: Record<string, string> = {
  education: "#4A90D9",
  self_awareness: "#7B68EE",
  cognitive_behavioral: "#50C878",
  self_advocacy: "#FF8C42",
};

const SLIDE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  instructions: "document-text-outline",
  content: "school-outline",
  outcomes: "trophy-outline",
  safety: "shield-checkmark-outline",
};

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
  const accent = CATEGORY_COLOR[exercise.category] || colors.secondary;

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
      {/* Header */}
      <View style={styles.header}>
        <Button
          title="Close"
          onPress={() => router.back()}
          variant="outline"
          size="small"
          icon={<Ionicons name="close" size={16} color={colors.secondary} />}
          iconPosition="left"
        />
        <View style={styles.progressBar}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                {
                  backgroundColor:
                    index <= currentIndex ? accent : colors.primary20,
                },
              ]}
            />
          ))}
        </View>
        <View style={{ width: 70 }} />
      </View>

      {/* Title area */}
      <View style={styles.titleContainer}>
        <Text style={styles.exerciseTitle} numberOfLines={2}>
          {exercise.title}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.metaChip, { backgroundColor: accent + "15" }]}>
            <Ionicons name="time-outline" size={12} color={accent} />
            <Text style={[styles.metaChipText, { color: accent }]}>
              {exercise.duration_minutes} min
            </Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: accent + "15" }]}>
            <Ionicons name="refresh-outline" size={12} color={accent} />
            <Text style={[styles.metaChipText, { color: accent }]}>
              {exercise.frequency}
            </Text>
          </View>
        </View>
      </View>

      {/* Slide label */}
      <View style={styles.slideLabelRow}>
        <View style={[styles.slideLabelIcon, { backgroundColor: accent + "15" }]}>
          <Ionicons
            name={SLIDE_ICONS[slides[currentIndex]?.type] || "document-outline"}
            size={14}
            color={accent}
          />
        </View>
        <Text style={styles.slideLabelText}>{slides[currentIndex]?.title}</Text>
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

      {/* Bottom swipe hint */}
      <View style={styles.swipeHint}>
        <View style={styles.swipeHintInner}>
          <Ionicons name="swap-horizontal-outline" size={14} color={colors.textMuted} />
          <Text style={styles.swipeHintText}>
            Swipe to navigate • {currentIndex + 1} / {slides.length}
          </Text>
        </View>
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
  progressBar: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
    marginHorizontal: spacingX.md,
  },
  progressSegment: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },
  titleContainer: {
    paddingHorizontal: spacingX.lg,
    marginBottom: spacingY.sm,
  },
  exerciseTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  metaChipText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
  },
  slideLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacingX.lg,
    marginBottom: spacingY.sm,
  },
  slideLabelIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  slideLabelText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  flatList: {
    flex: 1,
  },
  swipeHint: {
    alignItems: "center",
    paddingVertical: spacingY.md,
  },
  swipeHintInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: spacingX.md,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  swipeHintText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
});
