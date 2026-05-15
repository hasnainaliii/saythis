import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_W } = Dimensions.get('window');
const SPRING_CFG = { damping: 18, stiffness: 200 };

interface StepTransitionProps {
  children: React.ReactNode;
  direction: 'forward' | 'backward' | 'idle';
}

const StepTransition: React.FC<StepTransitionProps> = ({ children, direction }) => {
  const animStyle = useAnimatedStyle(() => {
    const toX = direction === 'idle'
      ? 0
      : direction === 'forward'
        ? SCREEN_W
        : -SCREEN_W;

    return {
      transform: [{ translateX: withSpring(0, SPRING_CFG) }],
    };
  });

  return (
    <Animated.View style={[styles.wrapper, animStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
});

export default StepTransition;
