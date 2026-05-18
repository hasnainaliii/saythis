import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    interpolateColor,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, radii } from '../../theme/Theme';

interface HoldToContinueButtonProps {
  onComplete: () => void;
  label?: string;
  sublabel?: string;
  holdDurationMs?: number;
  disabled?: boolean;
  accentColor?: string;
}

export const HoldToContinueButton: React.FC<HoldToContinueButtonProps> = ({
  onComplete,
  label = "Hold to Continue",
  sublabel,
  holdDurationMs = 1000,
  disabled = false,
  accentColor = colors.secondary,
}) => {
  const progress = useSharedValue(0);
  const triggered = useSharedValue(false);

  const triggerComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  useAnimatedReaction(
    () => progress.value,
    (current) => {
      if (current >= 0.99 && !triggered.value) {
        triggered.value = true;
        runOnJS(triggerComplete)();
      }
    }
  );

  const handlePressIn = () => {
    if (disabled) return;
    triggered.value = false;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    progress.value = withTiming(1, { duration: holdDurationMs, easing: Easing.linear });
  };

  const handlePressOut = () => {
    if (disabled) return;
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
      [disabled ? colors.textDisabled : colors.textDark, colors.white]
    ),
  }));

  const subtextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 0.4],
      [disabled ? colors.textDisabled : colors.textMuted, colors.white]
    ),
  }));

  return (
    <View style={[styles.container, disabled && styles.disabledContainer]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <Animated.View style={[styles.fill, { backgroundColor: accentColor }, fillStyle]} />
        <View style={styles.content}>
          <Animated.Text style={[styles.label, textStyle]}>{label}</Animated.Text>
          {sublabel && (
            <Animated.Text style={[styles.sublabel, subtextStyle]}>{sublabel}</Animated.Text>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.librarySurface,
    borderRadius: radii.xl,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    overflow: 'hidden',
  },
  disabledContainer: {
    opacity: 0.5,
  },
  pressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    letterSpacing: 0.5,
  },
  sublabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    marginTop: 2,
  },
});
