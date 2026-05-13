import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  colors,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../theme/Theme";

interface CBTContentProps {
  content: Record<string, unknown>;
}

const CBTContent: React.FC<CBTContentProps> = ({ content }) => {
  const reframes = content.common_reframes as
    | { negative: string; balanced: string }[]
    | undefined;

  const distortions = content.cognitive_distortions as
    | { name: string; example: string }[]
    | undefined;

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {!!content.why_self_talk_matters && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: "#50C87815" }]}>
              <Ionicons name="chatbubbles-outline" size={18} color="#50C878" />
            </View>
            <Text style={styles.cardTitle}>Why Self-Talk Matters</Text>
          </View>
          <Text style={styles.cardBody}>
            {String(content.why_self_talk_matters)}
          </Text>
        </View>
      )}

      {!!content.the_cycle && (
        <View style={[styles.card, styles.cycleCard]}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: colors.secondary + "15" },
              ]}
            >
              <Ionicons
                name="sync-outline"
                size={18}
                color={colors.secondary}
              />
            </View>
            <Text style={styles.cardTitle}>The Cycle</Text>
          </View>
          <Text style={styles.cycleText}>{String(content.the_cycle)}</Text>
        </View>
      )}

      {reframes && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: "#4A90D915" }]}>
              <Ionicons
                name="swap-horizontal-outline"
                size={18}
                color="#4A90D9"
              />
            </View>
            <Text style={styles.cardTitle}>Reframe Your Thoughts</Text>
          </View>
          {reframes.map((item, index) => (
            <View key={index} style={styles.reframeCard}>
              <View style={styles.thoughtRow}>
                <View style={styles.negativeIndicator} />
                <Text style={styles.negativeText}>{item.negative}</Text>
              </View>
              <View style={styles.arrowRow}>
                <Ionicons name="arrow-down" size={16} color={colors.success} />
              </View>
              <View style={styles.thoughtRow}>
                <View style={styles.positiveIndicator} />
                <Text style={styles.balancedText}>{item.balanced}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {distortions && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: "#FF8C4215" }]}>
              <Ionicons name="warning-outline" size={18} color="#FF8C42" />
            </View>
            <Text style={styles.cardTitle}>Cognitive Distortions</Text>
          </View>
          {distortions.map((item, index) => (
            <View
              key={index}
              style={[
                styles.distortionCard,
                index === distortions.length - 1 && { marginBottom: 0 },
              ]}
            >
              <Text style={styles.distortionName}>{item.name}</Text>
              <Text style={styles.distortionExample}>
                &ldquo;{item.example}&rdquo;
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacingX.md,
    marginBottom: spacingY.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    marginBottom: spacingY.sm,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  cardBody: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    lineHeight: 22,
  },

  // Cycle
  cycleCard: {
    borderWidth: 1,
    borderColor: colors.secondary + "20",
    borderStyle: "dashed",
  },
  cycleText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
    textAlign: "center",
    lineHeight: 22,
  },

  // Reframes
  reframeCard: {
    backgroundColor: colors.primary_10,
    borderRadius: 14,
    padding: spacingX.md,
    marginBottom: spacingY.sm,
  },
  thoughtRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX.sm,
  },
  negativeIndicator: {
    width: 4,
    height: "100%",
    minHeight: 18,
    borderRadius: 2,
    backgroundColor: colors.errorLight,
    marginTop: 2,
  },
  positiveIndicator: {
    width: 4,
    height: "100%",
    minHeight: 18,
    borderRadius: 2,
    backgroundColor: colors.success,
    marginTop: 2,
  },
  negativeText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.errorLight,
    fontStyle: "italic",
    lineHeight: 20,
  },
  arrowRow: {
    alignItems: "center",
    paddingVertical: 6,
  },
  balancedText: {
    flex: 1,
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.success,
    lineHeight: 20,
  },

  // Distortions
  distortionCard: {
    backgroundColor: colors.primary_10,
    borderRadius: 12,
    padding: spacingX.sm,
    marginBottom: spacingY.sm,
  },
  distortionName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
    marginBottom: 4,
  },
  distortionExample: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontStyle: "italic",
    lineHeight: 20,
  },
});

export default CBTContent;
