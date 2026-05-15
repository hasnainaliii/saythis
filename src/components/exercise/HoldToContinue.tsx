import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes } from '../../theme/Theme';

const HOLD_DURATION = 1000;

interface HoldToContinueProps {
  onComplete: () => void;
  accent?: string;
  style?: ViewStyle;
}

export function HoldToContinue({ onComplete, accent = colors.secondary, style }: HoldToContinueProps) {
  const progress = useSharedValue(0);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    progress.value = withTiming(
      1,
      { duration: HOLD_DURATION, easing: Easing.linear },
      (finished) => {
        if (finished) {
          runOnJS(Haptics.notificationAsync)(
            Haptics.NotificationFeedbackType.Success,
          );
          runOnJS(onComplete)();
        }
      },
    );
  };

  const handlePressOut = () => {
    if (progress.value < 1) {
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 300 });
    }
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 0.4],
      [colors.textDark, '#FFFFFF'],
    ),
  }));

  return (
    <View style={[styles.holdBtnWrap, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.holdBtnContainer}
      >
        <Animated.View style={[styles.holdBtnFill, { backgroundColor: accent }, fillStyle]} />
        <Animated.Text style={[styles.holdBtnText, textStyle]}>Hold to Continue</Animated.Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  holdBtnWrap: {
    width: '100%',
    marginVertical: 24, // spacingY.lg/xl roughly
  },
  holdBtnContainer: {
    width: '100%',
    backgroundColor: '#F2F5F3',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE5DF',
    overflow: 'hidden',
  },
  holdBtnFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  holdBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    letterSpacing: 0.5,
  },
});
