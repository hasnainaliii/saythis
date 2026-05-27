import React, { useState, useCallback, useMemo } from 'react';
import { View, Alert,  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/Theme';
import { ToolIntroScreen } from '../../components/tools/ToolIntroScreen';
import { ToolResultScreen } from '../../components/tools/ToolResultScreen';
import { BoxBreathingSettings } from '../../components/tools/BoxBreathingSettings';
import { BoxBreathingSession } from '../../components/tools/BoxBreathingSession';
import { useBreathingPhaseTimer, BreathingPhase } from '../../hooks/useBreathingPhaseTimer';
import { useSessionStatsTracker } from '../../hooks/useSessionStatsTracker';
import { saveSessionToBackend } from '../../utils/toolSessionApi';

const ACCENT = colors.secondary;

const INTRO_CARDS = [
  {
    icon: "square-outline",
    iconColor: ACCENT,
    title: "Breathe in a square",
    body: "Four equal sides: inhale, hold, exhale, hold — each for the same number of seconds. The rhythm signals safety to your nervous system, slowing your heart rate and reducing pre-speech anxiety.",
    highlight:
      "Used by Navy SEALs and Olympic athletes to perform under pressure",
  },
  {
    step: 2,
    icon: "timer-outline",
    iconColor: ACCENT,
    title: "How to breathe",
    body: "Breathe in through your nose, expanding your belly first then your chest. Hold without tension — don't grip. Exhale slowly through slightly parted lips. Hold at the bottom with your lungs empty. Let the on-screen box guide your timing.",
    highlight: "Do not force the breath — gentle and steady wins every time",
  },
  {
    step: 3,
    icon: "trending-up-outline",
    iconColor: ACCENT,
    title: "Building the habit",
    body: "Start with 4 seconds per side. If that feels easy after a few sessions, increase to 5 or 6. Practice 3–5 minutes daily — even without a stutter trigger — to build a reliable calm-down response you can call on anywhere.",
  },
];

type BoxPhase = "inhale" | "hold_top" | "exhale" | "hold_bottom";

const buildPhases = (sec: number): BreathingPhase[] => [
  { id: "inhale", label: "INHALE", durationMs: sec * 1000, color: ACCENT },
  {
    id: "hold_top",
    label: "HOLD",
    durationMs: sec * 1000,
    color: colors.warning,
  },
  {
    id: "exhale",
    label: "EXHALE",
    durationMs: sec * 1000,
    color: colors.secondary,
  },
  {
    id: "hold_bottom",
    label: "HOLD",
    durationMs: sec * 1000,
    color: colors.warning,
  },
];

export default function BoxBreathingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState(0);
  const [secondsPerSide, setSecondsPerSide] = useState(4);
  const [targetCycles, setTargetCycles] = useState(5);
  const [audioCues, setAudioCues] = useState(true);

  const phases = useMemo(() => buildPhases(secondsPerSide), [secondsPerSide]);
  const session = useSessionStatsTracker("BOX_BREATHING");

  const handlePhaseChange = useCallback(() => {
    if (audioCues) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [audioCues]);

  const handleComplete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    session.endSession();
    setTimeout(() => setStage(3), 800);
  }, [session]);

  const timer = useBreathingPhaseTimer({
    phases,
    totalCycles: targetCycles,
    onPhaseChange: handlePhaseChange,
    onComplete: handleComplete,
  });

  const handleBegin = (sec: number, cyc: number, audio: boolean) => {
    setSecondsPerSide(sec);
    setTargetCycles(cyc);
    setAudioCues(audio);
    session.startSession();
    setStage(2);
    setTimeout(() => timer.start(), 100);
  };

  const handleStop = () => {
    Alert.alert("End session?", "Progress will be saved.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Session",
        style: "destructive",
        onPress: () => {
          timer.stop();
          session.endSession();
          setStage(3);
        },
      },
    ]);
  };

  const handleSave = async (rating: number | null) => {
    try {
      await saveSessionToBackend({
        toolType: "BOX_BREATHING" as any,
        startedAt: session.startedAt || new Date().toISOString(),
        endedAt: session.endedAt || new Date().toISOString(),
        durationSeconds: session.durationSeconds,
        selfRating: rating,
        estimatedWords: 0,
        secondsPerSide,
        targetCycles,
        cyclesCompleted: timer.cyclesCompleted,
        audioCuesEnabled: audioCues,
      } as any);
    } catch (_) {}
    router.replace("/(main)/(tabs)/library");
  };

  const currentPhase = (timer.currentPhase?.id || "inhale") as BoxPhase;

  if (stage === 0) {
    return (
      <>
        
        <ToolIntroScreen
          toolName="Box Breathing"
          tagline="Calm your mind before you speak"
          accentColor={ACCENT}
          cards={INTRO_CARDS}
          holdLabel="Hold to configure"
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
          <BoxBreathingSettings onBegin={handleBegin} />
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
          <BoxBreathingSession
            currentPhase={currentPhase}
            progress={timer.progress}
            secondsPerSide={secondsPerSide}
            cyclesCompleted={timer.cyclesCompleted}
            targetCycles={targetCycles}
            elapsedDisplay={session.elapsedDisplay}
            isPaused={timer.isPaused}
            onPause={timer.pause}
            onResume={timer.resume}
            onStop={handleStop}
          />
        </View>
      </>
    );
  }

  return (
    <>
      
      <ToolResultScreen
        toolName="Box Breathing"
        subtitle="Your nervous system thanks you."
        accentColor={ACCENT}
        stats={[
          { label: "Duration", value: session.elapsedDisplay },
          { label: "Cycles", value: timer.cyclesCompleted, unit: "cycles" },
          { label: "Breath rate", value: secondsPerSide, unit: "sec/phase" },
          {
            label: "Total breaths",
            value: timer.cyclesCompleted,
            unit: "breaths",
          },
        ]}
        tipCard={{
          icon: "megaphone-outline",
          iconColor: ACCENT,
          title: "Use it before speaking",
          body: "Next time you face a feared situation — a phone call, a presentation, a conversation — do 3 box breaths first. This is your on-ramp to fluent speech. Make it a non-negotiable ritual.",
        }}
        onSave={handleSave}
        onRepeat={() => setStage(1)}
      />
    </>
  );
}
