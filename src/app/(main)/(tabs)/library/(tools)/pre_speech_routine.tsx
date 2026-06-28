import React, { useState, useCallback, useRef } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { colors } from '@/src/theme/Theme';
import { ToolIntroScreen } from '@/src/components/tools/ToolIntroScreen';
import { ToolResultScreen } from '@/src/components/tools/ToolResultScreen';
import { SituationSelector } from '@/src/components/tools/SituationSelector';
import { StepIndicatorBar } from '@/src/components/tools/StepIndicatorBar';
import { SettleStep, ReleaseStep, WarmUpStep, EasyOnsetStep, AffirmStep } from '@/src/components/tools/PreSpeechSteps';
import { useSessionStatsTracker } from '@/src/hooks/useSessionStatsTracker';
import { saveSessionToBackend } from '@/src/utils/toolSessionApi';
import { prespeechPhrases } from '@/src/constants/prespeechPhrases';
import { affirmations } from '@/src/constants/affirmations';

const ACCENT = colors.secondary;

const INTRO_CARDS = [
  {
    icon: "flag-outline",
    iconColor: ACCENT,
    title: "Your pre-speech ritual",
    body: "Top athletes have warm-up routines. Singers have vocal preparation. This is yours — a repeatable, 3-minute sequence that primes your body and mind for fluent speech before any challenging situation.",
    highlight: "Consistency matters more than perfection — use it every time",
  },
  {
    step: 2,
    icon: "list-outline",
    iconColor: ACCENT,
    title: "Five steps, three minutes",
    body: "Settle (breathe), Release (body tension), Warm up (voice), Easy onset (practice), Affirm (mindset). Each step builds on the last. The sequence is designed — do not skip steps.",
  },
  {
    step: 3,
    icon: "repeat-outline",
    iconColor: ACCENT,
    title: "Build the association",
    body: "The goal is to make this routine so automatic that starting step 1 immediately begins to calm your nervous system — like a trained reflex. This takes 2–3 weeks of daily use. Keep going.",
    highlight: "The routine works best when done in the same order every time",
  },
];

export default function PreSpeechRoutineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [situation, setSituation] = useState("");
  const [customText, setCustomText] = useState("");
  const stepStartTimes = useRef<Record<number, number>>({});
  const stepEndTimes = useRef<Record<number, number>>({});

  const session = useSessionStatsTracker("PRE_SPEECH");
  const dayIdx = new Date().getDay();
  const todayAffirmation = affirmations[dayIdx] || affirmations[0];

  const handleSituationStart = (sit: string, custom?: string) => {
    setSituation(sit);
    setCustomText(custom || "");
    session.startSession();
    stepStartTimes.current[0] = Date.now();
    setStage(2);
  };

  const advanceStep = useCallback(() => {
    stepEndTimes.current[currentStep] = Date.now();
    const next = currentStep + 1;
    if (next >= 5) {
      session.endSession();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStage(3);
      return;
    }
    stepStartTimes.current[next] = Date.now();
    setCurrentStep(next);
  }, [currentStep, session]);

  const getStepDurations = () => {
    const names = [
      "settle",
      "release",
      "warmUp",
      "easyOnset",
      "affirm",
    ] as const;
    const result: Record<string, number> = {};
    names.forEach((name, i) => {
      const start = stepStartTimes.current[i] || 0;
      const end = stepEndTimes.current[i] || start;
      result[name] = Math.round((end - start) / 1000);
    });
    return result;
  };

  const handleSave = async (rating: number | null) => {
    try {
      await saveSessionToBackend({
        toolType: "PRE_SPEECH" as any,
        startedAt: session.startedAt || new Date().toISOString(),
        endedAt: session.endedAt || new Date().toISOString(),
        durationSeconds: session.durationSeconds,
        selfRating: rating,
        estimatedWords: 0,
        situation,
        situationCustomText: customText || undefined,
        stepsCompleted: 5,
        stepDurations: getStepDurations(),
        affirmationIndex: dayIdx,
      } as any);
    } catch (_) {}
    router.replace("/(main)/(tabs)/library");
  };

  if (stage === 0) {
    return (
      <>
        
        <ToolIntroScreen
          toolName="Pre-Speech Routine"
          tagline="A ritual that prepares your voice and your mind"
          accentColor={ACCENT}
          cards={INTRO_CARDS}
          holdLabel="Hold to begin"
          onComplete={() => setStage(1)}
        />
      </>
    );
  }

  if (stage === 1) {
    return (
      <>
        
        <View
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            paddingTop: insets.top,
          }}
        >
          <SituationSelector onStart={handleSituationStart} />
        </View>
      </>
    );
  }

  if (stage === 2) {
    return (
      <>
        
        <View
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            paddingTop: insets.top,
          }}
        >
          <StepIndicatorBar currentStep={currentStep} />
          <ScrollView style={{ flex: 1 }}>
            <Animated.View
              key={currentStep}
              entering={SlideInRight.duration(300)}
              exiting={SlideOutLeft.duration(300)}
            >
              {currentStep === 0 && <SettleStep onComplete={advanceStep} />}
              {currentStep === 1 && <ReleaseStep onComplete={advanceStep} />}
              {currentStep === 2 && <WarmUpStep onComplete={advanceStep} />}
              {currentStep === 3 && (
                <EasyOnsetStep
                  onComplete={advanceStep}
                  phrases={prespeechPhrases}
                />
              )}
              {currentStep === 4 && (
                <AffirmStep
                  onComplete={advanceStep}
                  affirmation={todayAffirmation}
                />
              )}
            </Animated.View>
          </ScrollView>
        </View>
      </>
    );
  }

  return (
    <>
      
      <ToolResultScreen
        toolName="Pre-Speech Routine"
        subtitle="Routine complete. You prepared — now go do it."
        accentColor={ACCENT}
        stats={[
          { label: "Total time", value: session.elapsedDisplay },
          { label: "Steps done", value: "5 of 5" },
          { label: "Situation", value: situation },
          { label: "Phrase", value: "Easy onset ×3" },
        ]}
        tipCard={{
          icon: "rocket-outline",
          iconColor: ACCENT,
          title: "Now go do it",
          body: "You have 5 minutes of momentum. Use it. Start the call, enter the room, approach the counter. The routine only works if it leads directly into the situation. Don't wait.",
        }}
        onSave={handleSave}
        onRepeat={() => {
          setStage(0);
          setCurrentStep(0);
        }}
      />
    </>
  );
}
