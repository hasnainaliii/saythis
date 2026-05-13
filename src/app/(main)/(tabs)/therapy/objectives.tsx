import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../../../components/BackButton";
import ChapterHeroIcon from "../../../../components/ChapterHeroIcon";
import { CHAPTER_1_DATA } from "../../../../data/chapter1Data";
import {
  CHAPTER_ACCENT,
  CHAPTER_ICON,
  CHAPTER_TITLE,
} from "../../../../data/chapterConfig";
import {
  colors,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../../../theme/Theme";

export default function ObjectivesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const chapterId = id ?? "1";
  const accent = CHAPTER_ACCENT[chapterId] ?? colors.secondary;
  const icon = CHAPTER_ICON[chapterId] ?? "book-outline";
  const title = CHAPTER_TITLE[chapterId] ?? "Chapter";
  const chapterNum = chapterId.padStart(2, "0");
  const objectives =
    chapterId === "1"
      ? CHAPTER_1_DATA.learning_objectives
      : ["Complete this chapter to unlock content"];

  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleBegin = async () => {
    if (dontShowAgain) {
      try {
        await AsyncStorage.setItem(
          `chapter_${chapterId}_objectives_seen`,
          "true",
        );
      } catch {}
    }
    // storage errors are non-blocking
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
        </View>
      </ScrollView>

      <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.cta}>
        <Pressable
          onPress={() => setDontShowAgain(!dontShowAgain)}
          style={styles.checkboxRow}
        >
          <Ionicons
            name={dontShowAgain ? "checkbox" : "square-outline"}
            size={22}
            color={dontShowAgain ? "#4A5D4E" : colors.textMuted}
          />
          <Text style={styles.checkboxText}>Don&apos;t show again</Text>
        </Pressable>

        <Pressable
          onPress={handleBegin}
          style={({ pressed }) => [
            styles.ctaBtn,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.ctaBtnText}>Continue</Text>
        </Pressable>
      </Animated.View>
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
    paddingBottom: spacingY.xl,
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

  // bottom cta
  cta: {
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.sm,
    paddingBottom: spacingY.md,
    backgroundColor: colors.primary,
    borderTopWidth: 1,
    borderTopColor: colors.libraryBorder,
    gap: spacingY.sm,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingX.xs,
    paddingVertical: spacingY.xs,
  },
  checkboxText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
  },
  ctaBtn: {
    backgroundColor: "#F2F5F3", // Soft subtle off-white/sage background
    borderRadius: 16,
    paddingVertical: spacingY.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCE5DF", // Sage tinted border
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  ctaBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: "#2E3B32", // Deep charcoal/sage text
    letterSpacing: 0.5,
  },
});
