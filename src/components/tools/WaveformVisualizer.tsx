import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors, radii } from '../../theme/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface WaveformVisualizerProps {
  isActive: boolean;
  amplitude?: number; // 0.0 to 1.0
  barCount?: number;
  color?: string;
}

const Bar = ({ index, isActive, amplitude, color }: { index: number, isActive: boolean, amplitude: number, color: string }) => {
  const time = useSharedValue(0);
  const activePhase = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      activePhase.value = withTiming(1, { duration: 300 });
      time.value = withRepeat(
        withTiming(Math.PI * 2, { duration: 1000 / 6, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      activePhase.value = withTiming(0, { duration: 300 });
      time.value = 0;
    }
  }, [isActive]);

  // Pre-calculate heights on the JS thread so we don't call non-worklets in the UI thread
  const hp05 = hp('0.5%');
  const hp08 = hp('0.8%');
  const hp15 = hp('1.5%');
  const hp40 = hp('4%');

  const style = useAnimatedStyle(() => {
    const phaseOffset = index * 0.4;
    const sinValue = Math.sin(time.value + phaseOffset);
    const baseActiveHeight = hp08 + amplitude * hp40;
    const dynamicHeight = baseActiveHeight + sinValue * hp15 * amplitude;
    
    const height = interpolate(
      activePhase.value,
      [0, 1],
      [hp05, Math.max(hp05, dynamicHeight)]
    );

    return {
      height,
      backgroundColor: activePhase.value > 0.5 ? color : colors.libraryBorder,
    };
  });

  return <Animated.View style={[styles.bar, style]} />;
};

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isActive,
  amplitude = 0,
  barCount = 28,
  color = colors.secondary,
}) => {
  const bars = Array.from({ length: barCount }).map((_, i) => i);

  return (
    <View style={styles.container}>
      {bars.map((i) => (
        <Bar key={i} index={i} isActive={isActive} amplitude={amplitude} color={color} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('0.5%'),
    height: hp('8%'),
  },
  bar: {
    width: wp('0.8%'),
    borderRadius: radii.pill,
  },
});
