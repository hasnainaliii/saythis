import React, { useState, useCallback, useMemo } from 'react';
import { View, Alert,  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors } from '@/src/theme/Theme';
import { ToolIntroScreen } from '@/src/components/tools/ToolIntroScreen';
import { ToolResultScreen } from '@/src/components/tools/ToolResultScreen';
import { DiaphragmaticSettings } from '@/src/components/tools/DiaphragmaticSettings';
import { DiaphragmaticSession } from '@/src/components/tools/DiaphragmaticSession';
import { useBreathingPhaseTimer, BreathingPhase } from '@/src/hooks/useBreathingPhaseTimer';
import { useSessionStatsTracker } from '@/src/hooks/useSessionStatsTracker';
import { saveSessionToBackend } from '@/src/utils/toolSessionApi';

const ACCENT = colors.secondary;

const INTRO_CARDS = [
  {
    icon: "body-outline",
    iconColor: ACCENT,
    title: "Belly over chest",
    body: "Most people under stress breathe from their chest — short, shallow breaths that keep the nervous system on high alert. Diaphragmatic breathing fills the lungs from the bottom up, using the diaphragm muscle to pull in more air with less effort.",
    highlight:
      "Belly breathing reduces vocal tension — the primary cause of blocks",
  },
  {
    step: 2,
    icon: "hand-right-outline",
    iconColor: ACCENT,
    title: "Check yourself",
    body: "Place one hand on your chest and one on your belly. When you breathe correctly, only the belly hand moves — the chest hand stays still. If your chest rises first, you are chest breathing. The belly hand should rise on inhale and fall on exhale.",
    highlight:
      "This single check tells you everything about your breathing pattern",
  },
  {
    step: 3,
    icon: "infinite-outline",
    iconColor: ACCENT,
    title: "The exhale matters most",
    body: "Always exhale longer than you inhale. This is not optional — it is the mechanism that calms the nervous system. We use a 4-second inhale and 6-second exhale. Breathe out through slightly parted lips, like you are fogging a mirror very gently.",
  },
];

type DiaPhase = "inhale" | "hold" | "exhale" | "rest";

const buildPhases = (inh: number, exh: number): BreathingPhase[] => [
  { id: "inhale", label: "INHALE", durationMs: inh * 1000, color: ACCENT },
  { id: "hold", label: "HOLD", durationMs: 1000, color: colors.warning },
  {
    id: "exhale",
    label: "EXHALE",
    durationMs: exh * 1000,
    color: colors.secondary,
  },
  { id: "rest", label: "REST", durationMs: 1000, color: colors.textDisabled },
];

export default function DiaphragmaticBreathingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState(0);
  const [inhale, setInhale] = useState(4);
  const [exhale, setExhale] = useState(6);
  const [targetCycles, setTargetCycles] = useState(10);

  const phases = useMemo(() => buildPhases(inhale, exhale), [inhale, exhale]);
  const session = useSessionStatsTracker("DIAPHRAGMATIC");

  const handlePhaseChange = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleComplete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    session.endSession();
    setTimeout(() => setStage(3), 1000);
  }, [session]);

  const timer = useBreathingPhaseTimer({
    phases,
    totalCycles: targetCycles,
    onPhaseChange: handlePhaseChange,
    onComplete: handleComplete,
  });

  const handleBegin = (inh: number, exh: number, cyc: number) => {
    setInhale(inh);
    setExhale(exh);
    setTargetCycles(cyc);
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
        toolType: "DIAPHRAGMATIC" as any,
        startedAt: session.startedAt || new Date().toISOString(),
        endedAt: session.endedAt || new Date().toISOString(),
        durationSeconds: session.durationSeconds,
        selfRating: rating,
        estimatedWords: 0,
        inhaleDuration: inhale,
        exhaleDuration: exhale,
        targetCycles,
        cyclesCompleted: timer.cyclesCompleted,
      } as any);
    } catch (_) {}
    router.replace("/(main)/(tabs)/library");
  };

  const currentPhase = (timer.currentPhase?.id || "inhale") as DiaPhase;

  // Current phase duration for the visual
  const phaseDurSec =
    currentPhase === "inhale" ? inhale : currentPhase === "exhale" ? exhale : 1;

  if (stage === 0) {
    return (
      <>
        
        <ToolIntroScreen
          toolName="Diaphragmatic Breathing"
          tagline="Breathe from your belly, speak with ease"
          accentColor={ACCENT}
          cards={INTRO_CARDS}
          holdLabel="Hold to set up"
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
          <DiaphragmaticSettings onBegin={handleBegin} />
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
          <DiaphragmaticSession
            phase={currentPhase}
            progress={timer.progress}
            cyclesCompleted={timer.cyclesCompleted}
            targetCycles={targetCycles}
            isPaused={timer.isPaused}
            accentColor={ACCENT}
            phaseDurationSec={phaseDurSec}
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
        toolName="Diaphragmatic Breathing"
        subtitle="Your body knows how to breathe. You just reminded it."
        accentColor={ACCENT}
        stats={[
          { label: "Duration", value: session.elapsedDisplay },
          { label: "Breaths", value: timer.cyclesCompleted, unit: "breaths" },
          { label: "Inhale", value: inhale, unit: "sec" },
          { label: "Exhale", value: exhale, unit: "sec" },
        ]}
        tipCard={{
          icon: "chatbubble-ellipses-outline",
          iconColor: ACCENT,
          title: "Do this before you speak",
          body: "Before your next conversation, take three diaphragmatic breaths. Notice how your throat and jaw feel looser. That looseness is the physical state where fluent speech lives. Build the habit.",
        }}
        onSave={handleSave}
        onRepeat={() => setStage(1)}
      />
    </>
  );
}
