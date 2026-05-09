import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}

export function TrackerCard({ icon, title, subtitle, right }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: spacingY.md,
    paddingHorizontal: spacingX.lg,
    marginBottom: spacingY.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacingX.md,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  right: {
    marginLeft: spacingX.sm,
  },
});
