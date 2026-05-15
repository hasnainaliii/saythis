import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Exercise } from '../../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';
import { HoldToContinue } from '../HoldToContinue';

interface CBTStepProps {
  exercise: Exercise;
  onContinue: () => void;
}

const CYCLE_ITEMS = [
  'Negative Thought', 'Anxiety', 'Tension', 'More Stuttering', 'Reinforces',
];
const CYCLE_BG = [
  colors.secondary_10, colors.primary10, colors.secondary_10,
  colors.primary10, colors.secondary_10,
];

const CBTStep: React.FC<CBTStepProps> = ({ exercise, onContinue }) => {
  const content = exercise.content;
  const reframes = content.common_reframes as
    | { negative: string; balanced: string }[]
    | undefined;
  const distortions = content.cognitive_distortions as
    | { name: string; example: string }[]
    | undefined;

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
    switch (subStep) {
      case 0:
        return <CyclePage onContinue={() => goToSubStep(1)} />;
      case 1:
        return <ReframesPage reframes={reframes} onContinue={() => goToSubStep(2)} />;
      case 2:
        return <DistortionsPage distortions={distortions} onContinue={onContinue} />;
      default:
        return null;
    }
  };

  return <Animated.View style={fadeStyle}>{renderContent()}</Animated.View>;
};

// --- Sub-step 0: The Cycle ---
const CyclePage: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>The Cycle</Text>
          <View style={styles.cycleColumn}>
            {CYCLE_ITEMS.map((item, i) => (
              <CycleNode key={item} label={item} index={i} bg={CYCLE_BG[i]} />
            ))}
          </View>
        </View>

        <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />
      </ScrollView>
    </View>
  );
};

// --- Sub-step 1: Reframes ---
const ReframesPage: React.FC<{
  reframes?: { negative: string; balanced: string }[];
  onContinue: () => void;
}> = ({ reframes, onContinue }) => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const totalReframes = reframes?.length ?? 0;
  const flippedCount = Object.values(flipped).filter(Boolean).length;

  if (!reframes) return <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />;

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.reframeHeader}>
            <Text style={styles.sectionTitle}>Reframe Your Thoughts</Text>
            <Text style={styles.tally}>Reframed {flippedCount} / {totalReframes}</Text>
          </View>

          {reframes.map((item, i) => (
            <FlipCard
              key={i}
              negative={item.negative}
              balanced={item.balanced}
              isFlipped={!!flipped[i]}
              onFlip={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
            />
          ))}
        </View>

        <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />
      </ScrollView>
    </View>
  );
};

// --- Sub-step 2: Cognitive Distortions ---
const DistortionsPage: React.FC<{
  distortions?: { name: string; example: string }[];
  onContinue: () => void;
}> = ({ distortions, onContinue }) => {
  if (!distortions) return <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />;

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Common Thinking Traps</Text>
        
        {distortions.map((item, i) => {
          const opacity = useSharedValue(0);
          const translateY = useSharedValue(10);
          
          useEffect(() => {
            opacity.value = withDelay(i * 80, withTiming(1, { duration: 300 }));
            translateY.value = withDelay(i * 80, withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) }));
          }, [i]);
          
          const anim = useAnimatedStyle(() => ({
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }]
          }));

          return (
            <Animated.View key={i} style={[styles.distortionItem, anim]}>
              <Text style={styles.distortionName}>{item.name}</Text>
              <Text style={styles.distortionExample}>"{item.example}"</Text>
            </Animated.View>
          );
        })}

        <HoldToContinue onComplete={onContinue} accent={colors.categoryCBT} />
      </ScrollView>
    </View>
  );
};

// --- Helper Components ---

const CycleNode: React.FC<{ label: string; index: number; bg: string }> = ({
  label, index, bg,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(15);

  useEffect(() => {
    opacity.value = withDelay(index * 200, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(index * 200, withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }));
  }, [index, opacity, translateY]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.cycleNodeWrapVertical}>
      <Animated.View style={[styles.cycleNodeVertical, { backgroundColor: bg }, anim]}>
        <Text style={styles.cycleLabelVertical}>{label}</Text>
      </Animated.View>
      {index < CYCLE_ITEMS.length - 1 && (
        <Animated.View style={anim}>
          <Ionicons name="arrow-down" size={24} color={colors.textDisabled} style={{ marginVertical: 8 }} />
        </Animated.View>
      )}
    </View>
  );
};

const FlipCard: React.FC<{
  negative: string;
  balanced: string;
  isFlipped: boolean;
  onFlip: () => void;
}> = ({ negative, balanced, isFlipped, onFlip }) => {
  const rotateY = useSharedValue(0);

  useEffect(() => {
    rotateY.value = withTiming(isFlipped ? 180 : 0, {
      duration: 350,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isFlipped, rotateY]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
    backfaceVisibility: 'hidden' as const,
    opacity: rotateY.value > 90 ? 0 : 1,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value - 180}deg` }],
    backfaceVisibility: 'hidden' as const,
    opacity: rotateY.value > 90 ? 1 : 0,
  }));

  return (
    <View style={styles.flipContainer}>
      <Animated.View
        pointerEvents={isFlipped ? 'none' : 'auto'}
        style={[
          styles.flipFace,
          styles.flipFront,
          frontStyle,
          { position: isFlipped ? 'absolute' : 'relative' }
        ]}
      >
        <View style={styles.flipIconRow}>
          <Text style={styles.flipLabel}>Unhelpful thought</Text>
        </View>
        <Text style={styles.negativeText}>{negative}</Text>
        <Pressable onPress={onFlip} style={styles.flipBtn}>
          <Text style={styles.flipBtnText}>Flip to reframe →</Text>
        </Pressable>
      </Animated.View>

      <Animated.View
        pointerEvents={isFlipped ? 'auto' : 'none'}
        style={[
          styles.flipFace,
          styles.flipBack,
          backStyle,
          { position: isFlipped ? 'relative' : 'absolute' }
        ]}
      >
        <View style={styles.flipIconRow}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.flipLabelGreen}>Balanced thought</Text>
        </View>
        <Text style={styles.balancedText}>{balanced}</Text>
        <Pressable onPress={onFlip}>
          <Text style={styles.flipBackLink}>Flip back</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flex: 1 },
  scroll: { paddingTop: spacingY.xl, paddingHorizontal: spacingX.lg, paddingBottom: 100 },
  pageTitle: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    marginBottom: spacingY.md,
  },
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
    marginBottom: spacingY.xs,
  },
  cycleColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: spacingY.md,
  },
  cycleNodeWrapVertical: {
    alignItems: 'center',
  },
  cycleNodeVertical: {
    paddingHorizontal: spacingX.xl,
    paddingVertical: spacingY.sm,
    borderRadius: radii.lg,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cycleLabelVertical: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  reframeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY.sm,
  },
  tally: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.categoryCBT,
  },
  flipContainer: {
    marginBottom: spacingY.sm,
    position: 'relative',
  },
  flipFace: {
    borderRadius: radii.md,
    padding: spacingX.md,
  },
  flipFront: { 
    backgroundColor: colors.primary_10,
    top: 0, left: 0, right: 0,
  },
  flipBack: { 
    backgroundColor: colors.successBg,
    top: 0, left: 0, right: 0,
  },
  flipIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacingY.xs,
  },
  flipLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  flipLabelGreen: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.success,
  },
  negativeText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 24,
    marginBottom: spacingY.sm,
  },
  balancedText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.success,
    lineHeight: 24,
    marginBottom: spacingY.sm,
  },
  flipBtn: { alignSelf: 'flex-start' },
  flipBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.error,
  },
  flipBackLink: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.error,
  },
  distortionItem: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacingX.md,
    marginBottom: spacingY.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: colors.categoryCBT,
  },
  distortionName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: 4,
  },
  distortionExample: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

export default CBTStep;
