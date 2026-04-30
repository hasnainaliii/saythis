import { ChevronRight, LucideIcon } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../theme/Theme";

interface ProfileMenuItemProps {
  icon: LucideIcon;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
}

export const ProfileMenuItem = ({
  icon: Icon,
  title,
  onPress,
  showChevron = true,
}: ProfileMenuItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={colors.secondary} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {showChevron && <ChevronRight size={20} color={colors.primary20} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacingY.sm,
    paddingHorizontal: spacingX.md,
    backgroundColor: colors.white,
    marginBottom: spacingY.xs,
    borderRadius: 16,
    height: 60,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary_10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black,
  },
});
