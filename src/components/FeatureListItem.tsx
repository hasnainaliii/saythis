import { Check } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    colors,
    dynamicSpacingY,
    FONTS,
    fontSizes,
    spacingX,
    spacingY,
} from "../theme/Theme";

interface FeatureListItemProps {
  text: string;
}

const iconBoxSize = dynamicSpacingY(3.6);

export const FeatureListItem: React.FC<FeatureListItemProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Check size={fontSizes.small} color={colors.secondary} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    paddingVertical: spacingY.xs,
  },
  iconContainer: {
    width: iconBoxSize,
    height: iconBoxSize,
    borderRadius: iconBoxSize / 2,
    backgroundColor: colors.primary_10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
});
