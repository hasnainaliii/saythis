import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, RefreshCw } from "lucide-react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from "../../theme/Theme";
import { useAiFeedback } from "../../hooks/useAiFeedback";
import { FeedbackLoading } from "../../components/feedback/FeedbackLoading";
import { FeedbackResponse } from "../../components/feedback/FeedbackResponse";
import { FeedbackEmpty } from "../../components/feedback/FeedbackEmpty";
import statsService from "../../services/statsService";

export default function AiFeedbackScreen() {
  const router = useRouter();
  const { feedback, loading, error, loadCachedFeedback, canRequestToday, generateFeedback } = useAiFeedback();
  const [hasData, setHasData] = useState(false);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadCachedFeedback();
      try {
        const stats = await statsService.getStats();
        const ws = stats.wellness_summary;
        const ss = stats.stutter_summary;
        const ts = stats.tool_stats?.combined;
        const tracked = (ws?.days_tracked ?? 0) > 0;
        const analyzed = (ss?.total_analyses ?? 0) > 0;
        const practiced = ((ts as any)?.total_sessions ?? 0) > 0;
        setHasData(tracked || analyzed || practiced);
      } catch {
        setHasData(false);
      }
      const canRequest = await canRequestToday();
      setAlreadyUsed(!canRequest);
      setInitialLoading(false);
    };
    init();
  }, []);

  const handleGenerate = async () => {
    const canRequest = await canRequestToday();
    if (!canRequest) {
      Alert.alert("Daily Limit", "You can only generate one AI feedback per day. Come back tomorrow!");
      return;
    }
    await generateFeedback();
    setAlreadyUsed(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textDark} />
        </Pressable>
        <Text style={styles.title}>AI Feedback</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {initialLoading ? (
          <FeedbackLoading />
        ) : loading ? (
          <FeedbackLoading />
        ) : error ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={handleGenerate}>
              <RefreshCw size={16} color={colors.white} />
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        ) : feedback ? (
          <>
            <FeedbackResponse response={feedback.response} generatedAt={feedback.generatedAt} />
            {alreadyUsed && (
              <Text style={styles.limitNote}>
                You've used your daily AI feedback. Check back tomorrow for fresh insights!
              </Text>
            )}
          </>
        ) : (
          <FeedbackEmpty onGenerate={handleGenerate} hasData={hasData} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  errorWrap: {
    alignItems: "center",
    paddingVertical: spacingY.xxl,
    paddingHorizontal: spacingX.lg,
  },
  errorText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacingY.lg,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.categorySelfAwareness,
    paddingVertical: spacingY.sm,
    paddingHorizontal: spacingX.xl,
    borderRadius: radii.pill,
  },
  retryText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  limitNote: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacingY.lg,
    paddingHorizontal: spacingX.xl,
  },
});
