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
}

const iconSize = fontSizes.large;
const iconBoxSize = dynamicSpacingY(4.2);

export const BackButton: React.FC<BackButtonProps> = ({
  label,
  onPress,
  style,
  textStyle,
}) => {
  const router = useRouter();
  const showLabel = !!label?.trim();

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
      style={({ pressed }) => [styles.container, pressed && styles.pressed, style]}
      hitSlop={spacingX.md}
    >
      <View style={styles.iconContainer}>
        <ChevronLeft size={iconSize} color={colors.black} />
      </View>
      {showLabel && <Text style={[styles.label, textStyle]}>{label}</Text>}
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.black,
  },
});
