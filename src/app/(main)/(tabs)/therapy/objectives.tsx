import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../../../components/BackButton";
import ChapterHeroIcon from "../../../../components/ChapterHeroIcon";
import { HoldToContinueButton } from "../../../../components/tools/HoldToContinueButton";
import { CHAPTER_1_DATA } from "../../../../data/chapter1Data";
import { CHAPTER_2_DATA } from "../../../../data/chapter2Data";
import {
    CHAPTER_ACCENT,
    CHAPTER_ICON,
    CHAPTER_TITLE,
} from "../../../../data/chapterConfig";
import { useTherapyProgress } from "../../../../hooks/useTherapyProgress";
import {
    colors,
    FONTS,
    fontSizes,
    spacingX,
    spacingY,
} from "../../../../theme/Theme";
import { setIntroDismissed } from "../../../../utils/therapyProgress";

export default function ObjectivesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { progress } = useTherapyProgress();

  const chapterId = id ?? "1";
  const chapterNumber = Number(chapterId);
  const accent = CHAPTER_ACCENT[chapterId] ?? colors.secondary;
  const icon = CHAPTER_ICON[chapterId] ?? "book-outline";
  const title = CHAPTER_TITLE[chapterId] ?? "Chapter";
  const chapterNum = chapterId.padStart(2, "0");
  const objectives =
    chapterId === "1"
      ? CHAPTER_1_DATA.learning_objectives
      : chapterId === "2"
        ? CHAPTER_2_DATA.learning_objectives
        : ["Complete this chapter to unlock content"];

  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    setDontShowAgain(!!progress.introDismissed[chapterId]);
  }, [chapterId, progress.introDismissed]);

  const handleBegin = async () => {
    if (!Number.isNaN(chapterNumber)) {
      await setIntroDismissed(chapterNumber, dontShowAgain);
    }

    router.replace({
      pathname: "/(main)/(tabs)/therapy/[id]",
      params: { id: chapterId },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.navBar}>
        <BackButton />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          style={styles.hero}
        >
          <ChapterHeroIcon icon={icon} accent={accent} />

          <View style={[styles.pill, { backgroundColor: accent + "1A" }]}>
            <Text style={[styles.pillText, { color: accent }]}>
              CHAPTER {chapterNum}
            </Text>
          </View>

          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroSub}>
            Here&apos;s what you&apos;ll learn before diving in
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.divider} />

        <View style={styles.objectivesBlock}>
          <Animated.Text entering={FadeInDown.delay(300).duration(400)} style={styles.blockLabel}>
            Learning Objectives
          </Animated.Text>
          {objectives.map((obj, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(400 + i * 100).duration(400).springify()}
              style={styles.objectiveRow}
            >
              <View style={[styles.numBadge, { backgroundColor: accent }]}>
                <Text style={styles.numText}>{i + 1}</Text>
              </View>
              <Text style={styles.objectiveText}>{obj}</Text>
            </Animated.View>
          ))}
          <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.inlineCta}>
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => setDontShowAgain(!dontShowAgain)}
                style={[
                  styles.squareCheckbox,
                  dontShowAgain && { borderColor: accent, backgroundColor: accent + "1A" }
                ]}
              >
                <Ionicons
                  name={dontShowAgain ? "checkmark" : "eye-off-outline"}
                  size={26}
                  color={dontShowAgain ? accent : colors.textMuted}
                />
              </Pressable>

              <View style={styles.holdBtnWrapper}>
                <HoldToContinueButton
                  onComplete={handleBegin}
                  accentColor={accent}
                  label="Hold to Continue"
                />
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  navBar: {
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xs,
  },
  scroll: {
    paddingHorizontal: spacingX.lg,
    paddingBottom: 120,
  },

  // hero
  hero: {
    alignItems: "center",
    paddingTop: spacingY.md,
    paddingBottom: spacingY.lg,
    gap: spacingY.sm,
  },
  pill: {
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xxs,
    borderRadius: 999,
  },
  pillText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    textAlign: "center",
  },
  heroSub: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: "center",
  },

  // divider
  divider: {
    height: 1,
    backgroundColor: colors.libraryBorder,
    marginVertical: spacingY.md,
  },

  // objectives
  objectivesBlock: {
    paddingTop: spacingY.xs,
  },
  blockLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
    marginBottom: spacingY.md,
  },
  objectiveRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX.sm,
    marginBottom: spacingY.sm,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacingX.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  numBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  numText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  objectiveText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 24,
  },

  // inline cta
  inlineCta: {
    marginTop: spacingY.xl,
    paddingTop: spacingY.md,
    borderTopWidth: 1,
    borderTopColor: colors.libraryBorder,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
  },
  squareCheckbox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.librarySurface,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  holdBtnWrapper: {
    flex: 1,
  },
});
