import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';

interface TechniqueStep {
  step: number;
  name: string;
  details?: string[];
  checklist?: string[];
}

interface Props {
  steps: TechniqueStep[];
}

const TechniqueStepper: React.FC<Props> = ({ steps }) => {
  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [dir, setDir] = useState(1);

  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  const goTo = (idx: number) => {
    const d = idx > current ? 1 : -1;
    setDir(d);
    opacity.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) });
    translateX.value = withTiming(d * -20, { duration: 150 }, (fin) => {
      if (fin) runOnJS(setCurrent)(idx);
    });
  };

  useEffect(() => {
    translateX.value = dir * 20;
    opacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) });
    translateX.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.quad) });
  }, [current, dir]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const step = steps[current];

  return (
    <View style={styles.card}>
      <View style={styles.pillRow}>
        {steps.map((s, i) => (
          <Pressable key={s.step} onPress={() => goTo(i)}>
            <View style={[styles.pill, i === current && styles.pillActive]}>
              <Text style={[styles.pillText, i === current && styles.pillTextActive]}>
                {s.step}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Animated.View style={contentStyle}>
        <Text style={styles.stepName}>{step.name}</Text>

        {step.details?.map((d, i) => (
          <View key={i} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{d}</Text>
          </View>
        ))}

        {step.checklist?.map((item, i) => {
          const key = `${step.step}_${i}`;
          const isChecked = !!checked[key];
          return (
            <Pressable
              key={i}
              style={styles.checkRow}
              onPress={() => setChecked(p => ({ ...p, [key]: !p[key] }))}
            >
              <View style={[styles.checkbox, isChecked && styles.checkboxDone]}>
                {isChecked && <Ionicons name="checkmark" size={14} color={colors.white} />}
              </View>
              <Text style={[styles.bulletText, isChecked && styles.checkedText]}>{item}</Text>
            </Pressable>
          );
        })}
      </Animated.View>

      <View style={styles.navRow}>
        {current > 0 ? (
          <Pressable onPress={() => goTo(current - 1)}>
            <Text style={styles.navText}>← Prev</Text>
          </Pressable>
        ) : <View />}
        {current < steps.length - 1 ? (
          <Pressable onPress={() => goTo(current + 1)}>
            <Text style={styles.navText}>Next →</Text>
          </Pressable>
        ) : <View />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacingY.sm,
  },
  pill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillActive: { backgroundColor: colors.secondary },
  pillText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  pillTextActive: { color: colors.white },
  stepName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: spacingY.xxs,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    lineHeight: 20,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: spacingY.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  checkboxDone: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: colors.textDisabled,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingY.sm,
  },
  navText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
});

export default TechniqueStepper;
