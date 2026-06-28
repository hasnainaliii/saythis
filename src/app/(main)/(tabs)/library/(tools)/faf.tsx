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

import { useFAFEngine } from '@/src/hooks/useFAFEngine';
import { useSessionTimer } from '@/src/hooks/useSessionTimer';
import { saveSessionToBackend } from '@/src/utils/toolSessionApi';
import { practicePassages } from '@/src/constants/practicePassages';

const fafHtml = `
  <!DOCTYPE html>
  <html>
  <body>
  <script>
  let audioCtx, source, stream;
  let semitones = -3;
  let isActive = false;
  let scriptProcessor;

  const BUFFER_SECONDS = 0.1;
  let nextTime = 0;

  function semitonesToRate(st) {
    return Math.pow(2, st / 12);
  }

  async function startFAF() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }});
      audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
      source = audioCtx.createMediaStreamSource(stream);

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
      
      let inputBuffer = [];
      const sampleRate = audioCtx.sampleRate;
      const bufferSize = Math.round(BUFFER_SECONDS * sampleRate);

      scriptProcessor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        inputBuffer.push(...input);

        if (inputBuffer.length >= bufferSize) {
          const chunk = inputBuffer.splice(0, bufferSize);
          const rate = semitonesToRate(semitones);
          playPitchShifted(chunk, rate);
        }
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(audioCtx.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a,b)=>a+b,0)/dataArray.length;
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type:'amplitude', value: avg/255
        }));
      }, 50);

      nextTime = audioCtx.currentTime + 0.1;
      isActive = true;
      window.ReactNativeWebView.postMessage(JSON.stringify({ type:'ready' }));
    } catch(err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', value: err.message || 'Unknown error starting FAF' }));
    }
  }

  function playPitchShifted(samples, rate) {
    const sampleRate = audioCtx.sampleRate;
    const newLength = Math.round(samples.length / rate);
    const buffer = audioCtx.createBuffer(1, newLength, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < newLength; i++) {
      const pos = i * rate;
      const i0 = Math.floor(pos);
      const i1 = Math.min(i0+1, samples.length-1);
      const frac = pos - i0;
      data[i] = samples[i0] * (1-frac) + samples[i1] * frac;
    }
    const bufNode = audioCtx.createBufferSource();
    bufNode.buffer = buffer;
    bufNode.connect(audioCtx.destination);
    const startAt = Math.max(nextTime, audioCtx.currentTime + 0.02);
    bufNode.start(startAt);
    nextTime = startAt + buffer.duration;
  }

  function stopFAF() {
    if (scriptProcessor) { scriptProcessor.disconnect(); scriptProcessor = null; }
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (audioCtx) audioCtx.close();
    isActive = false;
    window.ReactNativeWebView.postMessage(JSON.stringify({ type:'stopped' }));
  }

  function setSemitones(st) {
    semitones = st;
    window.ReactNativeWebView.postMessage(JSON.stringify({ type:'pitch_updated', value: st }));
  }

  document.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.cmd === 'start') startFAF();
    if (msg.cmd === 'stop') stopFAF();
    if (msg.cmd === 'setSemitones') setSemitones(msg.value);
  });
  </script>
  </body>
  </html>
`;

const convoPrompts = [
  "Tell me about your day so far.",
  "Describe your favorite place you've visited.",
  "What are your plans for this week?",
  "Tell me about something you are proud of.",
  "Describe your home or neighborhood."
];

export default function FAFScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState(0); 
  const [currentCard, setCurrentCard] = useState(0);
  
  const [pitchDirection, setPitchDirection] = useState<'down'|'up'>('down');
  const [shiftAmount, setShiftAmount] = useState(3);
  const [breathingDone, setBreathingDone] = useState(false);
  const [pitchAdjustments, setPitchAdjustments] = useState(0);
  const [passageIndex, setPassageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showNoEarphonesInfo, setShowNoEarphonesInfo] = useState(false);
  const [mode, setMode] = useState<'reading'|'conversation'>('reading');

  const { webViewRef, amplitude, isEngineReady, isEngineStopped, startEngine, stopEngine, setSemitones, onMessage } = useFAFEngine();
  const { elapsedSeconds, elapsedFormatted, estimatedWords, resetTimer } = useSessionTimer(isEngineReady, mode === 'conversation');

  const actualSemitones = pitchDirection === 'down' ? -shiftAmount : shiftAmount;

  useEffect(() => {
    if (isEngineStopped && stage === 3) {
      setStage(4);
    }
  }, [isEngineStopped, stage]);

  const requestAudioPermission = async () => {
    const { status } = await requestRecordingPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Microphone access is required for FAF.');
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
      setSemitones(actualSemitones);
    }
  };

  const handleTestSettings = async () => {
    const granted = await requestAudioPermission();
    if (granted) {
      startEngine();
      setSemitones(actualSemitones);
      setTimeout(() => {
        stopEngine();
        Alert.alert("Settings Applied", "Test complete.");
      }, 3000);
    }
  };

  const handleEndSession = () => {
    Alert.alert("End session early?", "Your progress will be saved.", [
      { text: "Cancel", style: "cancel" },
      { text: "End Session", style: "destructive", onPress: stopEngine }
    ]);
  };

  const adjustPitch = (change: number) => {
    let newShift = shiftAmount + change;
    let newDir = pitchDirection;
    if (newShift < 1) {
      newDir = pitchDirection === 'down' ? 'up' : 'down';
      newShift = 1;
    } else if (newShift > 6) {
      newShift = 6;
    }
    setShiftAmount(newShift);
    setPitchDirection(newDir);
    setSemitones(newDir === 'down' ? -newShift : newShift);
    setPitchAdjustments(prev => prev + 1);
  };

  const handleSaveResult = async (rating: number | null) => {
    const stats = {
      toolType: 'FAF' as const,
      startedAt: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      pitchDirection,
      pitchSemitones: shiftAmount,
      mode,
      estimatedWords,
      selfRating: rating,
      pitchAdjustments,
    };
    try {
      await saveSessionToBackend(stats);
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
        FAF plays your pitch-shifted voice into your ears. Without earphones, you'll hear your original voice mixed with the shifted one, reducing the effect.
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
          <Text style={styles.infoBoxText}>You can use FAF with speakers in a quiet room at low volume, but the choral effect is much stronger with earphones.</Text>
          <Pressable style={styles.infoBoxBtn} onPress={() => setStage(1)}>
            <Text style={styles.infoBoxBtnText}>Continue anyway</Text>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );

  const cards = [
    {
      icon: <Ionicons name="musical-notes-outline" size={28} color={colors.secondary} />,
      title: "Frequency Altered Feedback",
      body: "Your voice is shifted in pitch and played back instantly. Your brain interprets this as speaking in unison with someone else — the 'choral effect' that naturally produces fluent speech.",
      highlight: "Studies show 40–70% reduction in stuttering moments during FAF sessions"
    },
    {
      step: 2,
      icon: <Ionicons name="flask-outline" size={28} color={colors.secondary} />,
      title: "Why choral speech works",
      body: "When we speak with others, the parts of the brain responsible for self-monitoring become less active. FAF mimics this neurologically by making your voice sound slightly different — unfamiliar enough to reduce over-monitoring without affecting comprehension."
    },
    {
      step: 3,
      icon: <Ionicons name="settings-outline" size={28} color={colors.secondary} />,
      title: "Finding your setting",
      body: "Try a downward shift first (most people prefer it). Speak naturally at your normal pace — do not slow down intentionally. The effect is strongest when you speak conversationally, not when you read robotically.",
      highlight: "Use for 5–10 minutes daily for best results"
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
      <Text style={styles.calibTitle}>Set Your Pitch Shift</Text>
      
      <View style={styles.section}>
        <View style={styles.dirCards}>
          <Pressable 
            style={[styles.dirCard, pitchDirection === 'down' ? styles.dirCardActive : {}]}
            onPress={() => setPitchDirection('down')}
          >
            <Ionicons name="arrow-down-circle" size={36} color={pitchDirection === 'down' ? colors.secondary : colors.textMuted} />
            <Text style={styles.dirCardLabel}>Lower pitch</Text>
            <Text style={styles.dirCardSub}>Preferred by most users</Text>
          </Pressable>

          <Pressable 
            style={[styles.dirCard, pitchDirection === 'up' ? styles.dirCardActive : {}]}
            onPress={() => setPitchDirection('up')}
          >
            <Ionicons name="arrow-up-circle" size={36} color={pitchDirection === 'up' ? colors.secondary : colors.textMuted} />
            <Text style={styles.dirCardLabel}>Higher pitch</Text>
            <Text style={styles.dirCardSub}>Some find this more natural</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shift Amount</Text>
        <Text style={styles.sectionSub}>How much your voice pitch changes</Text>
        
        <View style={styles.sliderPill}>
          <Text style={styles.sliderPillText}>{pitchDirection === 'down' ? '−' : '+'}{shiftAmount} semitones</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={6}
          step={1}
          value={shiftAmount}
          onValueChange={setShiftAmount}
          minimumTrackTintColor={colors.secondary}
          maximumTrackTintColor={colors.libraryBorder}
          thumbTintColor={colors.secondary}
        />
        <View style={styles.keyboardGraphic}>
          <View style={styles.keyboardKeys}>
            {Array.from({length: 8}).map((_, i) => <View key={i} style={styles.whiteKey} />)}
          </View>
          <View style={[styles.keyDot, { left: '40%', backgroundColor: colors.textDark }]} />
          <Text style={[styles.keyLabel, { left: '40%', top: 25 }]}>Original</Text>
          <View style={[styles.keyDot, { 
            left: pitchDirection === 'down' ? `${40 - shiftAmount * 4}%` : `${40 + shiftAmount * 4}%`,
            backgroundColor: colors.secondary 
          }]} />
          <Text style={[styles.keyLabel, { left: pitchDirection === 'down' ? `${40 - shiftAmount * 4}%` : `${40 + shiftAmount * 4}%`, top: 40 }]}>Shifted</Text>
          <Text style={[styles.keyGapLabel, { left: pitchDirection === 'down' ? `${40 - shiftAmount * 2}%` : `${40 + shiftAmount * 2}%` }]}>
            {pitchDirection === 'down' ? '−' : '+'}{shiftAmount}st
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.testBtn} onPress={handleTestSettings}>
          <Text style={styles.testBtnText}>Test my settings</Text>
        </Pressable>
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
        label="Hold to begin FAF session" 
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
          <Text style={styles.headerTitle}>FAF Active</Text>
          <Animated.View style={[styles.pulseDot, { backgroundColor: colors.categorySelfAwareness }]} />
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{actualSemitones > 0 ? '+' : ''}{actualSemitones}st</Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{elapsedFormatted}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min(100, (elapsedSeconds / 600) * 100)}%` }]} />
        </View>
      </View>

      <WaveformVisualizer isActive={isEngineReady && !isMuted} amplitude={amplitude} color={colors.secondary} />

      <View style={styles.modeToggle}>
        <Pressable onPress={() => setMode('reading')} style={[styles.modeBtn, mode === 'reading' && styles.modeBtnActive]}>
          <Text style={[styles.modeBtnText, mode === 'reading' && styles.modeBtnTextActive]}>Reading Mode</Text>
        </Pressable>
        <Pressable onPress={() => setMode('conversation')} style={[styles.modeBtn, mode === 'conversation' && styles.modeBtnActive]}>
          <Text style={[styles.modeBtnText, mode === 'conversation' && styles.modeBtnTextActive]}>Conversation Mode</Text>
        </Pressable>
      </View>

      {mode === 'reading' ? (
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
      ) : (
        <View style={styles.passageCard}>
          <View style={styles.passageHeader}>
            <Text style={styles.passageHeaderTitle}>PROMPT</Text>
          </View>
          <Text style={styles.promptText}>
            {convoPrompts[Math.floor((elapsedSeconds / 45) % convoPrompts.length)]}
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(100, ((elapsedSeconds % 45) / 45) * 100)}%` }]} />
          </View>
        </View>
      )}

      <View style={styles.controlRow}>
        <View style={styles.quickAdjust}>
          <Pressable onPress={() => adjustPitch(-1)}><Text style={styles.quickAdjustBtn}>−1st</Text></Pressable>
          <Text style={styles.quickAdjustVal}>{actualSemitones > 0 ? '+' : ''}{actualSemitones}st</Text>
          <Pressable onPress={() => adjustPitch(1)}><Text style={styles.quickAdjustBtn}>+1st</Text></Pressable>
        </View>

        <Pressable style={[styles.muteBtn, !isMuted && styles.muteBtnActive]} onPress={() => setIsMuted(!isMuted)}>
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={32} color={isMuted ? colors.textDisabled : colors.secondary} />
        </Pressable>

        <Ionicons name={pitchDirection === 'up' ? "arrow-up-outline" : "arrow-down-outline"} size={28} color={colors.textMuted} />
      </View>

      <View style={styles.statsRow}>
        <StatChip label="Duration" value={elapsedFormatted} />
        <StatChip label="Pitch Shift" value={actualSemitones > 0 ? `+${actualSemitones}` : actualSemitones} unit="st" />
        {mode === 'reading' && <StatChip label="Est. Words" value={estimatedWords} />}
      </View>
    </Animated.View>
  );

  const renderStage4 = () => (
    <Animated.ScrollView entering={FadeIn.duration(300)} style={styles.stageContainer} contentContainerStyle={styles.scrollContent}>
      <Animated.View entering={ZoomIn} style={styles.resultsHeader}>
        <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        <Text style={styles.resultsTitle}>Session Complete!</Text>
        <Text style={styles.resultsSub}>The choral effect was working for you.</Text>
      </Animated.View>

      <View style={styles.resultsGrid}>
        <StatChip label="Duration" value={elapsedFormatted} />
        <StatChip label="Pitch Shift" value={actualSemitones > 0 ? `+${actualSemitones}` : actualSemitones} unit="st" />
        <StatChip label="Mode" value={mode === 'reading' ? 'Reading' : 'Conversation'} />
        {mode === 'reading' && <StatChip label="Est. Words" value={estimatedWords} />}
      </View>

      <SessionRating onRate={(r) => handleSaveResult(r)} onSkip={() => handleSaveResult(null)} />

      <InstructionCard 
        icon={<Ionicons name="chatbubbles-outline" size={28} color={colors.categorySelfAwareness} />}
        title="Real-world Transfer"
        body="Try using FAF when making a real phone call or speaking to someone. Start a conversation while the effect is active, then switch it off mid-conversation and notice how your speech continues."
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
          source={{ html: fafHtml, baseUrl: 'https://localhost' }}
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
            <Text style={styles.heroTitle}>FAF</Text>
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
            {stage === 2 ? 'Configure FAF' : stage === 3 ? 'FAF Active' : 'Results'}
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
  cardContainer: { marginBottom: spacingY.md },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: spacingY.md },
  dots: { flexDirection: 'row', gap: spacingX.xs, marginHorizontal: spacingX.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.libraryBorder },
  dotActive: { backgroundColor: colors.secondary },

  calibTitle: { fontSize: fontSizes.large, fontFamily: FONTS.primaryBold, color: colors.textDark, marginBottom: spacingY.md },
  section: { marginBottom: spacingY.lg },
  sectionTitle: { fontSize: fontSizes.medium, fontFamily: FONTS.primaryBold, color: colors.textDark },
  sectionSub: { fontSize: fontSizes.small, fontFamily: FONTS.primary, color: colors.textMuted, marginBottom: spacingY.sm },

  dirCards: { flexDirection: 'row', justifyContent: 'space-between' },
  dirCard: { width: wp('43%'), height: hp('12%'), borderRadius: radii.lg, paddingHorizontal: spacingX.md, paddingVertical: spacingY.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.libraryBorder, backgroundColor: colors.libraryCard },
  dirCardActive: { borderWidth: 2, borderColor: colors.secondary, backgroundColor: colors.secondary + '22' },
  dirCardLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.textDark, marginTop: 4 },
  dirCardSub: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, color: colors.textMuted, textAlign: 'center' },

  sliderPill: { alignSelf: 'center', backgroundColor: colors.secondary, borderRadius: radii.pill, paddingHorizontal: spacingX.sm, paddingVertical: 2, marginBottom: -10, zIndex: 1 },
  sliderPillText: { fontSize: fontSizes.small, fontFamily: FONTS.primaryBold, color: colors.white },
  slider: { width: '100%', height: 40 },

  keyboardGraphic: { height: hp('8%'), width: '100%', marginTop: spacingY.sm, position: 'relative' },
  keyboardKeys: { flexDirection: 'row', width: '100%', height: '100%', borderWidth: 1, borderColor: colors.libraryBorder, borderRadius: radii.sm, overflow: 'hidden' },
  whiteKey: { flex: 1, borderRightWidth: 1, borderRightColor: colors.libraryBorder, backgroundColor: colors.white },
  keyDot: { width: 10, height: 10, borderRadius: 5, position: 'absolute', top: 10 },
  keyLabel: { position: 'absolute', fontSize: fontSizes.tiny, fontFamily: FONTS.primaryBold, color: colors.textDark },
  keyGapLabel: { position: 'absolute', top: 10, fontSize: fontSizes.tiny, fontFamily: FONTS.primaryBold, color: colors.secondary },

  testBtn: { alignSelf: 'center', paddingHorizontal: spacingX.xl, paddingVertical: spacingY.sm, borderWidth: 1, borderColor: colors.secondary, borderRadius: radii.pill },
  testBtnText: { color: colors.secondary, fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium },

  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacingY.lg },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pulseDot: { width: 10, height: 10, borderRadius: 5 },
  headerBadge: { backgroundColor: colors.secondary + '22', borderRadius: radii.pill, paddingHorizontal: spacingX.sm, paddingVertical: 4 },
  headerBadgeText: { fontSize: fontSizes.small, fontFamily: FONTS.primaryBold, color: colors.secondary },

  timerContainer: { alignItems: 'center', marginBottom: spacingY.md },
  timerText: { fontSize: fontSizes.xxl, fontFamily: FONTS.primaryBlack, color: colors.textDark },
  progressBarBg: { width: '60%', height: hp("0.5%"), backgroundColor: colors.libraryBorder, borderRadius: radii.pill, marginTop: spacingY.sm, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.secondary },

  modeToggle: { flexDirection: 'row', backgroundColor: colors.librarySurface, borderRadius: radii.pill, padding: 4, marginVertical: spacingY.sm },
  modeBtn: { flex: 1, paddingVertical: spacingY.xs, alignItems: 'center', borderRadius: radii.pill },
  modeBtnActive: { backgroundColor: colors.white, shadowColor: colors.black, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  modeBtnText: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted },
  modeBtnTextActive: { fontFamily: FONTS.primaryBold, color: colors.textDark },

  passageCard: { backgroundColor: colors.libraryCard, borderRadius: radii.lg, padding: spacingX.md, marginVertical: spacingY.sm },
  passageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacingY.sm },
  passageHeaderTitle: { fontSize: fontSizes.tiny, fontFamily: FONTS.primaryBold, color: colors.textMuted },
  passageText: { fontSize: fontSizes.medium, fontFamily: FONTS.primary, color: colors.textDark, lineHeight: hp("3.2%") },
  wordHighlighted: { backgroundColor: colors.secondary + '33', borderRadius: radii.sm },
  promptText: { fontSize: fontSizes.large, fontFamily: FONTS.primaryBold, color: colors.textDark, textAlign: 'center', marginVertical: spacingY.md },

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
