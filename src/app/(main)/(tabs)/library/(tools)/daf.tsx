import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Image,  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInRight, ZoomIn } from 'react-native-reanimated';
import { WebView } from 'react-native-webview';
import Slider from '@react-native-community/slider';
import { requestRecordingPermissionsAsync } from 'expo-audio';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '@/src/theme/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { InstructionCard } from '@/src/components/tools/InstructionCard';
import { WaveformVisualizer } from '@/src/components/tools/WaveformVisualizer';
import { BreathingGuide } from '@/src/components/tools/BreathingGuide';
import { StatChip } from '@/src/components/tools/StatChip';
import { SessionRating } from '@/src/components/tools/SessionRating';
import { HoldToContinueButton } from '@/src/components/tools/HoldToContinueButton';

import { useDAFEngine } from '@/src/hooks/useDAFEngine';
import { useSessionTimer } from '@/src/hooks/useSessionTimer';
import { saveSessionToBackend } from '@/src/utils/toolSessionApi';
import { practicePassages } from '@/src/constants/practicePassages';

const dafHtml = `
  <!DOCTYPE html>
  <html>
  <body>
  <script>
  let audioCtx, source, delayNode, gainNode, stream;
  let delayMs = 150;
  let volume = 0.8;
  let isActive = false;

  async function startDAF() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }});
      audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
      source = audioCtx.createMediaStreamSource(stream);
      delayNode = audioCtx.createDelay(2.0);
      delayNode.delayTime.value = delayMs / 1000;
      gainNode = audioCtx.createGain();
      gainNode.gain.value = volume;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      source.connect(delayNode);
      delayNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a,b)=>a+b,0)/dataArray.length;
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'amplitude', value: avg/255
        }));
      }, 50);

      isActive = true;
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
    } catch(err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', value: err.message || 'Unknown error starting DAF' }));
    }
  }

  function stopDAF() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (audioCtx) audioCtx.close();
    isActive = false;
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'stopped' }));
  }

  function setDelay(ms) {
    delayMs = ms;
    if (delayNode) delayNode.delayTime.setTargetAtTime(ms/1000, audioCtx.currentTime, 0.01);
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'delay_updated', value: ms }));
  }

  function setVolume(v) {
    volume = v;
    if (gainNode) gainNode.gain.setTargetAtTime(v, audioCtx.currentTime, 0.01);
  }

  document.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.cmd === 'start') startDAF();
    if (msg.cmd === 'stop') stopDAF();
    if (msg.cmd === 'setDelay') setDelay(msg.value);
    if (msg.cmd === 'setVolume') setVolume(msg.value);
  });
  </script>
  </body>
  </html>
`;

export default function DAFScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState(0); // 0-Gate, 1-Intro, 2-Calib, 3-Practice, 4-Result
  const [currentCard, setCurrentCard] = useState(0);
  
  const [delayMs, setDelayMs] = useState(150);
  const [volume, setVolumeState] = useState(0.8);
  const [breathingDone, setBreathingDone] = useState(false);
  const [delayAdjustments, setDelayAdjustments] = useState(0);
  const [passageIndex, setPassageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showNoEarphonesInfo, setShowNoEarphonesInfo] = useState(false);

  const { webViewRef, amplitude, isEngineReady, isEngineStopped, startEngine, stopEngine, setDelay, setVolume, onMessage } = useDAFEngine();
  const { elapsedSeconds, elapsedFormatted, estimatedWords, resetTimer } = useSessionTimer(isEngineReady);

  useEffect(() => {
    if (isEngineStopped && stage === 3) {
      setStage(4);
    }
  }, [isEngineStopped, stage]);

  const requestAudioPermission = async () => {
    const { status } = await requestRecordingPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Microphone access is required for DAF.');
      return false;
    }
    return true;
  };

  const handleStartSession = async () => {
    const granted = await requestAudioPermission();
    if (granted) {
      setStage(3);
      resetTimer();
      startEngine();
      setDelay(delayMs);
      setVolume(volume);
    }
  };

  const handleEndSession = () => {
    Alert.alert("End session early?", "Your progress will be saved.", [
      { text: "Cancel", style: "cancel" },
      { text: "End Session", style: "destructive", onPress: stopEngine }
    ]);
  };

  const adjustDelay = (change: number) => {
    const newDelay = Math.max(50, Math.min(250, delayMs + change));
    setDelayMs(newDelay);
    setDelay(newDelay);
    setDelayAdjustments(prev => prev + 1);
  };

  const handleSaveResult = async (rating: number | null) => {
    const stats = {
      toolType: 'DAF' as const,
      startedAt: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      delayMs,
      volumePercent: volume * 100,
      estimatedWords,
      selfRating: rating,
      passageIndex,
      delayAdjustments,
    };
    try {
      await saveSessionToBackend(stats);
      // Navigate to stats or home here
      Alert.alert("Success", "Session saved!");
    } catch (e) {
      Alert.alert("Offline", "Session saved offline. Will sync later.");
    }
  };

  const renderStage0 = () => (
    <Animated.View entering={FadeIn.duration(300)} style={styles.gateContainer}>
      <Ionicons name="headset-outline" size={64} color={colors.secondary} style={styles.gateIcon} />
      <Text style={styles.gateTitle}>Earphones Required</Text>
      <Text style={styles.gateBody}>
        DAF feeds your voice back into your ears with a delay. Without earphones, the microphone will pick up the playback and create painful feedback.
      </Text>
      <Pressable style={styles.gatePrimaryBtn} onPress={() => setStage(1)}>
        <Text style={styles.gatePrimaryText}>I'm wearing earphones</Text>
      </Pressable>
      {!showNoEarphonesInfo ? (
        <Pressable style={styles.gateSecondaryBtn} onPress={() => setShowNoEarphonesInfo(true)}>
          <Text style={styles.gateSecondaryText}>What if I don't have earphones?</Text>
        </Pressable>
      ) : (
        <Animated.View entering={FadeIn} style={styles.infoBox}>
          <View style={styles.infoBoxHeader}>
            <Ionicons name="information-circle" size={20} color={colors.secondary} />
            <Text style={styles.infoBoxTitle}>No earphones?</Text>
          </View>
          <Text style={styles.infoBoxText}>You can use DAF with speakers in a quiet room at low volume, but earphones prevent painful feedback loops.</Text>
          <Pressable style={styles.infoBoxBtn} onPress={() => setStage(1)}>
            <Text style={styles.infoBoxBtnText}>Continue anyway</Text>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );

  const cards = [
    {
      icon: <Ionicons name="time-outline" size={28} color={colors.secondary} />,
      title: "Delayed Auditory Feedback",
      body: "Your voice is recorded and played back into your ears with a small delay. This interrupts your brain's normal speech monitoring, encouraging slower, steadier speech.",
      highlight: "Used by speech therapists worldwide since the 1950s"
    },
    {
      step: 2,
      icon: <Ionicons name="mic-outline" size={28} color={colors.secondary} />,
      title: "Speaking through DAF",
      body: "Speak at your normal pace. You'll hear your voice echoing back. Don't fight the echo — let it guide you. Your brain will naturally slow down to match the delayed feedback. This takes 2–3 minutes to feel natural.",
      highlight: "If you feel disoriented at first, that's normal — breathe and continue"
    },
    {
      step: 3,
      icon: <Ionicons name="bulb-outline" size={28} color={colors.secondary} />,
      title: "Getting the best results",
      body: "Start with a 150ms delay. If speech feels unnatural, reduce to 100ms. Practice reading a passage aloud for 3–5 minutes per session. End each session by removing earphones and speaking normally to transfer the effect."
    }
  ];

  const renderStage1 = () => (
    <ScrollView style={styles.stageScroll} contentContainerStyle={styles.stageContent}>
      <InstructionCard {...cards[currentCard]} />
      <View style={styles.navRow}>
        <Pressable onPress={() => setCurrentCard(Math.max(0, currentCard - 1))} disabled={currentCard === 0}>
          <Ionicons name="chevron-back-outline" size={20} color={currentCard === 0 ? colors.textDisabled : colors.textMuted} />
        </Pressable>
        <View style={styles.dots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, i === currentCard && styles.dotActive]} />
          ))}
        </View>
        <Pressable onPress={() => setCurrentCard(Math.min(2, currentCard + 1))} disabled={currentCard === 2}>
          <Ionicons name="chevron-forward-outline" size={20} color={currentCard === 2 ? colors.textDisabled : colors.textMuted} />
        </Pressable>
      </View>
      {currentCard === 2 && (
        <HoldToContinueButton label="Hold to start setup" holdDurationMs={1500} onComplete={() => setStage(2)} />
      )}
    </ScrollView>
  );

  const renderStage2 = () => (
    <Animated.ScrollView entering={FadeIn.duration(300)} style={styles.stageContainer} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.calibTitle}>Configure Your DAF</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Delay</Text>
        <Text style={styles.sectionSub}>How long after you speak you hear yourself</Text>
        
        <View style={styles.sliderPill}>
          <Text style={styles.sliderPillText}>{delayMs} ms</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={50}
          maximumValue={250}
          step={10}
          value={delayMs}
          onValueChange={setDelayMs}
          minimumTrackTintColor={colors.secondary}
          maximumTrackTintColor={colors.libraryBorder}
          thumbTintColor={colors.secondary}
        />
        <View style={styles.chipsRow}>
          {[ {l: 'Subtle', v: 100}, {l: 'Balanced', v: 150}, {l: 'Strong', v: 200} ].map(chip => {
            const selected = delayMs === chip.v;
            return (
              <Pressable key={chip.v} onPress={() => setDelayMs(chip.v)} style={[styles.presetChip, selected && styles.presetChipActive]}>
                <Text style={[styles.presetChipText, selected && styles.presetChipTextActive]}>{chip.l} ({chip.v}ms)</Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback Volume</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.2}
          maximumValue={1.0}
          step={0.1}
          value={volume}
          onValueChange={setVolumeState}
          minimumTrackTintColor={colors.secondary}
          maximumTrackTintColor={colors.libraryBorder}
          thumbTintColor={colors.secondary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Before you begin</Text>
        {!breathingDone ? (
          <BreathingGuide 
            phase="inhale" 
            progress={0} 
            inhaleDuration={4000} 
            holdDuration={2000} 
            exhaleDuration={6000} 
            restDuration={0} 
            onCycleComplete={() => setBreathingDone(true)} 
          />
        ) : (
          <Text style={styles.sectionSub}>Warm-up complete. You're ready.</Text>
        )}
      </View>

      <HoldToContinueButton 
        label="Hold to begin session" 
        sublabel={!breathingDone ? "Complete breathing warmup..." : "Ready to start"}
        onComplete={handleStartSession} 
      />
    </Animated.ScrollView>
  );

  const renderStage3 = () => (
    <Animated.View entering={FadeIn.duration(300)} style={styles.stageContainer}>
      <View style={styles.headerBar}>
        <Pressable onPress={handleEndSession}>
          <Ionicons name="stop-circle-outline" size={24} color={colors.error} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>DAF Active</Text>
          <Animated.View style={styles.pulseDot} />
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{delayMs}ms</Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{elapsedFormatted}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min(100, (elapsedSeconds / 300) * 100)}%` }]} />
        </View>
      </View>

      <WaveformVisualizer isActive={isEngineReady && !isMuted} amplitude={amplitude} color={colors.secondary} />

      <View style={styles.passageCard}>
        <View style={styles.passageHeader}>
          <Text style={styles.passageHeaderTitle}>READING PASSAGE</Text>
          <Pressable onPress={() => setPassageIndex((passageIndex + 1) % practicePassages.length)}>
            <Ionicons name="refresh-outline" size={16} color={colors.textMuted} />
          </Pressable>
        </View>
        <Text style={styles.passageText}>
          {practicePassages[passageIndex].split(' ').map((word, i) => {
            const isHighlighted = Math.floor((elapsedSeconds / 60) * 130) === i;
            return (
              <Text key={i} style={isHighlighted ? styles.wordHighlighted : {}}>
                {word + ' '}
              </Text>
            );
          })}
        </Text>
      </View>

      <View style={styles.controlRow}>
        <View style={styles.quickAdjust}>
          <Pressable onPress={() => adjustDelay(-10)}><Text style={styles.quickAdjustBtn}>−10ms</Text></Pressable>
          <Text style={styles.quickAdjustVal}>{delayMs}ms</Text>
          <Pressable onPress={() => adjustDelay(10)}><Text style={styles.quickAdjustBtn}>+10ms</Text></Pressable>
        </View>

        <Pressable style={[styles.muteBtn, !isMuted && styles.muteBtnActive]} onPress={() => setIsMuted(!isMuted)}>
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={32} color={isMuted ? colors.textDisabled : colors.secondary} />
        </Pressable>

        <Ionicons name={volume > 0.5 ? "volume-high" : (volume > 0 ? "volume-low" : "volume-mute")} size={28} color={colors.textMuted} />
      </View>

      <View style={styles.statsRow}>
        <StatChip label="Duration" value={elapsedFormatted} />
        <StatChip label="Delay" value={delayMs} unit="ms" />
        <StatChip label="Est. Words" value={estimatedWords} />
      </View>
    </Animated.View>
  );

  const renderStage4 = () => (
    <Animated.ScrollView entering={FadeIn.duration(300)} style={styles.stageContainer} contentContainerStyle={styles.scrollContent}>
      <Animated.View entering={ZoomIn} style={styles.resultsHeader}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        <Text style={styles.resultsTitle}>Session Complete!</Text>
        <Text style={styles.resultsSub}>Great work. Your brain is adapting.</Text>
      </Animated.View>

      <View style={styles.resultsGrid}>
        <StatChip label="Duration" value={elapsedFormatted} />
        <StatChip label="Delay Used" value={delayMs} unit="ms" />
        <StatChip label="Words Spoken" value={estimatedWords} />
        <StatChip label="Volume" value={Math.round(volume * 100)} unit="%" />
      </View>

      <SessionRating onRate={(r) => handleSaveResult(r)} onSkip={() => handleSaveResult(null)} />

      <InstructionCard 
        icon={<Ionicons name="flash-outline" size={28} color={colors.warning} />}
        title="Transfer Practice"
        body="Now remove your earphones and speak for 2 minutes on any topic. Your brain carries the fluency pattern forward — this is called transfer."
      />

      <Pressable style={styles.primaryActionBtn} onPress={() => router.replace('/(main)/(tabs)/library')}>
        <Text style={styles.primaryActionText}>Back to Library</Text>
      </Pressable>
    </Animated.ScrollView>
  );

  return (
    <View style={styles.container}>
      
      <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
        <WebView
          ref={webViewRef}
          source={{ html: dafHtml, baseUrl: 'https://localhost' }}
          style={{ height: 1, width: 1 }}
          javaScriptEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mediaCapturePermissionGrantType="grant"
          originWhitelist={['*']}
          onMessage={onMessage}
        />
      </View>

      {(stage === 0 || stage === 1) && (
        <View style={[styles.heroBlock, { height: 220 + insets.top }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <Pressable style={[styles.backBtn, { top: insets.top + 10 }]} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroLabel}>SPEECH FLUENCY</Text>
            <Text style={styles.heroTitle}>DAF</Text>
          </View>
        </View>
      )}

      {(stage === 2 || stage === 3 || stage === 4) && (
        <View style={[styles.flatHeader, { paddingTop: insets.top + 8 }]}>
          {stage === 4 ? (
            <View style={{ width: 24 }} />
          ) : (
            <Pressable onPress={() => {
              if (stage === 3) { handleEndSession(); return; }
              if (stage === 0) { router.back(); return; }
              setStage(Math.max(0, stage - 1));
            }}>
              <Ionicons name="chevron-back" size={24} color={colors.textDark} />
            </Pressable>
          )}
          <Text style={styles.flatHeaderTitle}>
            {stage === 2 ? 'Configure DAF' : stage === 3 ? 'DAF Active' : 'Results'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      )}

      {stage === 0 && renderStage0()}
      {stage === 1 && renderStage1()}
      {stage === 2 && renderStage2()}
      {stage === 3 && renderStage3()}
      {stage === 4 && renderStage4()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },

  heroBlock: { position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  backBtn: { position: 'absolute', top: 14, left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  heroTextBlock: { position: 'absolute', bottom: 16, left: 20 },
  heroLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.tiny, color: 'rgba(255,255,255,0.8)', letterSpacing: 1.5, marginBottom: 2 },
  heroTitle: { fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xxl, color: colors.white },

  flatHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacingX.md, paddingBottom: spacingY.sm, borderBottomWidth: 1, borderBottomColor: colors.libraryBorder },
  flatHeaderTitle: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium, color: colors.textDark },

  gateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacingX.lg },
  gateIcon: { marginBottom: spacingY.md },
  gateTitle: { fontSize: fontSizes.xl, fontFamily: FONTS.primaryBold, color: colors.textDark, marginBottom: spacingY.sm },
  gateBody: { fontSize: fontSizes.small, fontFamily: FONTS.primary, color: colors.textMuted, textAlign: 'center', marginBottom: spacingY.xl, lineHeight: 22 },
  gatePrimaryBtn: { backgroundColor: colors.secondary, borderRadius: radii.pill, paddingVertical: spacingY.sm, paddingHorizontal: spacingX.xxl, marginBottom: spacingY.sm },
  gatePrimaryText: { fontSize: fontSizes.medium, fontFamily: FONTS.primaryBold, color: colors.white },
  gateSecondaryBtn: { padding: spacingY.sm },
  gateSecondaryText: { color: colors.textMuted, fontFamily: FONTS.primary, fontSize: fontSizes.small },

  infoBox: { backgroundColor: colors.libraryCard, padding: spacingX.md, borderRadius: radii.lg, width: '100%', marginTop: spacingY.md, borderWidth: 1, borderColor: colors.libraryBorder },
  infoBoxHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacingY.xs, gap: 6 },
  infoBoxTitle: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.textDark },
  infoBoxText: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted, lineHeight: 20, marginBottom: spacingY.md },
  infoBoxBtn: { backgroundColor: colors.secondary + '22', alignSelf: 'flex-start', paddingHorizontal: spacingX.md, paddingVertical: spacingY.xs, borderRadius: radii.pill },
  infoBoxBtnText: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.secondary },

  stageScroll: { flex: 1 },
  stageContent: { padding: spacingX.md, paddingBottom: spacingY.xxl },
  stageContainer: { flex: 1, paddingHorizontal: spacingX.md, paddingTop: spacingY.md },
  scrollContent: { paddingBottom: spacingY.xxl },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: spacingY.md },
  dots: { flexDirection: 'row', gap: spacingX.xs, marginHorizontal: spacingX.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.libraryBorder },
  dotActive: { backgroundColor: colors.secondary },

  calibTitle: { fontSize: fontSizes.large, fontFamily: FONTS.primaryBold, color: colors.textDark, marginBottom: spacingY.md },
  section: { marginBottom: spacingY.lg },
  sectionTitle: { fontSize: fontSizes.medium, fontFamily: FONTS.primaryBold, color: colors.textDark },
  sectionSub: { fontSize: fontSizes.small, fontFamily: FONTS.primary, color: colors.textMuted, marginBottom: spacingY.sm },
  sliderPill: { alignSelf: 'center', backgroundColor: colors.secondary, borderRadius: radii.pill, paddingHorizontal: spacingX.sm, paddingVertical: 2, marginBottom: -10, zIndex: 1 },
  sliderPillText: { fontSize: fontSizes.small, fontFamily: FONTS.primaryBold, color: colors.white },
  slider: { width: '100%', height: 40 },
  chipsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacingY.sm },
  presetChip: { borderRadius: radii.pill, borderWidth: 1, borderColor: colors.libraryBorder, paddingHorizontal: spacingX.sm, paddingVertical: spacingY.xxs },
  presetChipActive: { borderColor: colors.secondary, backgroundColor: colors.secondary + '22' },
  presetChipText: { color: colors.textMuted, fontSize: fontSizes.tiny },
  presetChipTextActive: { color: colors.secondary },

  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacingY.lg },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pulseDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  headerBadge: { backgroundColor: colors.secondary + '22', borderRadius: radii.pill, paddingHorizontal: spacingX.sm, paddingVertical: 4 },
  headerBadgeText: { fontSize: fontSizes.small, fontFamily: FONTS.primaryBold, color: colors.secondary },

  timerContainer: { alignItems: 'center', marginBottom: spacingY.md },
  timerText: { fontSize: fontSizes.xxl, fontFamily: FONTS.primaryBlack, color: colors.textDark },
  progressBarBg: { width: '60%', height: hp("0.5%"), backgroundColor: colors.libraryBorder, borderRadius: radii.pill, marginTop: spacingY.sm, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.secondary },

  passageCard: { backgroundColor: colors.libraryCard, borderRadius: radii.lg, padding: spacingX.md, marginVertical: spacingY.md },
  passageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacingY.sm },
  passageHeaderTitle: { fontSize: fontSizes.tiny, fontFamily: FONTS.primaryBold, color: colors.textMuted },
  passageText: { fontSize: fontSizes.medium, fontFamily: FONTS.primary, color: colors.textDark, lineHeight: hp("3.2%") },
  wordHighlighted: { backgroundColor: colors.secondary + '33', borderRadius: radii.sm },

  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: spacingY.md },
  quickAdjust: { flexDirection: 'row', alignItems: 'center', gap: spacingX.sm },
  quickAdjustBtn: { color: colors.textMuted, fontSize: fontSizes.small },
  quickAdjustVal: { fontSize: fontSizes.small, fontFamily: FONTS.primaryBold, color: colors.secondary },
  muteBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.librarySurface, justifyContent: 'center', alignItems: 'center' },
  muteBtnActive: { borderWidth: 2, borderColor: colors.secondary },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: spacingY.md },

  resultsHeader: { alignItems: 'center', marginVertical: spacingY.lg },
  resultsTitle: { fontSize: fontSizes.xxl, fontFamily: FONTS.primaryBlack, color: colors.textDark, marginTop: spacingY.sm },
  resultsSub: { fontSize: fontSizes.small, fontFamily: FONTS.primary, color: colors.textMuted },
  resultsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacingX.sm, justifyContent: 'center', marginBottom: spacingY.md },

  primaryActionBtn: { backgroundColor: colors.secondary, borderRadius: radii.pill, paddingVertical: spacingY.sm, alignItems: 'center', marginTop: spacingY.md },
  primaryActionText: { color: colors.white, fontSize: fontSizes.medium, fontFamily: FONTS.primaryBold }
});
