import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';

export type ChipState = 'idle' | 'recording' | 'recorded' | 'playing' | 'done';

interface Props {
  label: string;
  state: ChipState;
  onTap: () => void;
  onPlay?: () => void;
  onGood?: () => void;
  onRetry?: () => void;
  playProgress?: number;
}

const RecordingChip: React.FC<Props> = ({
  label, state, onTap, onPlay, onGood, onRetry, playProgress = 0,
}) => {
  const borderColor = state === 'recording' ? colors.error
    : state === 'recorded' || state === 'playing' ? colors.success
    : state === 'done' ? colors.success
    : colors.border;

  return (
    <View style={[styles.chip, { borderColor }]}>
      <Pressable style={styles.chipInner} onPress={onTap}>
        <Text style={[
          styles.chipLabel,
          state === 'done' && styles.chipLabelDone,
        ]}>
          {label}
        </Text>

        {state === 'idle' && <Text style={styles.micIcon}>🎙</Text>}
        {state === 'recording' && <WaveformAnimation />}
        {state === 'recorded' && onPlay && (
          <Pressable onPress={onPlay} style={styles.playBtn}>
            <Text style={styles.playText}>▶</Text>
          </Pressable>
        )}
        {state === 'playing' && (
          <View style={styles.progressWrap}>
            <View style={[styles.progressBar, { width: `${playProgress * 100}%` }]} />
          </View>
        )}
        {state === 'done' && <Text style={styles.doneCheck}>✓</Text>}
      </Pressable>

      {(state === 'recorded' || state === 'playing') && (
        <View style={styles.actionRow}>
          <Pressable onPress={onGood} style={styles.goodBtn}>
            <Text style={styles.goodText}>✓ Good</Text>
          </Pressable>
          <Pressable onPress={onRetry} style={styles.retryBtn}>
            <Text style={styles.retryText}>↺ Retry</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const WaveformAnimation: React.FC = () => {
  const bars = [
    useSharedValue(8),
    useSharedValue(8),
    useSharedValue(8),
    useSharedValue(8),
    useSharedValue(8),
  ];

  useEffect(() => {
    bars.forEach((bar, i) => {
      bar.value = withRepeat(
        withSequence(
          withTiming(18 + i * 2, { duration: 200 + i * 50 }),
          withTiming(6, { duration: 200 + i * 50 }),
        ),
        -1, true,
      );
    });
  }, []);

  return (
    <View style={styles.waveRow}>
      {bars.map((bar, i) => {
        const style = useAnimatedStyle(() => ({
          height: bar.value,
        }));
        return <Animated.View key={i} style={[styles.waveBar, style]} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderRadius: radii.md,
    backgroundColor: colors.primary10,
    marginBottom: spacingY.xs,
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX.sm,
    paddingVertical: 10,
  },
  chipLabel: {
    flex: 1,
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  chipLabelDone: {
    color: colors.textDisabled,
    textDecorationLine: 'line-through',
  },
  micIcon: {
    fontSize: 16,
    color: colors.textMuted,
  },
  playBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: FONTS.primaryBold,
  },
  progressWrap: {
    width: 60,
    height: 4,
    backgroundColor: colors.primary10,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
  doneCheck: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.success,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacingX.sm,
    paddingBottom: 8,
  },
  goodBtn: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.sm,
  },
  goodText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.success,
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retryText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 24,
  },
  waveBar: {
    width: 3,
    backgroundColor: colors.error,
    borderRadius: 1.5,
  },
});

export default RecordingChip;
