import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Sparkles, Clock } from "lucide-react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from "../../theme/Theme";

interface Props {
  response: string;
  generatedAt: string;
}

export function FeedbackResponse({ response, generatedAt }: Props) {
  const dateLabel = new Date(generatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Sparkles size={14} color={colors.white} />
        <Text style={styles.badgeText}>AI Insights</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.responseText}>{response}</Text>
      </View>

      <View style={styles.footer}>
        <Clock size={12} color={colors.textMuted} />
        <Text style={styles.footerText}>Generated on {dateLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX.lg,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: colors.categorySelfAwareness,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xxs,
    borderRadius: radii.pill,
    marginBottom: spacingY.md,
  },
  badgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacingX.lg,
    borderWidth: 1,
    borderColor: colors.categorySelfAwareness + "30",
  },
  responseText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: fontSizes.medium * 1.7,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacingY.sm,
    alignSelf: "center",
  },
  footerText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
});
