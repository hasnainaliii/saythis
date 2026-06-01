import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';

interface Props {
  isRecording: boolean;
  finalizedLines: string[];
  partialText: string;
  pulseOpacity: SharedValue<number>;
}

export function TranscriptBox({ isRecording, finalizedLines, partialText, pulseOpacity }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [partialText, finalizedLines]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>LIVE TRANSCRIPT</Text>
        {isRecording && (
          <Animated.View style={[styles.liveBadge, pulseStyle]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </Animated.View>
        )}
      </View>
      <ScrollView ref={scrollRef} style={styles.scroll} nestedScrollEnabled showsVerticalScrollIndicator>
        {finalizedLines.length === 0 && !partialText ? (
          <Text style={styles.placeholder}>
            {isRecording ? 'Listening for speech…' : 'Your speech will appear here in real time'}
          </Text>
        ) : (
          <>
            {finalizedLines.map((line, i) => (
              <Text key={i} style={styles.final}>{line}</Text>
            ))}
            {partialText !== '' && <Text style={styles.partial}>{partialText}</Text>}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacingX.md,
    marginBottom: spacingY.md,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    minHeight: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY.sm,
  },
  label: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.recording + '20',
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.recording,
  },
  liveText: {
    fontFamily: FONTS.primaryBold,
    fontSize: 10,
    color: colors.recording,
    letterSpacing: 1,
  },
  scroll: { maxHeight: 180 },
  placeholder: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacingY.xl,
  },
  final: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 24,
    marginBottom: 6,
  },
  partial: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
