import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, spacingX } from "../../theme/Theme";

interface AnimatedDotProps {
  isActive: boolean;
}

const AnimatedDot: React.FC<AnimatedDotProps> = ({ isActive }) => {
  const width = useSharedValue(isActive ? 10 : 8);
  const opacity = useSharedValue(isActive ? 1 : 0.5);

  React.useEffect(() => {
    width.value = withSpring(isActive ? 10 : 8, {
      damping: 20,
      stiffness: 200,
    });
    opacity.value = withSpring(isActive ? 1 : 0.5, {
      damping: 20,
      stiffness: 200,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: 8,
    borderRadius: 4,
    opacity: opacity.value,
    backgroundColor: isActive ? colors.secondary : colors.primary10,
  }));

  return <Animated.View style={animatedStyle} />;
};

export default AnimatedDot;
