import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';

interface MuscleGroup {
  step: number;
  muscle_group: string;
  instruction: string;
  speech_critical?: boolean;
  note?: string;
}

interface Props {
  sequence: MuscleGroup[];
  onSelect: (group: MuscleGroup) => void;
}

const BodyZoneList: React.FC<Props> = ({ sequence, onSelect }) => {
  const speechZones = sequence.filter(s => s.speech_critical);
  const otherZones = sequence.filter(s => !s.speech_critical);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>🎙 Speech-Critical Zones</Text>
      <View style={styles.grid}>
        {speechZones.map(zone => (
          <ZoneChip key={zone.step} zone={zone} onPress={() => onSelect(zone)} />
        ))}
      </View>

      <Text style={[styles.sectionLabel, { marginTop: spacingY.sm }]}>Other Muscle Groups</Text>
      <View style={styles.grid}>
        {otherZones.map(zone => (
          <ZoneChip key={zone.step} zone={zone} onPress={() => onSelect(zone)} />
        ))}
      </View>
    </View>
  );
};

const ZoneChip: React.FC<{ zone: MuscleGroup; onPress: () => void }> = ({ zone, onPress }) => {
  const scale = useSharedValue(1);
  const bg = zone.speech_critical ? colors.secondary_10 : colors.primary10;

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <Pressable
        style={[styles.chip, { backgroundColor: bg }]}
        onPressIn={() => { scale.value = withTiming(0.95, { duration: 100 }); }}
        onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
        onPress={onPress}
      >
        {zone.speech_critical && <Text style={styles.micBadge}>🎙</Text>}
        <Text style={styles.chipText}>{zone.muscle_group}</Text>
      </Pressable>
    </Animated.View>
  );
};

interface TooltipProps {
  group: MuscleGroup | null;
  onClose: () => void;
  onStartTimer: () => void;
}

export const ZoneTooltip: React.FC<TooltipProps> = ({ group, onClose, onStartTimer }) => {
  const translateY = useSharedValue(300);

  React.useEffect(() => {
    translateY.value = withTiming(group ? 0 : 300, { duration: 250 });
  }, [group]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!group) return null;

  return (
    <Animated.View style={[styles.tooltip, style]}>
      <View style={styles.tooltipHeader}>
        <View>
          <Text style={styles.tooltipTitle}>{group.muscle_group}</Text>
          {group.speech_critical && (
            <Text style={styles.speechBadge}>🎙 Speech Critical</Text>
          )}
        </View>
        <Pressable onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
      <Text style={styles.tooltipInstruction}>{group.instruction}</Text>
      {group.note && <Text style={styles.tooltipNote}>{group.note}</Text>}
      <Pressable style={styles.timerBtn} onPress={onStartTimer}>
        <Text style={styles.timerBtnText}>Start Timer</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacingY.md },
  sectionLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.md,
  },
  micBadge: { fontSize: 12 },
  chipText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  tooltip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacingX.lg,
    paddingBottom: 40,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacingY.xs,
  },
  tooltipTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
  speechBadge: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.secondary,
    marginTop: 2,
  },
  closeText: {
    fontSize: 20,
    color: colors.textMuted,
    padding: 4,
  },
  tooltipInstruction: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: spacingY.xs,
  },
  tooltipNote: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: spacingY.sm,
  },
  timerBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radii.xl,
    paddingVertical: 12,
    alignItems: 'center',
  },
  timerBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});

export default BodyZoneList;
