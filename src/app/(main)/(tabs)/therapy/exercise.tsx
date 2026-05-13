import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../../../components/BackButton";
import ExerciseSlide, {
  Slide,
} from "../../../../components/exercise/ExerciseSlide";
import { Exercise } from "../../../../data/chapter1Data";
import { CATEGORY_ACCENT } from "../../../../data/chapterConfig";
import {
  colors,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../../../theme/Theme";

const SLIDE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  instructions: "document-text-outline",
  content: "school-outline",
  outcomes: "trophy-outline",
  safety: "shield-checkmark-outline",
};

export default function ExercisePlayerScreen() {
  const { exerciseData } = useLocalSearchParams<{ exerciseData: string }>();
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation values for Hold-to-Complete
  const holdProgress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Reset progress when slide changes
    holdProgress.value = 0;
  }, [currentIndex, holdProgress]);

  if (!exerciseData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No exercise data</Text>
      </SafeAreaView>
    );
  }

  const exercise: Exercise = JSON.parse(exerciseData);
  const accent = CATEGORY_ACCENT[exercise.category] ?? colors.secondary;

  const slides: Slide[] = [
    {
      id: "instructions",
      title: "Instructions",
      type: "instructions",
      data: exercise.instructions,
    },
    { id: "content", title: "Learn", type: "content", data: exercise.content },
    {
      id: "outcomes",
      title: "Expected Outcomes",
      type: "outcomes",
      data: exercise.expected_outcomes,
    },
    {
      id: "safety",
      title: "Safety Notes",
      type: "safety",
      data: exercise.safety_notes,
    },
  ];

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slides.length - 1;

  const goToPrev = () => {
    if (!isFirst) {
      pagerRef.current?.setPage(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (isLast) {
      router.back();
    } else {
      pagerRef.current?.setPage(currentIndex + 1);
    }
  };

  const handleHoldComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    goToNext();
  };

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(0.96, { duration: 150 });
    holdProgress.value = withTiming(
      1,
      { duration: 700, easing: Easing.inOut(Easing.ease) },
      (finished) => {
        if (finished) {
          runOnJS(handleHoldComplete)();
        }
      }
    );
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
    if (holdProgress.value < 1) {
      cancelAnimation(holdProgress);
      holdProgress.value = withTiming(0, { duration: 250 });
    }
  };

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: `${holdProgress.value * 100}%`,
    };
  });

  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton variant="light" />
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
        <View style={styles.headerSpacer} />
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
        <View
          style={[styles.slideLabelIcon, { backgroundColor: accent + "15" }]}
        >
          <Ionicons
            name={SLIDE_ICONS[slides[currentIndex]?.type] || "document-outline"}
            size={14}
            color={accent}
          />
        </View>
        <Text style={styles.slideLabelText}>{slides[currentIndex]?.title}</Text>
      </View>

      {/* PagerView */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ flex: 1 }}>
            <ExerciseSlide slide={slide} exercise={exercise} />
          </View>
        ))}
      </PagerView>

      {/* Bottom navigation */}
      <View style={styles.navRow}>
        {/* Prev button */}
        <Pressable
          onPress={goToPrev}
          disabled={isFirst}
          style={({ pressed }) => [
            styles.navButton,
            { backgroundColor: accent + "15" },
            isFirst && styles.navButtonDisabled,
            pressed && !isFirst && { opacity: 0.75 },
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={isFirst ? colors.textDisabled : accent}
          />
        </Pressable>

        {/* Counter pill */}
        <View style={styles.counterPill}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {slides.length}
          </Text>
        </View>

        {/* Next / Done Hold Button */}
        <Animated.View style={[animatedScaleStyle]}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.holdButtonContainer, { backgroundColor: accent + "33" }]}
          >
            {/* The filling background */}
            <Animated.View
              style={[
                styles.holdButtonFill,
                { backgroundColor: accent },
                animatedFillStyle,
              ]}
            />
            {/* The content */}
            <View style={styles.holdButtonContent}>
              <Text style={styles.holdButtonText}>
                {isLast ? "Hold to Finish" : "Hold to Next"}
              </Text>
              {isLast ? (
                <Ionicons name="checkmark" size={16} color={colors.white} />
              ) : (
                <Ionicons name="arrow-forward" size={16} color={colors.white} />
              )}
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  // Header
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
  headerSpacer: {
    width: 44,
  },

  // Title
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

  // Slide label
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

  // Pager
  pager: {
    flex: 1,
  },

  // Bottom navigation
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.sm,
    paddingBottom: spacingY.lg,
  },
  navButton: {
    height: 48,
    minWidth: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  counterPill: {
    backgroundColor: colors.white,
    paddingHorizontal: spacingX.md,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  counterText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  holdButtonContainer: {
    height: 48,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: spacingX.md,
    minWidth: 140,
  },
  holdButtonFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
  },
  holdButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    zIndex: 1,
  },
  holdButtonText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
