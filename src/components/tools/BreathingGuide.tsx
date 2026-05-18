import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors, FONTS, fontSizes } from '../../theme/Theme';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface BreathingGuideProps {
  phase: "inhale" | "hold" | "exhale" | "rest" | null;
  progress: number; // 0.0 to 1.0 within current phase
  onCycleComplete?: () => void;
  inhaleDuration?: number;
  holdDuration?: number;
  exhaleDuration?: number;
  restDuration?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const BreathingGuide: React.FC<BreathingGuideProps> = ({
  phase,
  progress,
  onCycleComplete,
  inhaleDuration = 4000,
  holdDuration = 7000,
  exhaleDuration = 8000,
  restDuration = 2000,
}) => {
  const scale = useSharedValue(0.7);

  useEffect(() => {
    if (phase === 'inhale') {
      scale.value = withTiming(1.0, { duration: inhaleDuration, easing: Easing.linear });
    } else if (phase === 'exhale') {
      scale.value = withTiming(0.7, { duration: exhaleDuration, easing: Easing.linear });
    } else if (phase === 'hold') {
      scale.value = 1.0;
    } else if (phase === 'rest') {
      scale.value = 0.7;
    }
  }, [phase, inhaleDuration, exhaleDuration]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getColor = () => {
    switch (phase) {
      case 'inhale': return colors.categoryEducation;
      case 'hold': return colors.warning;
      case 'exhale': return colors.categorySelfAwareness;
      case 'rest': return colors.libraryBorder;
      default: return colors.libraryBorder;
    }
  };

  const getLabel = () => {
    if (!phase) return "READY";
    return phase.toUpperCase();
  };

  const getRemainingTime = () => {
    if (!phase) return 0;
    const duration = {
      inhale: inhaleDuration,
      hold: holdDuration,
      exhale: exhaleDuration,
      rest: restDuration,
    }[phase];
    const remaining = Math.max(0, duration * (1 - progress));
    return (remaining / 1000).toFixed(1);
  };

  const circumference = 2 * Math.PI * (wp('20%'));
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.outerRing, ringStyle, { backgroundColor: getColor() }]} />
        <View style={styles.innerCircle}>
          <Text style={styles.label}>{getLabel()}</Text>
        </View>
        <Svg width={wp('45%')} height={wp('45%')} style={styles.svg}>
          <Circle
            cx={wp('22.5%')}
            cy={wp('22.5%')}
            r={wp('20%')}
            stroke={colors.white}
            strokeWidth={4}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${wp('22.5%')} ${wp('22.5%')})`}
          />
        </Svg>
      </View>
      <Text style={styles.countdown}>{getRemainingTime()}s remaining</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  circleContainer: {
    width: wp('45%'),
    height: wp('45%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  outerRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: wp('22.5%'),
    opacity: 0.2,
  },
  innerCircle: {
    position: 'absolute',
    width: wp('35%'),
    height: wp('35%'),
    borderRadius: wp('17.5%'),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  svg: {
    position: 'absolute',
  },
  label: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
  countdown: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
});
