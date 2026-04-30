import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";
import { contentStyles } from "./contentStyles";

interface CBTContentProps {
  content: Record<string, unknown>;
}

const CBTContent: React.FC<CBTContentProps> = ({ content }) => {
  const reframes = content.common_reframes as
    | Array<{ negative: string; balanced: string }>
    | undefined;

  const distortions = content.cognitive_distortions as
    | Array<{ name: string; example: string }>
    | undefined;

  return (
    <ScrollView
      style={contentStyles.contentScroll}
      showsVerticalScrollIndicator={false}
    >
      {!!content.why_self_talk_matters && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Why Self-Talk Matters</Text>
          <Text style={contentStyles.infoText}>
            {String(content.why_self_talk_matters)}
          </Text>
        </View>
      )}

      {!!content.the_cycle && (
        <View
          style={[contentStyles.infoCard, { backgroundColor: colors.secondary + "10" }]}
        >
          <Text style={styles.cycleText}>{String(content.the_cycle)}</Text>
        </View>
      )}

      {reframes && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Reframe Your Thoughts</Text>
          {reframes.map((item, index) => (
            <View key={index} style={styles.reframeCard}>
              <View style={styles.thoughtRow}>
                <View style={[styles.thoughtBadge, { backgroundColor: colors.errorLight + "20" }]}>
                  <Ionicons name="close-circle" size={14} color={colors.errorLight} />
                </View>
                <Text style={styles.negativeText}>{item.negative}</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-down" size={20} color={colors.secondary} />
              </View>
              <View style={styles.thoughtRow}>
                <View style={[styles.thoughtBadge, { backgroundColor: colors.success + "20" }]}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                </View>
                <Text style={styles.balancedText}>{item.balanced}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {distortions && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Cognitive Distortions</Text>
          {distortions.map((item, index) => (
            <View key={index} style={styles.distortionItem}>
              <Text style={styles.distortionName}>{item.name}</Text>
              <Text style={styles.distortionExample}>"{item.example}"</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cycleText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
    textAlign: "center",
  },
  reframeCard: {
    backgroundColor: colors.primary_10,
    borderRadius: 12,
    padding: spacingX.md,
    marginBottom: spacingY.md,
  },
  thoughtRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX.sm,
  },
  thoughtBadge: {
    padding: 4,
    borderRadius: 12,
  },
  negativeText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.errorLight,
    fontStyle: "italic",
  },
  arrowContainer: {
    alignItems: "center",
    paddingVertical: spacingY.xs,
  },
  balancedText: {
    flex: 1,
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.success,
  },
  distortionItem: {
    marginBottom: spacingY.sm,
    paddingBottom: spacingY.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  distortionName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.black,
    marginBottom: 4,
  },
  distortionExample: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
    fontStyle: "italic",
  },
});

export default CBTContent;
