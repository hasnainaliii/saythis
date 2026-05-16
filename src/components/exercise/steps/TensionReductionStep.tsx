import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Exercise } from '../../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';
import { HoldToContinue } from '../HoldToContinue';
import BodyZoneList, { ZoneTooltip } from '../chapter2/BodyZoneList';
import GuidedPMRSession from '../chapter2/GuidedPMRSession';

interface Props {
  exercise: Exercise;
  onContinue: () => void;
}

const TensionReductionStep: React.FC<Props> = ({ exercise, onContinue }) => {
  const content = exercise.content as any;
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [sessionMode, setSessionMode] = useState<'none' | 'full' | 'quick'>('none');
  const [subStep, setSubStep] = useState(0);

  if (sessionMode !== 'none') {
    const seq = sessionMode === 'full'
      ? content.full_body_sequence
      : content.speech_focused_mini_pmr.steps;

    return (
      <View style={styles.page}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <GuidedPMRSession
            sequence={seq}
            onComplete={() => setSessionMode('none')}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Section A — Why PMR Helps */}
        <WhyPMRCard text={content.why_pmr_helps} research={content.research} />

        {/* Section B — Body Zone Map */}
        <Text style={styles.sectionTitle}>Muscle Groups</Text>
        <BodyZoneList
          sequence={content.full_body_sequence}
          onSelect={setSelectedZone}
        />

        {/* Section C — Session Buttons */}
        <View style={styles.sessionBtns}>
          <Pressable
            style={styles.fullBtn}
            onPress={() => setSessionMode('full')}
          >
            <Ionicons name="body-outline" size={18} color={colors.white} />
            <Text style={styles.fullBtnText}>Start Full Session</Text>
          </Pressable>
          <Pressable
            style={styles.quickBtn}
            onPress={() => setSessionMode('quick')}
          >
            <Ionicons name="mic-outline" size={18} color={colors.secondary} />
            <Text style={styles.quickBtnText}>Quick Speech PMR (5 min)</Text>
          </Pressable>
        </View>

        <HoldToContinue onComplete={onContinue} accent={colors.categorySelfAwareness} />
      </ScrollView>

      {/* Zone tooltip overlay */}
      <ZoneTooltip
        group={selectedZone}
        onClose={() => setSelectedZone(null)}
        onStartTimer={() => {
          setSelectedZone(null);
          setSessionMode('full');
        }}
      />
    </View>
  );
};

const WhyPMRCard: React.FC<{ text: string; research: string }> = ({ text, research }) => {
  const [open, setOpen] = useState(false);
  const height = useSharedValue(0);

  const toggle = () => {
    setOpen(!open);
    height.value = withSpring(open ? 0 : 1, { damping: 18, stiffness: 120 });
  };

  const bodyStyle = useAnimatedStyle(() => ({
    maxHeight: height.value * 250,
    opacity: height.value,
    overflow: 'hidden' as const,
  }));

  return (
    <Pressable onPress={toggle} style={styles.whyCard}>
      <View style={styles.whyHeader}>
        <View style={styles.whyIconRow}>
          <Ionicons name="body-outline" size={18} color={colors.categorySelfAwareness} />
          <Text style={styles.whyTitle}>Why PMR Helps</Text>
        </View>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textMuted}
        />
      </View>
      <Animated.View style={bodyStyle}>
        <Text style={styles.whyText}>{text}</Text>
        {research && <Text style={styles.researchText}>{research}</Text>}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacingX.lg, paddingBottom: 100 },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  sessionBtns: { gap: 10, marginBottom: spacingY.md },
  fullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: radii.xl,
  },
  fullBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: radii.xl,
  },
  quickBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.secondary,
  },
  whyCard: {
    backgroundColor: colors.primary10,
    borderRadius: radii.lg,
    padding: spacingX.md,
    marginBottom: spacingY.md,
  },
  whyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  whyIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  whyTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  whyText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    lineHeight: 22,
    marginTop: spacingY.sm,
  },
  researchText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacingY.xs,
  },
});

export default TensionReductionStep;
