import React, { useState } from 'react';
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
  const disclosureTypes = content.types_of_disclosure as
    | Array<{ type: string; examples: string[] }>
    | undefined;
  const dosAndDonts = content.dos_and_donts as
    | { do: string[]; dont: string[] }
    | undefined;

  const [practiceSheet, setPracticeSheet] = useState<{
    statement: string;
    count: number;
  } | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const sheetY = useSharedValue(SCREEN_H);

  const openPractice = (statement: string) => {
    setPracticeSheet({ statement, count: 0 });
    sheetY.value = withTiming(0, { duration: 300 });
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
    setPracticeSheet({ ...practiceSheet, count: next });
    if (next >= 5) {
      setCompleted(prev => ({ ...prev, [practiceSheet.statement]: true }));
    }
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

  const CARD_W = SCREEN_W * 0.75;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {!!content.why_disclosure_helps && (
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>{String(content.why_disclosure_helps)}</Text>
          </View>
        )}

        {disclosureTypes && (
          <View style={styles.carouselSection}>
            <Text style={styles.sectionTitle}>Disclosure Types</Text>
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
                          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        ) : (
                          <Pressable onPress={() => openPractice(ex)} style={styles.practiceBtn}>
                            <Ionicons name="play" size={14} color={colors.white} />
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
        <HoldToContinue onComplete={onContinue} accent={colors.categorySelfAdvocacy} />
      </ScrollView>

      {practiceSheet && (
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.sheetContent}>
            <Text style={styles.sheetStatement}>{practiceSheet.statement}</Text>
            <PulseMic onPress={tapMic} isActive={practiceSheet.count < 5} />
            <Text style={styles.practiceCounter}>
              Practice {practiceSheet.count} / 5
            </Text>
            <Pressable onPress={closePractice} style={styles.doneBtn}>
              <Ionicons name="checkmark" size={18} color={colors.white} />
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
          </View>
        </Animated.View>
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
  container: { flex: 1 },
  scroll: { paddingTop: spacingY.xl, paddingHorizontal: spacingX.lg, paddingBottom: 100 },
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
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dosRow: { flexDirection: 'row', gap: 10 },
  dosCard: { flex: 1, borderRadius: radii.lg, padding: spacingX.sm },
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
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetContent: {
    padding: spacingX.lg,
    alignItems: 'center',
    paddingBottom: spacingY.xxl,
  },
  sheetStatement: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacingY.lg,
    lineHeight: 30,
  },
  sheetMic: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY.md,
  },
  practiceCounter: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    marginBottom: spacingY.md,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacingX.xl,
    paddingVertical: spacingY.sm,
    borderRadius: radii.xl,
  },
  doneBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  bottomBar: {
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.sm,
    paddingBottom: spacingY.lg,
  },
  continueFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.secondary,
    height: 48,
    borderRadius: radii.xl,
  },
  continueFullBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});

export default SelfAdvocacyStep;
