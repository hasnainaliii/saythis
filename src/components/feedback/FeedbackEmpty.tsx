import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Sparkles, ArrowRight } from "lucide-react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from "../../theme/Theme";

interface Props {
  onGenerate: () => void;
  hasData: boolean;
}

export function FeedbackEmpty({ onGenerate, hasData }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Sparkles size={40} color={colors.categorySelfAwareness} />
      </View>

      <Text style={styles.title}>
        {hasData ? "Get Your AI Feedback" : "No Data Yet"}
      </Text>

      <Text style={styles.subtitle}>
        {hasData
          ? "Our AI will analyze your therapy progress, stutter scores, and wellness data to give you personalized coaching tips."
          : "Start using the app's therapy tools, log your mood, sleep, and do a stutter analysis to unlock AI-powered feedback."}
      </Text>

      {hasData ? (
        <Pressable style={styles.button} onPress={onGenerate}>
          <Text style={styles.buttonText}>Generate Feedback</Text>
          <ArrowRight size={18} color={colors.white} />
        </Pressable>
      ) : (
        <View style={styles.tipsList}>
          <TipItem text="Try the Stutter Analysis tool" />
          <TipItem text="Log your mood and sleep daily" />
          <TipItem text="Practice with therapy exercises" />
          <TipItem text="Write in your mindful journal" />
        </View>
      )}
    </View>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <View style={styles.tipRow}>
      <View style={styles.tipDot} />
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacingY.xxl,
    paddingHorizontal: spacingX.xl,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.categorySelfAwareness + "18",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY.lg,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    textAlign: "center",
    marginBottom: spacingY.sm,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: fontSizes.medium * 1.5,
    marginBottom: spacingY.xl,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.categorySelfAwareness,
    paddingVertical: spacingY.md,
    paddingHorizontal: spacingX.xl * 1.5,
    borderRadius: radii.pill,
  },
  buttonText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  tipsList: {
    width: "100%",
    gap: spacingY.sm,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    backgroundColor: colors.white,
    paddingVertical: spacingY.sm,
    paddingHorizontal: spacingX.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.categorySelfAwareness,
  },
  tipText: {
    fontFamily: FONTS.primaryMedium,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
});
