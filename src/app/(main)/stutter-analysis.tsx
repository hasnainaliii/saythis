import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { useSharedValue, withRepeat, withSequence, withTiming, cancelAnimation, Easing } from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY } from '../../theme/Theme';
import { useStutterStreaming, AUDIO_CAPTURE_HTML } from '../../hooks/useStutterStreaming';
import { ReferenceCard } from '../../components/stutter/ReferenceCard';
import { TranscriptBox } from '../../components/stutter/TranscriptBox';
import { StutterControls } from '../../components/stutter/StutterControls';
import { ScoreDisplay } from '../../components/stutter/ScoreDisplay';

export default function StutterAnalysisScreen() {
  const router = useRouter();
  const pulseOpacity = useSharedValue(1);

  const {
    isRecording, isConnecting, partialText, finalizedLines,
    statusText, result, timeLeft, webViewRef, onWebViewMessage,
    startRecording, stopRecording,
  } = useStutterStreaming();

  const startPulse = useCallback(() => {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1, false
    );
  }, [pulseOpacity]);

  const stopPulse = useCallback(() => {
    cancelAnimation(pulseOpacity);
    pulseOpacity.value = 1;
  }, [pulseOpacity]);

  const handleStart = useCallback(async () => {
    await startRecording();
    startPulse();
  }, [startRecording, startPulse]);

  const handleStop = useCallback(() => {
    stopPulse();
    stopRecording();
  }, [stopRecording, stopPulse]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
        <WebView
          ref={webViewRef}
          source={{ html: AUDIO_CAPTURE_HTML, baseUrl: 'https://localhost' }}
          style={{ height: 1, width: 1 }}
          javaScriptEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          mediaCapturePermissionGrantType="grant"
          originWhitelist={['*']}
          onMessage={onWebViewMessage}
        />
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textDark} />
        </Pressable>
        <Text style={styles.title}>Stutter Analysis</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ReferenceCard />
        <TranscriptBox
          isRecording={isRecording}
          finalizedLines={finalizedLines}
          partialText={partialText}
          pulseOpacity={pulseOpacity}
        />
        <StutterControls
          isRecording={isRecording}
          isConnecting={isConnecting}
          statusText={statusText}
          pulseOpacity={pulseOpacity}
          timeLeft={timeLeft}
          onStart={handleStart}
          onStop={handleStop}
        />
        {result && <ScoreDisplay result={result} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacingX.lg, paddingBottom: 120 },
});
