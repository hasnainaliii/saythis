import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputProps,
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

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  containerStyle,
  isPassword = false,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isSecure = isPassword && !showPassword;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#FF4444" : colors.secondary}
            style={styles.icon}
          />
        )}
        <RNTextInput
          style={styles.input}
          placeholderTextColor={colors.black_text}
          secureTextEntry={isSecure}
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.black_text}
            />
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacingY.xs,
  },
  label: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.black,
    marginLeft: spacingX.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary10,
    paddingHorizontal: spacingX.md,
    height: dynamicSpacingY(6.5),
  },
  inputError: {
    borderColor: "#FF4444",
  },
  icon: {
    marginRight: spacingX.sm,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black,
    paddingVertical: 0,
  },
  errorText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: "#FF4444",
    marginLeft: spacingX.xs,
  },
});
