import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface ToolMiniCardItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number | string;
  color: string;
}

interface ToolBreakdownGridProps {
  items: ToolMiniCardItem[];
}

export const ToolBreakdownGrid: React.FC<ToolBreakdownGridProps> = ({ items }) => (
  <View style={styles.grid}>
    {items.map((item) => (
      <View key={item.label} style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: item.color + "1A" }]}>
          <Ionicons name={item.icon} size={18} color={item.color} />
        </View>
        <Text style={[styles.value, { color: item.color }]}>{item.value}</Text>
        <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacingX.sm,
    paddingHorizontal: spacingX.md,
    marginBottom: spacingY.md,
  },
  card: {
    flex: 1,
    minWidth: 90,
    backgroundColor: colors.libraryCard,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    paddingVertical: spacingY.sm,
    alignItems: "center",
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY.xxs,
  },
  value: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
  },
  label: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },
});
