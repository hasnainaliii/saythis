import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, radii, spacingX, spacingY } from '../../theme/Theme';

interface StepProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ totalSteps, currentStep }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <Pill key={i} index={i} currentStep={currentStep} />
      ))}
    </View>
  );
};

const Pill: React.FC<{ index: number; currentStep: number }> = ({ index, currentStep }) => {
  const isCompleted = index < currentStep;
  const isCurrent = index === currentStep;

  const widthStyle = useAnimatedStyle(() => ({
    flex: withTiming(isCurrent ? 1.5 : 1, { duration: 300 }),
    opacity: withTiming(isCompleted || isCurrent ? 1 : 0.4, { duration: 300 }),
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    if (!isCurrent) return { opacity: 1 };
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    };
  });

  const bg = isCompleted || isCurrent ? colors.secondary : colors.primary10;

  return (
    <Animated.View
      style={[
        styles.pill,
        { backgroundColor: bg },
        widthStyle,
        isCurrent && shimmerStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.xs,
  },
  pill: {
    height: hp('0.6%'),
    borderRadius: radii.pill,
  },
});

export default StepProgressBar;
