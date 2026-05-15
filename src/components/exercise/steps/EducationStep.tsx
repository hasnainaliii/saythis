import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  cancelAnimation,
  Easing,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import { Exercise } from '../../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';
import EducationQuiz from './EducationQuiz';

const HOLD_DURATION = 1000;

function HoldToContinue({ onComplete }: { onComplete: () => void }) {
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
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.holdBtnContainer}
    >
      <Animated.View style={[styles.holdBtnFill, fillStyle]} />
      <Animated.Text style={[styles.holdBtnText, textStyle]}>Hold to Continue</Animated.Text>
    </Pressable>
  );
}

interface EducationStepProps {
  exercise: Exercise;
  onContinue: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  Repetitions: colors.categoryEducation,
  Prolongations: colors.categorySelfAwareness,
  Blocks: colors.categorySelfAdvocacy,
};

const EducationStep: React.FC<EducationStepProps> = ({ exercise, onContinue }) => {
  const content = exercise.content;
  const types = content.types_of_stuttering as
    | { type: string; description: string; examples: string[] }[]
    | undefined;
  const stats = content.statistics as Record<string, string> | undefined;
  const famous = content.famous_people_who_stutter as string[] | undefined;

  // internal sub-steps: 0=definition, 1=types, 2=quiz
  const [subStep, setSubStep] = useState(0);

  const [transitionDir, setTransitionDir] = useState(1);

  const fadeOpacity = useSharedValue(1);
  const fadeX = useSharedValue(0);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    transform: [{ translateX: fadeX.value }],
    flex: 1,
  }));

  const goToSubStep = (next: number) => {
    const dir = next > subStep ? 1 : -1;
    setTransitionDir(dir);
    fadeOpacity.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) });
    fadeX.value = withTiming(dir * -20, { duration: 150 }, (finished) => {
      if (finished) {
        runOnJS(setSubStep)(next);
      }
    });
  };

  useEffect(() => {
    fadeX.value = transitionDir * 20;
    fadeOpacity.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) });
    fadeX.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) });
  }, [subStep, transitionDir]);

  if (subStep === 2 && types) {
    return (
      <Animated.View style={fadeStyle}>
        <EducationQuiz types={types} onComplete={onContinue} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={fadeStyle}>
      {subStep === 0 && (
        <DefinitionPage
          definition={String(content.what_is_stuttering || '')}
          stats={stats}
          famous={famous}
          onContinue={() => goToSubStep(1)}
        />
      )}
      {subStep === 1 && types && (
        <TypesPage types={types} onContinue={() => goToSubStep(2)} />
      )}
    </Animated.View>
  );
};

// --- Sub-step 0: Definition + Stats + Famous ---
const DefinitionPage: React.FC<{
  definition: string;
  stats?: Record<string, string>;
  famous?: string[];
  onContinue: () => void;
}> = ({ definition, stats, famous, onContinue }) => {
  return (
    <View style={styles.page}>
      <ScrollView style={styles.flex1} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Definition card */}
        <View style={styles.defCard}>
          <Text style={styles.defTitle}>What is Stuttering?</Text>
          <Text style={styles.defText}>{definition}</Text>
        </View>

        {stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Did You Know?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.statsRow}>
                {Object.entries(stats).map(([key, value]) => (
                  <View key={key} style={styles.statCard}>
                    <Text style={styles.statValue}>{value}</Text>
                    <Text style={styles.statLabel}>{key.replace(/_/g, ' ')}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {famous && (
          <View style={styles.famousCard}>
            <Text style={styles.sectionTitle}>Famous People Who Stutter</Text>
            {famous.map((person, i) => {
              const [name, role] = person.split(' - ');
              return (
                <View key={i} style={styles.personRow}>
                  <View style={styles.personAvatar}>
                    <Text style={styles.personInitial}>{name?.charAt(0)}</Text>
                  </View>
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{name}</Text>
                    {role && <Text style={styles.personRole}>{role}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.holdBtnWrap}>
          <HoldToContinue onComplete={onContinue} />
        </View>
      </ScrollView>
    </View>
  );
};

// --- Sub-step 1: Types of Stuttering ---
const TypesPage: React.FC<{
  types: { type: string; description: string; examples: string[] }[];
  onContinue: () => void;
}> = ({ types, onContinue }) => {
  return (
    <View style={styles.page}>
      <ScrollView style={styles.flex1} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Types of Stuttering</Text>

        {types.map((t, i) => {
          const typeColor = TYPE_COLORS[t.type] || colors.secondary;
          return (
            <FadeInItem key={t.type} index={i}>
              <View style={[styles.typeCard, { borderLeftColor: typeColor }]}>
                <Text style={[styles.typeTitle, { color: typeColor }]}>{t.type}</Text>
                <Text style={styles.typeDesc}>{t.description}</Text>
                <View style={styles.examplesRow}>
                  {t.examples.map((ex, j) => (
                    <View key={j} style={[styles.exampleChip, { backgroundColor: typeColor + '12' }]}>
                      <Text style={[styles.exampleText, { color: typeColor }]}>{ex}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </FadeInItem>
          );
        })}

        <View style={styles.holdBtnWrap}>
          <HoldToContinue onComplete={onContinue} />
        </View>
      </ScrollView>
    </View>
  );
};

// reusable fade-in wrapper
const FadeInItem: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      index * 80,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) }),
    );
  }, [index, opacity, translateY]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={anim}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  page: { flex: 1 },
  flex1: { flex: 1 },
  scroll: { paddingTop: spacingY.xl, paddingHorizontal: spacingX.lg, paddingBottom: 100 },

  // definition
  defCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacingX.md,
    marginBottom: spacingY.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  defTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  defText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 24,
  },

  // sections
  section: { marginBottom: spacingY.md },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  pageTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
    marginBottom: spacingY.md,
  },

  // stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: spacingX.sm,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.sm,
    alignItems: 'center',
    minWidth: 130,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.secondary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  // famous
  famousCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacingX.md,
    marginBottom: spacingY.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.sm,
    marginBottom: spacingY.sm,
  },
  personAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.secondary + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personInitial: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.secondary,
  },
  personInfo: { flex: 1 },
  personName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  personRole: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },

  // types
  typeCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacingX.md,
    marginBottom: spacingY.sm,
    borderLeftWidth: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  typeTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    marginBottom: 4,
  },
  typeDesc: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: spacingY.xs,
  },
  examplesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  exampleChip: {
    paddingHorizontal: spacingX.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  exampleText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
  },

  // hold button
  holdBtnWrap: {
    marginTop: spacingY.lg,
    marginBottom: spacingY.xl,
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
    backgroundColor: colors.secondary,
  },
  holdBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    letterSpacing: 0.5,
  },
});

export default EducationStep;
