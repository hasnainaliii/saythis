import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';

interface QuizQuestion {
  example: string;
  correctType: string;
}

interface EducationQuizProps {
  types: { type: string; examples: string[] }[];
  onComplete: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  Repetitions: colors.categoryEducation,
  Prolongations: colors.categorySelfAwareness,
  Blocks: colors.categorySelfAdvocacy,
};

const EducationQuiz: React.FC<EducationQuizProps> = ({ types, onComplete }) => {
  const questions = useMemo<QuizQuestion[]>(() => {
    const qs: QuizQuestion[] = [];
    types.forEach(t => {
      t.examples.forEach(ex => qs.push({ example: ex, correctType: t.type }));
    });
    // shuffle
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
    return qs;
  }, [types]);

  const typeNames = useMemo(() => types.map(t => t.type), [types]);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const fadeOpacity = useSharedValue(1);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fadeOpacity.value }));

  const question = questions[currentQ];
  const isCorrect = selected === question?.correctType;
  const isWrong = selected !== null && !isCorrect;

  const handleSelect = (type: string) => {
    if (selected) return;
    setSelected(type);

    if (type === question.correctType) {
      setScore(prev => prev + 1);
      // auto-advance after brief pause
      setTimeout(() => advanceQuestion(), 800);
    }
  };

  const handleTryAgain = () => setSelected(null);

  const advanceQuestion = () => {
    if (currentQ >= questions.length - 1) {
      setFinished(true);
      return;
    }
    fadeOpacity.value = withTiming(0, { duration: 120 }, () => {
      fadeOpacity.value = withTiming(1, { duration: 200 });
    });
    setCurrentQ(prev => prev + 1);
    setSelected(null);
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.centerScroll}>
          <View style={styles.scoreCard}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text style={styles.scoreTitle}>Quiz Complete!</Text>
            <Text style={styles.scoreText}>
              You got {score} out of {questions.length} correct
            </Text>
          </View>
          <Pressable style={styles.continueBtn} onPress={onComplete}>
            <Text style={styles.continueBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.progress}>
          Question {currentQ + 1} of {questions.length}
        </Text>

        <Animated.View style={fadeStyle}>
          <View style={styles.questionCard}>
            <Text style={styles.exampleText}>"{question.example}"</Text>
            <Text style={styles.questionLabel}>What type of stuttering is this?</Text>
          </View>

          <View style={styles.optionsWrap}>
            {typeNames.map(type => {
              const typeColor = TYPE_COLORS[type] || colors.secondary;
              const isThis = selected === type;
              const correct = type === question.correctType;

              let bgColor = colors.white;
              let borderColor = colors.border;
              let textColor = colors.textDark;

              if (isThis && correct) {
                bgColor = colors.successBg;
                borderColor = colors.success;
                textColor = colors.success;
              } else if (isThis && !correct) {
                bgColor = colors.errorLight + '15';
                borderColor = colors.errorLight;
                textColor = colors.errorLight;
              }

              return (
                <Pressable
                  key={type}
                  onPress={() => handleSelect(type)}
                  style={[styles.optionBtn, { borderColor, backgroundColor: bgColor }]}
                >
                  <View style={[styles.optionDot, { backgroundColor: typeColor }]} />
                  <Text style={[styles.optionText, { color: textColor }]}>{type}</Text>
                  {isThis && correct && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  )}
                  {isThis && !correct && (
                    <Ionicons name="close-circle" size={18} color={colors.errorLight} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {isWrong && (
            <Pressable style={styles.tryAgainBtn} onPress={handleTryAgain}>
              <Text style={styles.tryAgainText}>Try again</Text>
            </Pressable>
          )}

          {isCorrect && (
            <Text style={styles.correctLabel}>Correct! ✓</Text>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacingX.lg, paddingBottom: spacingY.xl },
  centerScroll: {
    paddingHorizontal: spacingX.lg,
    paddingBottom: spacingY.xl,
    alignItems: 'center',
    paddingTop: spacingY.xxl,
  },
  progress: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacingY.md,
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacingX.lg,
    alignItems: 'center',
    marginBottom: spacingY.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  exampleText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacingY.sm,
  },
  questionLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: 'center',
  },
  optionsWrap: { gap: 10 },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.sm,
    padding: spacingX.md,
    borderRadius: radii.md,
    borderWidth: 1.5,
  },
  optionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionText: {
    flex: 1,
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
  },
  tryAgainBtn: {
    alignSelf: 'center',
    marginTop: spacingY.md,
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.primary10,
  },
  tryAgainText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  correctLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.success,
    textAlign: 'center',
    marginTop: spacingY.md,
  },
  scoreCard: {
    alignItems: 'center',
    gap: spacingY.sm,
    marginBottom: spacingY.xl,
  },
  scoreTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
  },
  scoreText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.secondary,
    paddingVertical: spacingY.sm,
    paddingHorizontal: spacingX.xxl,
    borderRadius: radii.xl,
  },
  continueBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});

export default EducationQuiz;
