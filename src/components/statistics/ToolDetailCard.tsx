import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface ToolDetailCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  title: string;
  rows: { label: string; value: string | number }[];
  highlight?: { label: string; value: string | number };
}

export const ToolDetailCard: React.FC<ToolDetailCardProps> = ({ icon, accentColor, title, rows, highlight }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={[styles.iconWrap, { backgroundColor: accentColor + "1A" }]}>
        <Ionicons name={icon} size={20} color={accentColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
    {highlight && (
      <View style={[styles.highlightRow, { backgroundColor: accentColor + "0D" }]}>
        <Text style={styles.highlightLabel}>{highlight.label}</Text>
        <Text style={[styles.highlightValue, { color: accentColor }]}>{highlight.value}</Text>
      </View>
    )}
    {rows.map((row) => (
      <View key={row.label} style={styles.dataRow}>
        <Text style={styles.dataLabel}>{row.label}</Text>
        <Text style={styles.dataValue}>{row.value}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.libraryCard,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    marginHorizontal: spacingX.md,
    marginBottom: spacingY.md,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacingX.md,
    gap: spacingX.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xs,
  },
  highlightLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  highlightValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xs,
    borderTopWidth: 1,
    borderTopColor: colors.libraryBorder,
  },
  dataLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  dataValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
});
