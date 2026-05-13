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

interface EducationContentProps {
  content: Record<string, unknown>;
}

const EducationContent: React.FC<EducationContentProps> = ({ content }) => {
  const types = content.types_of_stuttering as
    | { type: string; description: string; examples: string[] }[]
    | undefined;

  const stats = content.statistics as Record<string, string> | undefined;
  const famous = content.famous_people_who_stutter as string[] | undefined;

  const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    Repetitions: "repeat-outline",
    Prolongations: "resize-outline",
    Blocks: "pause-circle-outline",
  };

  const TYPE_COLORS: Record<string, string> = {
    Repetitions: "#4A90D9",
    Prolongations: "#7B68EE",
    Blocks: "#FF8C42",
  };

  return (
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      {!!content.what_is_stuttering && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: "#4A90D915" }]}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#4A90D9"
              />
            </View>
            <Text style={styles.cardTitle}>What is Stuttering?</Text>
          </View>
          <Text style={styles.cardBody}>
            {String(content.what_is_stuttering)}
          </Text>
        </View>
      )}

      {types && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: "#7B68EE15" }]}>
              <Ionicons name="layers-outline" size={18} color="#7B68EE" />
            </View>
            <Text style={styles.cardTitle}>Types of Stuttering</Text>
          </View>
          {types.map((item, index) => {
            const typeColor = TYPE_COLORS[item.type] || colors.secondary;
            const typeIcon = TYPE_ICONS[item.type] || "ellipse-outline";
            return (
              <View
                key={index}
                style={[
                  styles.typeCard,
                  { borderLeftColor: typeColor },
                  index === types.length - 1 && { marginBottom: 0 },
                ]}
              >
                <View style={styles.typeHeader}>
                  <Ionicons name={typeIcon} size={16} color={typeColor} />
                  <Text style={[styles.typeTitle, { color: typeColor }]}>
                    {item.type}
                  </Text>
                </View>
                <Text style={styles.typeDesc}>{item.description}</Text>
                <View style={styles.examplesRow}>
                  {item.examples.map((ex, i) => (
                    <View
                      key={i}
                      style={[
                        styles.exampleChip,
                        { backgroundColor: typeColor + "10" },
                      ]}
                    >
                      <Text style={[styles.exampleText, { color: typeColor }]}>
                        {ex}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {stats && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: "#50C87815" }]}>
              <Ionicons name="stats-chart-outline" size={18} color="#50C878" />
            </View>
            <Text style={styles.cardTitle}>Statistics</Text>
          </View>
          <View style={styles.statsGrid}>
            {Object.entries(stats).map(([key, value], index) => {
              const statColors = ["#ff9b85", "#7B68EE", "#50C878", "#FFB347"];
              const c = statColors[index % statColors.length];
              return (
                <View
                  key={key}
                  style={[styles.statCard, { borderTopColor: c }]}
                >
                  <Text style={[styles.statValue, { color: c }]}>{value}</Text>
                  <Text style={styles.statLabel}>{key.replace(/_/g, " ")}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {famous && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: "#FFB34715" }]}>
              <Ionicons name="star-outline" size={18} color="#FFB347" />
            </View>
            <Text style={styles.cardTitle}>You&apos;re in Great Company</Text>
          </View>
          <Text style={styles.inspireText}>
            These incredible people stutter too &mdash; and they changed the
            world.
          </Text>
          {famous.slice(0, 5).map((person, index) => {
            const parts = person.split(" - ");
            return (
              <View key={index} style={styles.personRow}>
                <View style={styles.personAvatar}>
                  <Text style={styles.personInitial}>
                    {parts[0]?.charAt(0) || "?"}
                  </Text>
                </View>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{parts[0]}</Text>
                  {parts[1] && (
                    <Text style={styles.personRole}>{parts[1]}</Text>
                  )}
                </View>
              </View>
            );
          })}
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

  // Types
  typeCard: {
    backgroundColor: colors.primary_10,
    borderRadius: 14,
    padding: spacingX.sm,
    marginBottom: spacingY.sm,
    borderLeftWidth: 3,
  },
  typeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  typeTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
  },
  typeDesc: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
    marginBottom: spacingY.xs,
    lineHeight: 18,
  },
  examplesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  exampleChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exampleText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
  },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    width: "47%",
    backgroundColor: colors.primary_10,
    padding: spacingX.sm,
    borderRadius: 14,
    alignItems: "center",
    borderTopWidth: 3,
  },
  statValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
    textAlign: "center",
    textTransform: "capitalize",
  },

  // Famous people
  inspireText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginBottom: spacingY.md,
    lineHeight: 20,
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    marginBottom: spacingY.sm,
  },
  personAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.secondary + "18",
    justifyContent: "center",
    alignItems: "center",
  },
  personInitial: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.secondary,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  personRole: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
});

export default EducationContent;
