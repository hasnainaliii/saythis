import { Play } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import {
    colors,
    FONTS,
    fontSizes,
    radii,
    spacingX,
    spacingY,
} from "../../theme/Theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface QuickStartFabProps {
  onPress: () => void;
  style?: ViewStyle;
}

const QuickStartFab: React.FC<QuickStartFabProps> = ({ onPress, style }) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(pressed.value ? 0.96 : 1, {
          damping: 14,
          stiffness: 140,
        }),
      },
    ],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      style={[styles.container, animatedStyle, style]}
    >
      <Animated.View style={styles.pill}>
        <Play size={18} color={colors.white} />
        <Text style={styles.text}>Quick Start</Text>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: spacingX.lg,
    bottom: spacingY.xl,
    borderRadius: radii.pill,
    overflow: "hidden",
  },
  pill: {
    backgroundColor: colors.libraryAccent,
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.sm,
    borderRadius: radii.pill,
  },
  text: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
});

export default QuickStartFab;
