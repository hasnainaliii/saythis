import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Mic, Square } from 'lucide-react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';

interface Props {
  isRecording: boolean;
  isConnecting: boolean;
  statusText: string;
  pulseOpacity: SharedValue<number>;
  timeLeft: number;
  onStart: () => void;
  onStop: () => void;
}

export function StutterControls({ isRecording, isConnecting, statusText, pulseOpacity, timeLeft, onStart, onStop }: Props) {
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));
  const formattedTime = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{statusText}</Text>

      {isRecording && (
        <Animated.View style={[styles.badge, pulseStyle]}>
          <View style={styles.dot} />
          <Text style={styles.badgeText}>Recording • {formattedTime}</Text>
        </Animated.View>
      )}

      <Pressable
        style={[styles.btn, isRecording && styles.btnStop, isConnecting && styles.btnConnecting]}
        onPress={isRecording ? onStop : onStart}
        disabled={isConnecting}
      >
        {isRecording ? (
          <>
            <Square size={22} color={colors.white} />
            <Text style={styles.btnText}>Stop & Score</Text>
          </>
        ) : (
          <>
            <Mic size={22} color={colors.white} />
            <Text style={styles.btnText}>{isConnecting ? 'Connecting…' : 'Start Recording'}</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  status: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacingY.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.recording + '15',
    borderRadius: radii.pill,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xxs,
    marginBottom: spacingY.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.recording,
  },
  badgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.recording,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.secondary,
    borderRadius: radii.pill,
    paddingVertical: spacingY.sm,
    paddingHorizontal: spacingX.xxl,
    width: '100%',
    marginBottom: spacingY.md,
  },
  btnStop: { backgroundColor: colors.recording },
  btnConnecting: { backgroundColor: colors.textMuted },
  btnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});
