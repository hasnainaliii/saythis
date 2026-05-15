import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Exercise } from '../../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';

interface InstructionsStepProps {
  exercise: Exercise;
  onContinue: () => void;
}

const InstructionsStep: React.FC<InstructionsStepProps> = ({ exercise, onContinue }) => {
  const [checked, setChecked] = useState<boolean[]>(
    new Array(exercise.instructions.length).fill(false),
  );

  const allChecked = checked.every(Boolean);

  // auto-advance after a short delay when all are checked
  useEffect(() => {
    if (allChecked) {
      const timer = setTimeout(onContinue, 500);
      return () => clearTimeout(timer);
    }
  }, [allChecked, onContinue]);

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>Instructions</Text>

        {exercise.instructions.map((text, i) => (
          <InstructionRow
            key={i}
            index={i}
            text={text}
            isChecked={checked[i]}
            onToggle={() => toggle(i)}
          />
        ))}

        {allChecked && (
          <Text style={styles.autoAdvance}>Moving on...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const InstructionRow: React.FC<{
  index: number;
  text: string;
  isChecked: boolean;
  onToggle: () => void;
}> = ({ index, text, isChecked, onToggle }) => {
  const translateY = useSharedValue(12);
  const opacity = useSharedValue(0);
  const checkOpacity = useSharedValue(isChecked ? 1 : 0);

  useEffect(() => {
    translateY.value = withDelay(
      index * 60,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) }),
    );
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 300 }));
  }, [index, translateY, opacity]);

  useEffect(() => {
    checkOpacity.value = withTiming(isChecked ? 1 : 0, { duration: 200 });
  }, [isChecked, checkOpacity]);

  const rowAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const checkAnim = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));

  return (
    <Animated.View style={rowAnim}>
      <Pressable style={styles.row} onPress={onToggle}>
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          <Animated.View style={checkAnim}>
            {isChecked && <Ionicons name="checkmark" size={14} color={colors.white} />}
          </Animated.View>
        </View>
        <Text style={[styles.rowText, isChecked && styles.rowTextChecked]}>
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacingX.lg },
  scroll: { paddingBottom: spacingY.lg },
  sectionLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacingX.sm,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacingX.md,
    marginBottom: spacingY.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  rowText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 24,
  },
  rowTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  autoAdvance: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacingY.md,
  },
});

export default InstructionsStep;
