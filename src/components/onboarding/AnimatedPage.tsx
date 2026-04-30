import React from "react";
import { Dimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface AnimatedPageProps {
  index: number;
  scrollX: { value: number };
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({
  index,
  scrollX,
  children,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], "clamp");
    const scale = interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], "clamp");
    const translateX = interpolate(scrollX.value, inputRange, [-30, 0, 30], "clamp");

    return {
      opacity,
      transform: [{ scale }, { translateX }],
    };
  });

  return (
    <Animated.View style={[{ flex: 1, width: SCREEN_WIDTH }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedPage;
