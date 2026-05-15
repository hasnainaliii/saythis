import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Exercise } from '../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';

interface CompletionScreenProps {
  exercise: Exercise;
  rating: number;
  notes: string;
  onBackToExercises: () => void;
  onNextExercise?: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  exercise, rating, notes, onBackToExercises, onNextExercise,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Trophy */}
        <FadeIn delay={100}>
          <View style={styles.trophyWrap}>
            <Ionicons name="trophy" size={56} color={colors.secondary} />
          </View>
        </FadeIn>

        <FadeIn delay={200}>
          <Text style={styles.title}>Great Work!</Text>
        </FadeIn>

        <FadeIn delay={300}>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
        </FadeIn>

        <FadeIn delay={400}>
          <Text style={styles.subtitle}>You've completed this exercise.</Text>
        </FadeIn>

        <FadeIn delay={500}>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <Ionicons
                key={i}
                name={i <= rating ? 'star' : 'star-outline'}
                size={24}
                color={i <= rating ? colors.star : colors.border}
              />
            ))}
          </View>
        </FadeIn>

        {!!notes && (
          <FadeIn delay={600}>
            <View style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Ionicons name="journal" size={18} color={colors.secondary} />
                <Text style={styles.noteTitle}>Session Note</Text>
              </View>
              <Text style={styles.noteText}>"{notes}"</Text>
            </View>
          </FadeIn>
        )}

        <View style={styles.chipsWrap}>
          {exercise.expected_outcomes.map((outcome, i) => (
            <OutcomeChip key={i} text={outcome} index={i} />
          ))}
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.outlineBtn} onPress={onBackToExercises}>
            <Text style={styles.outlineBtnText}>Back to Exercises</Text>
          </Pressable>
          {onNextExercise && (
            <Pressable style={styles.filledBtn} onPress={onNextExercise}>
              <Text style={styles.filledBtnText}>Next Exercise</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const FadeIn: React.FC<{ delay: number; children: React.ReactNode }> = ({
  delay, children,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 350, easing: Easing.out(Easing.quad) }),
    );
  }, [delay, opacity, translateY]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={anim}>{children}</Animated.View>;
};

const OutcomeChip: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(700 + index * 80, withTiming(1, { duration: 300 }));
  }, [index, opacity]);

  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.outcomeChip, anim]}>
      <Text style={styles.outcomeChipText}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.xxl,
    paddingBottom: 100,
  },
  trophyWrap: { marginBottom: spacingY.md },
  title: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacingY.xs,
  },
  exerciseTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacingY.xs,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacingY.md,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacingY.md,
  },
  noteCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacingX.md,
    marginBottom: spacingY.xl,
    alignSelf: 'stretch',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.xs,
    marginBottom: spacingY.xs,
  },
  noteTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  noteText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacingY.xl,
  },
  outcomeChip: {
    backgroundColor: colors.successBg,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
    borderRadius: radii.pill,
  },
  outcomeChipText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.successText,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: radii.xl,
    paddingVertical: spacingY.sm,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.secondary,
  },
  filledBtn: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: radii.xl,
    paddingVertical: spacingY.sm,
    alignItems: 'center',
  },
  filledBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});

export default CompletionScreen;
