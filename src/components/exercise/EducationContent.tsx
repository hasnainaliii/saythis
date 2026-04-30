import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";
import { contentStyles } from "./contentStyles";

interface EducationContentProps {
  content: Record<string, unknown>;
}

const EducationContent: React.FC<EducationContentProps> = ({ content }) => {
  const types = content.types_of_stuttering as
    | Array<{ type: string; description: string; examples: string[] }>
    | undefined;

  const stats = content.statistics as Record<string, string> | undefined;
  const famous = content.famous_people_who_stutter as string[] | undefined;

  return (
    <ScrollView
      style={contentStyles.contentScroll}
      showsVerticalScrollIndicator={false}
    >
      {!!content.what_is_stuttering && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>What is Stuttering?</Text>
          <Text style={contentStyles.infoText}>
            {String(content.what_is_stuttering)}
          </Text>
        </View>
      )}

      {types && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Types of Stuttering</Text>
          {types.map((item, index) => (
            <View key={index} style={styles.typeItem}>
              <Text style={styles.typeTitle}>{item.type}</Text>
              <Text style={styles.typeDesc}>{item.description}</Text>
              <View style={styles.examplesRow}>
                {item.examples.map((ex, i) => (
                  <View key={i} style={styles.exampleBadge}>
                    <Text style={styles.exampleText}>{ex}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {stats && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            {Object.entries(stats).map(([key, value]) => (
              <View key={key} style={styles.statItem}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{key.replace(/_/g, " ")}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {famous && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Famous People Who Stutter</Text>
          {famous.slice(0, 5).map((person, index) => (
            <View key={index} style={styles.personItem}>
              <Ionicons name="star" size={14} color={colors.secondary} />
              <Text style={styles.personText}>{person}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  typeItem: {
    marginBottom: spacingY.md,
    paddingBottom: spacingY.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  typeTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.secondary,
    marginBottom: 4,
  },
  typeDesc: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
    marginBottom: spacingY.xs,
  },
  examplesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  exampleBadge: {
    backgroundColor: colors.primary10,
    paddingHorizontal: spacingX.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  exampleText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.black,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacingX.sm,
  },
  statItem: {
    width: "47%",
    backgroundColor: colors.primary_10,
    padding: spacingX.sm,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.secondary,
  },
  statLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.black_text,
    textAlign: "center",
    textTransform: "capitalize",
  },
  personItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    marginBottom: spacingY.xs,
  },
  personText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
  },
});

export default EducationContent;
