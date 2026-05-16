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
import BreathingCircle from '../chapter2/BreathingCircle';
import TechniqueStepper from '../chapter2/TechniqueStepper';
import { SingleOpenAccordion } from '../chapter2/Accordion';

interface Props {
  exercise: Exercise;
  onContinue: () => void;
}

const BreathingTechniqueStep: React.FC<Props> = ({ exercise, onContinue }) => {
  const content = exercise.content as any;

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Section A — Why It Matters */}
        <WhyItMattersCard
          text={content.why_it_matters}
          research={content.research}
        />

        {/* Section B — Breathing Circle */}
        <BreathingCircle />

        {/* Section C — Technique Steps */}
        {content.technique_steps && (
          <TechniqueStepper steps={content.technique_steps} />
        )}

        {/* Section D — Troubleshooting */}
        {content.troubleshooting && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Troubleshooting</Text>
            <SingleOpenAccordion
              items={content.troubleshooting.map((t: any) => ({
                title: t.problem,
                content: t.solution,
                titleColor: colors.error,
              }))}
            />
          </View>
        )}

        <HoldToContinue onComplete={onContinue} accent={colors.categoryEducation} />
      </ScrollView>
    </View>
  );
};

const WhyItMattersCard: React.FC<{ text: string; research: string }> = ({ text, research }) => {
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
          <Ionicons name="leaf-outline" size={18} color={colors.categoryEducation} />
          <Text style={styles.whyTitle}>Why This Matters</Text>
        </View>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textMuted}
        />
      </View>
      <Animated.View style={bodyStyle}>
        <Text style={styles.whyText}>{text}</Text>
        {research && (
          <Text style={styles.researchText}>{research}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: spacingX.lg,
    paddingBottom: 100,
  },
  section: { marginBottom: spacingY.md },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.xs,
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
  whyIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
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

export default BreathingTechniqueStep;
