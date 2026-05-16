import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface SelfAdvocacyStepProps {
  exercise: Exercise;
  onContinue: () => void;
}

const SelfAdvocacyStep: React.FC<SelfAdvocacyStepProps> = ({ exercise, onContinue }) => {
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
      return <AdvocacyPage0 content={content} onContinue={() => goToSubStep(1)} />;
    } else {
      return <AdvocacyPage1 content={content} onContinue={onContinue} />;
    }
  };

  return <Animated.View style={fadeStyle}>{renderContent()}</Animated.View>;
};

// --- Sub-step 0: Guidelines ---
const AdvocacyPage0: React.FC<{ content: any; onContinue: () => void }> = ({ content, onContinue }) => {
  const dosAndDonts = content.dos_and_donts as { do: string[]; dont: string[] } | undefined;

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageHeader}>Self-Disclosure</Text>
        <Text style={styles.descriptionText}>Before you practice, let's review why this helps and some simple guidelines.</Text>

        {!!content.why_disclosure_helps && (
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>{String(content.why_disclosure_helps)}</Text>
          </View>
        )}

        {dosAndDonts && (
          <View style={styles.dosRow}>
            <View style={[styles.dosCard, styles.doCardBg]}>
              <Text style={styles.dosTitle}>Do</Text>
              {dosAndDonts.do.map((item, i) => (
                <View key={i} style={styles.doItem}>
                  <View style={[styles.bullet, { backgroundColor: colors.success }]} />
                  <Text style={styles.doText}>{item}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.dosCard, styles.dontCardBg]}>
              <Text style={styles.dosTitle}>Don't</Text>
              {dosAndDonts.dont.map((item, i) => (
                <View key={i} style={styles.doItem}>
                  <View style={[styles.bullet, { backgroundColor: colors.errorLight }]} />
                  <Text style={styles.doText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ flexGrow: 1 }} />
        <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />
      </ScrollView>
    </View>
  );
};

// --- Sub-step 1: Practice ---
const AdvocacyPage1: React.FC<{ content: any; onContinue: () => void }> = ({ content, onContinue }) => {
  const disclosureTypes = content.types_of_disclosure as Array<{ type: string; examples: string[] }> | undefined;
  
  const [practiceSheet, setPracticeSheet] = useState<{ statement: string; count: number } | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const sheetY = useSharedValue(SCREEN_H);

  const openPractice = (statement: string) => {
    setPracticeSheet({ statement, count: 0 });
    sheetY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.back(1.1)) });
  };

  const closePractice = () => {
    sheetY.value = withTiming(SCREEN_H, { duration: 250 });
    if (practiceSheet && practiceSheet.count >= 5) {
      setCompleted(prev => ({ ...prev, [practiceSheet.statement]: true }));
    }
    setTimeout(() => setPracticeSheet(null), 300);
  };

  const tapMic = () => {
    if (!practiceSheet) return;
    const next = practiceSheet.count + 1;
    setPracticeSheet({ ...practiceSheet, count: Math.min(next, 5) });
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

  const CARD_W = SCREEN_W * 0.75;

  return (
    <View style={styles.page}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageHeader}>Practice Disclosure</Text>
        <Text style={styles.descriptionText}>
          Swipe through the types of disclosure below. Tap the microphone icon next to an example to practice it aloud.
        </Text>

        {disclosureTypes && (
          <View style={styles.carouselSection}>
            <FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_W + 12}
              decelerationRate="fast"
              data={disclosureTypes}
              keyExtractor={item => item.type}
              renderItem={({ item }) => (
                <View style={[styles.disclosureCard, { width: CARD_W }]}>
                  <Text style={styles.disclosureType}>{item.type}</Text>
                  {item.examples.map((ex, i) => {
                    const isDone = !!completed[ex];
                    return (
                      <View key={i} style={styles.exampleRow}>
                        <Text style={styles.exampleText}>{ex}</Text>
                        {isDone ? (
                          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                        ) : (
                          <Pressable onPress={() => openPractice(ex)} style={styles.practiceBtn}>
                            <Ionicons name="mic" size={16} color={colors.white} />
                          </Pressable>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            />
          </View>
        )}

        <View style={{ flexGrow: 1 }} />
        <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />
      </ScrollView>

      {practiceSheet && (
        <View style={styles.backdropContainer}>
          <Pressable style={styles.backdrop} onPress={closePractice} />
          <Animated.View style={[styles.sheet, sheetStyle]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Practice</Text>
              <Pressable onPress={closePractice} style={styles.closeIconBtn}>
                <Ionicons name="close" size={24} color={colors.textDark} />
              </Pressable>
            </View>
            <View style={styles.sheetContent}>
              <Text style={styles.sheetStatement}>"{practiceSheet.statement}"</Text>
              <PulseMic onPress={tapMic} isActive={practiceSheet.count < 5} />
              <Text style={styles.practiceCounter}>
                Repetition {practiceSheet.count} of 5
              </Text>
              <Text style={styles.practiceHint}>
                {practiceSheet.count < 5 ? "Tap the mic for each repetition" : "Great job! You've completed 5 reps."}
              </Text>
              <Pressable 
                onPress={closePractice} 
                style={[styles.doneBtn, practiceSheet.count < 5 ? styles.doneBtnOutline : null]}
              >
                {practiceSheet.count >= 5 && <Ionicons name="checkmark" size={18} color={colors.white} />}
                <Text style={[styles.doneBtnText, practiceSheet.count < 5 ? {color: colors.secondary} : null]}>
                  {practiceSheet.count < 5 ? "Done for now" : "Complete"}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const PulseMic: React.FC<{ onPress: () => void; isActive: boolean }> = ({
  onPress, isActive,
}) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 700 }),
          withTiming(1.0, { duration: 700 }),
        ),
        -1, true,
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isActive, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable onPress={onPress} style={styles.sheetMic}>
        <Ionicons name="mic" size={32} color={colors.white} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingTop: spacingY.xl, paddingHorizontal: spacingX.lg, paddingBottom: 100 },
  pageHeader: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  descriptionText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: spacingY.lg,
  },
  quoteCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.categorySelfAdvocacy,
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
  carouselSection: { marginBottom: spacingY.md },
  disclosureCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacingX.md,
    marginRight: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  disclosureType: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacingY.sm,
    backgroundColor: colors.primary_10,
    borderRadius: radii.md,
    padding: spacingX.sm,
  },
  exampleText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
    lineHeight: 20,
  },
  practiceBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dosRow: { flexDirection: 'column', gap: 10 },
  dosCard: { borderRadius: radii.lg, padding: spacingX.md },
  doCardBg: { backgroundColor: colors.successBg },
  dontCardBg: { backgroundColor: colors.errorLight + '15' },
  dosTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  doItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: spacingY.xs,
  },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  doText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
    lineHeight: 20,
  },
  backdropContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingBottom: 40,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.lg,
    paddingBottom: spacingY.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  closeIconBtn: {
    padding: 4,
  },
  sheetContent: {
    padding: spacingX.lg,
    alignItems: 'center',
    paddingBottom: spacingY.xxl,
  },
  sheetStatement: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacingY.lg,
    lineHeight: 30,
    fontStyle: 'italic',
  },
  sheetMic: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY.md,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  practiceCounter: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: 4,
  },
  practiceHint: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginBottom: spacingY.lg,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacingX.xl,
    paddingVertical: spacingY.md,
    borderRadius: radii.pill,
    minWidth: 150,
    justifyContent: 'center',
  },
  doneBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  doneBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});

export default SelfAdvocacyStep;
