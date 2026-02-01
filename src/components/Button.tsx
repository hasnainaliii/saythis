import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../theme/Theme";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  icon,
  iconPosition = "right",
  style,
  textStyle,
  fullWidth = false,
  ...rest
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      gap: spacingX.sm,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: spacingY.xs,
        paddingHorizontal: spacingX.lg,
      },
      medium: {
        paddingVertical: spacingY.sm,
        paddingHorizontal: spacingX.xl,
      },
      large: {
        paddingVertical: spacingY.md,
        paddingHorizontal: spacingX.xxl,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: colors.secondary,
      },
      secondary: {
        backgroundColor: colors.primary10,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: colors.secondary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: "100%" }),
      ...(disabled && { opacity: 0.6 }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeTextStyles: Record<string, TextStyle> = {
      small: { fontSize: fontSizes.small },
      medium: { fontSize: fontSizes.medium },
      large: { fontSize: fontSizes.large },
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: colors.white },
      secondary: { color: colors.black },
      outline: { color: colors.secondary },
    };

    return {
      fontFamily: FONTS.primaryBold,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        getButtonStyle(),
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.white : colors.secondary}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export default Button;
