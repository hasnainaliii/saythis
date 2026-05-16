import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync, createAudioPlayer, AudioPlayer, setAudioModeAsync } from 'expo-audio';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Exercise } from '../../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';
import { HoldToContinue } from '../HoldToContinue';

interface SelfAwarenessStepProps {
  exercise: Exercise;
  onContinue: () => void;
}

const TAB_LABELS = ['Core Behaviors', 'Physical Tension', 'Emotions'];

const PRACTICE_PHRASES = [
  "I walked to the store today to buy some groceries for dinner. The weather was unexpectedly warm for this time of year.",
  "My favorite part of the weekend is having the time to relax and read a good book. It helps me disconnect from the busy work week.",
  "I'm working on becoming more comfortable with my speech. It takes patience, but I know this practice is helping me build a strong foundation."
];

const SelfAwarenessStep: React.FC<SelfAwarenessStepProps> = ({ exercise, onContinue }) => {
  const content = exercise.content;
  
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

  const renderContent = () => {
    if (subStep === 0) {
      return <AwarenessPage content={content} onContinue={() => goToSubStep(1)} />;
    } else if (subStep >= 1 && subStep <= 3) {
      const phraseIndex = subStep - 1;
      return (
        <RecordingPage 
          key={phraseIndex}
          phrase={PRACTICE_PHRASES[phraseIndex]} 
          sessionIndex={phraseIndex}
          onContinue={() => {
            if (subStep < 3) {
              goToSubStep(subStep + 1);
            } else {
              onContinue();
            }
          }} 
        />
      );
    }
    return null;
  };

  return <Animated.View style={fadeStyle}>{renderContent()}</Animated.View>;
};

// --- Sub-step 0: Awareness Page ---
const AwarenessPage: React.FC<{ content: any; onContinue: () => void }> = ({ content, onContinue }) => {
  const observations = content.what_to_observe as Array<{ category: string; items: string[] }> | undefined;
  const [activeTab, setActiveTab] = useState(0);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  const toggleFlag = (key: string) => {
    setFlagged(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentItems = observations?.[activeTab]?.items || [];

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>What to Observe</Text>
          <View style={styles.tabRow}>
            {TAB_LABELS.map((label, i) => (
              <Pressable
                key={label}
                onPress={() => setActiveTab(i)}
                style={[styles.tab, i === activeTab && styles.tabActive]}
              >
                <Text style={[styles.tabText, i === activeTab && styles.tabTextActive]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.chipsWrap}>
            {currentItems.map((item, i) => {
              const key = `${activeTab}-${i}`;
              const isFlagged = !!flagged[key];
              return (
                <Pressable
                  key={key}
                  onPress={() => toggleFlag(key)}
                  style={[styles.observeChip, isFlagged && styles.observeChipFlagged]}
                >
                  <Text style={styles.observeChipText}>{item}</Text>
                  {isFlagged && (
                    <Ionicons name="checkmark-circle" size={14} color={colors.secondary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {!!content.why_awareness && (
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>{String(content.why_awareness)}</Text>
          </View>
        )}

        <View style={{ flexGrow: 1 }} />
        <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />
      </ScrollView>
    </View>
  );
};

// --- Sub-step 1-3: Recording Page ---
type Recording = { id: string; duration: number; date: Date; uri: string };

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const RecordingPage: React.FC<{ phrase: string; sessionIndex: number; onContinue: () => void }> = ({ phrase, sessionIndex, onContinue }) => {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [unsavedDuration, setUnsavedDuration] = useState<number | null>(null);
  const [unsavedUri, setUnsavedUri] = useState<string | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [player, setPlayer] = useState<AudioPlayer | null>(null);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const micScale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      micScale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 700 }),
          withTiming(1.0, { duration: 700 }),
        ),
        -1, true,
      );
      intervalRef.current = setInterval(() => setRecordTime(p => p + 1), 1000);
    } else {
      micScale.value = withTiming(1, { duration: 200 });
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRecording, micScale]);

  useEffect(() => {
    return () => {
      if (player) {
        player.remove();
      }
    };
  }, [player]);

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const handleStartRecording = async () => {
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (permission.status === 'granted') {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
          interruptionMode: 'mixWithOthers',
          shouldPlayInBackground: true,
        });
        
        try {
          await recorder.prepareToRecordAsync();
        } catch (e) {
          // Ignore if already prepared
          console.log('Recorder already prepared', e);
        }
        
        recorder.record();
        setIsRecording(true);
        setRecordTime(0);
        setUnsavedDuration(null);
        setUnsavedUri(null);
      } else {
        alert('Please grant microphone access to record practice sessions.');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      setUnsavedDuration(recordTime);
      setUnsavedUri(uri);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleSave = () => {
    if (unsavedDuration !== null && unsavedUri) {
      const newRec: Recording = {
        id: Math.random().toString(36).substr(2, 9),
        duration: unsavedDuration,
        date: new Date(),
        uri: unsavedUri,
      };
      setRecordings(prev => [newRec, ...prev]);
      setUnsavedDuration(null);
      setUnsavedUri(null);
    }
  };

  const handleDiscard = () => {
    setUnsavedDuration(null);
    setUnsavedUri(null);
  };

  const stopPlayback = () => {
    if (player) {
      player.pause();
      player.remove();
      setPlayer(null);
      setPlayingId(null);
    }
  };

  const togglePlayback = async (id: string, uri: string) => {
    if (playingId === id) {
      stopPlayback();
    } else {
      stopPlayback();
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: 'mixWithOthers',
          shouldPlayInBackground: true,
        });

        const newPlayer = createAudioPlayer(uri);
        setPlayer(newPlayer);
        setPlayingId(id);
        newPlayer.play();
        
        const rec = recordings.find(r => r.id === id);
        if (rec) {
          setTimeout(() => {
            setPlayingId(prev => {
              if (prev === id) {
                newPlayer.pause();
                newPlayer.remove();
                return null;
              }
              return prev;
            });
          }, Math.max(rec.duration * 1000 + 500, 1000)); // added 500ms buffer
        }
      } catch (err) {
        console.error('Failed to play', err);
        setPlayingId(null);
      }
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.sessionHeaderRow}>
            <Text style={styles.sectionTitle}>Recording Practice</Text>
            <Text style={styles.sessionCountText}>Phrase {sessionIndex + 1} of 3</Text>
          </View>
          <Text style={styles.descriptionText}>
            Read the text below aloud and record your voice. Focus on observing your speech patterns naturally.
          </Text>
          
          <View style={styles.passageBox}>
            <Ionicons name="book-outline" size={20} color={colors.secondary} style={styles.passageIcon} />
            <Text style={styles.passageText}>{phrase}</Text>
          </View>

          <View style={styles.recorderArea}>
            {!isRecording && unsavedDuration === null && (
              <Pressable onPress={handleStartRecording} style={styles.actionButton}>
                <Ionicons name="mic" size={24} color={colors.white} />
                <Text style={styles.actionButtonText}>Start Recording</Text>
              </Pressable>
            )}

            {isRecording && (
              <View style={styles.recordingActiveContainer}>
                <Animated.View style={micStyle}>
                  <View style={styles.micButtonActive}>
                    <Ionicons name="mic" size={32} color={colors.white} />
                  </View>
                </Animated.View>
                <View style={styles.recordingInfo}>
                  <View style={styles.redDot} />
                  <Text style={styles.timerText}>{formatTime(recordTime)}</Text>
                </View>
                <Pressable onPress={handleStopRecording} style={styles.stopButton}>
                  <Ionicons name="stop" size={20} color={colors.error} />
                  <Text style={styles.stopButtonText}>Stop</Text>
                </Pressable>
              </View>
            )}

            {unsavedDuration !== null && !isRecording && (
              <View style={styles.unsavedContainer}>
                <Text style={styles.reviewTitle}>Review Recording</Text>
                <Text style={styles.timerTextLg}>{formatTime(unsavedDuration)}</Text>
                <View style={styles.actionRow}>
                  <Pressable style={styles.discardBtn} onPress={handleDiscard}>
                    <Ionicons name="trash-outline" size={20} color={colors.textDisabled} />
                    <Text style={styles.discardBtnText}>Discard</Text>
                  </Pressable>
                  <Pressable style={styles.saveBtn} onPress={handleSave}>
                    <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
                    <Text style={styles.saveBtnText}>Save Session</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>

        {recordings.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Saved Sessions</Text>
            <View style={styles.recordingsList}>
              {recordings.map((rec, idx) => {
                const isPlaying = playingId === rec.id;
                return (
                  <View key={rec.id} style={styles.recordingItem}>
                    <View style={styles.recordingItemLeft}>
                      <Pressable onPress={() => togglePlayback(rec.id, rec.uri)} style={styles.playBtn}>
                        <Ionicons name={isPlaying ? "stop-circle" : "play-circle"} size={36} color={colors.secondary} />
                      </Pressable>
                      <View>
                        <Text style={styles.recordingItemTitle}>Recording {recordings.length - idx}</Text>
                        <Text style={styles.recordingItemTime}>{rec.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                      </View>
                    </View>
                    <Text style={styles.recordingItemDuration}>{formatTime(rec.duration)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ flexGrow: 1 }} />
        <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingTop: spacingY.xl, paddingHorizontal: spacingX.lg, paddingBottom: 100 },
  card: {
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
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: spacingY.sm },
  tab: {
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.primary10,
  },
  tabActive: { backgroundColor: colors.secondary },
  tabText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  tabTextActive: { color: colors.white },
  chipsWrap: { gap: 8 },
  observeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xs,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.primary10,
    backgroundColor: colors.primary_10,
  },
  observeChipFlagged: {
    backgroundColor: colors.secondary_10 + '33',
    borderColor: colors.secondary,
  },
  observeChipText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  quoteCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.categorySelfAwareness,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacingX.md,
    marginBottom: spacingY.md,
  },
  quoteText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  sessionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY.xs,
  },
  sessionCountText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.secondary,
    backgroundColor: colors.primary10,
    paddingHorizontal: spacingX.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  descriptionText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginBottom: spacingY.md,
    lineHeight: 20,
  },
  passageBox: {
    backgroundColor: colors.primary_10,
    padding: spacingX.md,
    borderRadius: radii.md,
    marginBottom: spacingY.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    flexDirection: 'row',
    gap: 12,
  },
  passageIcon: {
    marginTop: 2,
  },
  passageText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  recorderArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingY.md,
    minHeight: 180,
    backgroundColor: colors.gray,
    borderRadius: radii.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacingX.xl,
    paddingVertical: spacingY.md,
    borderRadius: radii.pill,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  recordingActiveContainer: {
    alignItems: 'center',
    gap: spacingY.md,
  },
  micButtonActive: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  recordingInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    backgroundColor: colors.white,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xs,
    borderRadius: radii.pill,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  timerText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    fontVariant: ['tabular-nums'],
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.error + '22',
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.sm,
    borderRadius: radii.pill,
  },
  stopButtonText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.error,
  },
  unsavedContainer: {
    alignItems: 'center',
    gap: spacingY.md,
    width: '100%',
    paddingHorizontal: spacingX.md,
  },
  reviewTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  timerTextLg: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
    fontVariant: ['tabular-nums'],
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacingX.md,
    width: '100%',
  },
  discardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacingY.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  discardBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDisabled,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacingY.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  recordingsList: {
    gap: spacingY.sm,
    marginTop: spacingY.xs,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacingX.sm,
    backgroundColor: colors.primary10,
    borderRadius: radii.md,
  },
  recordingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playBtn: {
    opacity: 0.9,
  },
  recordingItemTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  recordingItemTime: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
    marginTop: 2,
  },
  recordingItemDuration: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
    marginRight: 8,
  },
});

export default SelfAwarenessStep;
