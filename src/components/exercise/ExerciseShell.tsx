import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Exercise } from '../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { CATEGORY_ACCENT } from '../../data/chapterConfig';
import { BackButton } from '../BackButton';
import StepProgressBar from './StepProgressBar';
import CompletionScreen from './CompletionScreen';

import InstructionsStep from './steps/InstructionsStep';
import EducationStep from './steps/EducationStep';
import SelfAwarenessStep from './steps/SelfAwarenessStep';
import CBTStep from './steps/CBTStep';
import SelfAdvocacyStep from './steps/SelfAdvocacyStep';
import BreathingTechniqueStep from './steps/BreathingTechniqueStep';
import TensionReductionStep from './steps/TensionReductionStep';
import BreathSpeechStep from './steps/BreathSpeechStep';
import RateControlStep from './steps/RateControlStep';
import RatingStep from './steps/RatingStep';

export interface CategoryStepProps {
  exercise: Exercise;
  onContinue: () => void;
}

const STEP_REGISTRY: Record<Exercise['category'], React.ComponentType<CategoryStepProps>> = {
  education: EducationStep,
  self_awareness: SelfAwarenessStep,
  cognitive_behavioral: CBTStep,
  self_advocacy: SelfAdvocacyStep,
  breathing_technique: BreathingTechniqueStep,
  tension_reduction: TensionReductionStep,
  breath_speech_coordination: BreathSpeechStep,
  rate_control: RateControlStep,
};

interface ExerciseShellProps {
  exercise: Exercise;
  onComplete: (rating: number, notes: string) => void;
  onBack: () => void;
  onNextExercise?: () => void;
}

const ExerciseShell: React.FC<ExerciseShellProps> = ({
  exercise, onComplete, onBack, onNextExercise,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [completionData, setCompletionData] = useState({ rating: 0, notes: '' });

  const accent = CATEGORY_ACCENT[exercise.category] ?? colors.secondary;
  const CategoryStep = STEP_REGISTRY[exercise.category];
  const totalSteps = 3;

  const [transitionDir, setTransitionDir] = useState(1);

  const contentOpacity = useSharedValue(1);
  const contentX = useSharedValue(0);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateX: contentX.value }],
  }));

  const transitionTo = (nextStep: number) => {
    const dir = nextStep > currentStep ? 1 : -1;
    setTransitionDir(dir);
    contentOpacity.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) });
    contentX.value = withTiming(dir * -20, { duration: 150 }, (finished) => {
      if (finished) {
        runOnJS(setCurrentStep)(nextStep);
      }
    });
  };

  // Wait for React to render the new step before animating in
  useEffect(() => {
    contentX.value = transitionDir * 20;
    contentOpacity.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) });
    contentX.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) });
  }, [currentStep, transitionDir]);

  const goForward = () => {
    if (currentStep < totalSteps - 1) transitionTo(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) transitionTo(currentStep - 1);
    else onBack();
  };

  const handleComplete = (rating: number, notes: string) => {
    setCompletionData({ rating, notes });
    setIsComplete(true);
    onComplete(rating, notes);
  };

  if (isComplete) {
    return (
      <CompletionScreen
        exercise={exercise}
        rating={completionData.rating}
        notes={completionData.notes}
        onBackToExercises={onBack}
        onNextExercise={onNextExercise}
      />
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <InstructionsStep exercise={exercise} onContinue={goForward} />;
      case 1:
        return <CategoryStep exercise={exercise} onContinue={goForward} />;
      case 2:
        return <RatingStep exercise={exercise} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={goBack} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {exercise.title}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.metaPill, { backgroundColor: accent + '15' }]}>
          <Ionicons name="time-outline" size={12} color={accent} />
          <Text style={[styles.metaPillText, { color: accent }]}>
            {exercise.duration_minutes} min
          </Text>
        </View>
        <View style={[styles.metaPill, { backgroundColor: accent + '15' }]}>
          <Ionicons name="refresh-outline" size={12} color={accent} />
          <Text style={[styles.metaPillText, { color: accent }]}>
            {exercise.frequency}
          </Text>
        </View>
      </View>

      <StepProgressBar totalSteps={totalSteps} currentStep={currentStep} />

      <Animated.View style={[styles.stepContent, contentStyle]}>
        {renderStep()}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX.sm,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
  headerSpacer: { width: 50 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: spacingY.xs,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacingX.sm,
    paddingVertical: 5,
    borderRadius: radii.sm,
  },
  metaPillText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
  },
  stepContent: { flex: 1 },
});

export default ExerciseShell;
