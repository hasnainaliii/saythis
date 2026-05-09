import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";

interface SelfAwarenessContentProps {
  content: Record<string, unknown>;
}

const SECTION_COLORS: Record<string, string> = {
  "Core Stuttering Behaviors": "#4A90D9",
  "Physical Tension": "#FF8C42",
  "Emotional Reactions": "#7B68EE",
};

const SECTION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Core Stuttering Behaviors": "pulse-outline",
  "Physical Tension": "body-outline",
  "Emotional Reactions": "heart-outline",
};

const SelfAwarenessContent: React.FC<SelfAwarenessContentProps> = ({
  content,
}) => {
  const observations = content.what_to_observe as
    | Array<{ category: string; items: string[] }>
    | undefined;

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {!!content.why_awareness && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: "#7B68EE15" }]}>
              <Ionicons name="eye-outline" size={18} color="#7B68EE" />
            </View>
            <Text style={styles.cardTitle}>Why Awareness?</Text>
          </View>
          <Text style={styles.cardBody}>
            {String(content.why_awareness)}
          </Text>
        </View>
      )}

      {observations && observations.map((section, index) => {
        const sectionColor = SECTION_COLORS[section.category] || colors.secondary;
        const sectionIcon = SECTION_ICONS[section.category] || "ellipse-outline";
        return (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: sectionColor + "15" }]}>
                <Ionicons name={sectionIcon} size={18} color={sectionColor} />
              </View>
              <Text style={styles.cardTitle}>{section.category}</Text>
            </View>
            {section.items.map((item, i) => (
              <View key={i} style={styles.checkItem}>
                <View style={[styles.checkbox, { borderColor: sectionColor }]}>
                  <View style={[styles.checkboxInner, { backgroundColor: sectionColor + "20" }]} />
                </View>
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>
        );
      })}
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
  checkItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX.sm,
    marginBottom: spacingY.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  checkText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
    lineHeight: 20,
  },
});

export default SelfAwarenessContent;
