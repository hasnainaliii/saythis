import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {
  colors,
  dynamicSpacingY,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../theme/Theme";

interface BackButtonProps {
  label?: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "light" | "dark";
}

const iconSize = fontSizes.large;
const iconBoxSize = dynamicSpacingY(4.2);

export const BackButton: React.FC<BackButtonProps> = ({
  label,
  onPress,
  style,
  textStyle,
  variant = "light",
}) => {
  const router = useRouter();
  const showLabel = !!label?.trim();

  const isDark = variant === "dark";
  const iconColor = isDark ? colors.libraryText : colors.black;
  const iconBg = isDark ? colors.libraryCard : colors.white;
  const iconBorder = isDark ? colors.libraryBorder : colors.primary10;
  const labelColor = isDark ? colors.libraryText : colors.black;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.back();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
      hitSlop={spacingX.md}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconBg, borderColor: iconBorder },
        ]}
      >
        <ChevronLeft size={iconSize} color={iconColor} />
      </View>
      {showLabel ? (
        <Text style={[styles.label, { color: labelColor }, textStyle]}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xs,
    paddingVertical: spacingY.xs,
    paddingHorizontal: spacingX.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: iconBoxSize,
    height: iconBoxSize,
    borderRadius: iconBoxSize / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
  },
});
