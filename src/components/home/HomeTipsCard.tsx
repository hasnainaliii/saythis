import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Lightbulb } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from "../../theme/Theme";

const TIPS = [
  "Take a deep breath before you start speaking",
  "It is perfectly okay to stutter be kind to yourself",
  "Pause when you feel a block coming there is no rush",
  "Focus on what you want to say not how you say it",
  "Use slow easy onsets when starting a tricky word",
  "Maintain natural eye contact to build confidence while speaking",
  "Speak at a comfortable pace without feeling pressured to hurry",
  "Remember that your message is more important than perfect fluency",
  "Practice light articulatory contacts for smoother speech transitions",
  "Celebrate your small victories and speaking successes every day",
  "Stay hydrated to keep your vocal cords relaxed and healthy",
  "Read aloud daily to practice smooth continuous airflow",
  "Embrace voluntary stuttering to reduce the fear of blocking",
  "Focus on exhaling smoothly before initiating your speech",
  "Join a support group to share experiences and learn from others",
];

export function HomeTipsCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % TIPS.length);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <View style={styles.card}>
        <View style={styles.header}>
          <Lightbulb size={18} color={colors.star} />
          <Text style={styles.title}>Daily Fluency Tips</Text>
        </View>
        <View style={styles.content}>
          <Animated.Text
            key={index}
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
            style={styles.tipText}
          >
            {TIPS[index]}
          </Animated.Text>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacingY.xl,
  },
  separator: {
    height: 1,
    backgroundColor: colors.libraryBorder || colors.secondary_20,
    marginHorizontal: spacingX.xl,
    opacity: 0.6,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacingX.lg,
    marginHorizontal: spacingX.lg,
    marginVertical: spacingY.xl,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacingY.sm,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  content: {
    minHeight: 52,
    justifyContent: "center",
  },
  tipText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 24,
  },
});
