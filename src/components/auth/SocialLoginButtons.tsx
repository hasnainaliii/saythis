import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { colors, spacingX } from "../../theme/Theme";

interface SocialLoginButtonsProps {
  onPress: (provider: "facebook" | "google" | "instagram") => void;
  containerStyle?: ViewStyle;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onPress,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable
        style={styles.button}
        onPress={() => onPress("facebook")}
      >
        <Ionicons name="logo-facebook" size={24} color={colors.black} />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => onPress("google")}
      >
        <Ionicons name="logo-google" size={24} color={colors.black} />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => onPress("instagram")}
      >
        <Ionicons name="logo-instagram" size={24} color={colors.black} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacingX.md,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary10,
  },
});

export default SocialLoginButtons;
