import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS, fontSizes, spacingX, spacingY } from '../../theme/Theme';

const ACCENT = colors.secondary;

const STEPS = [
  { icon: 'flash-outline', label: 'Settle' },
  { icon: 'body-outline', label: 'Release' },
  { icon: 'mic-outline', label: 'Warm up' },
  { icon: 'chatbubble-outline', label: 'Onset' },
  { icon: 'heart-outline', label: 'Affirm' },
] as const;

interface StepIndicatorBarProps {
  currentStep: number;
}

export const StepIndicatorBar: React.FC<StepIndicatorBarProps> = ({ currentStep }) => {
  return (
    <View style={styles.container}>
      {STEPS.map((step, i) => {
        const isComplete = i < currentStep;
        const isActive = i === currentStep;
        const isPending = i > currentStep;

        return (
          <React.Fragment key={i}>
            <View style={styles.stepItem}>
              <View style={[
                styles.iconCircle,
                isComplete && { backgroundColor: colors.success },
                isActive && { borderColor: ACCENT, borderWidth: 2, backgroundColor: 'transparent' },
                isPending && { borderColor: colors.libraryBorder, borderWidth: 1 },
              ]}>
                <Ionicons
                  name={isComplete ? 'checkmark' : step.icon as any}
                  size={14}
                  color={isComplete ? colors.white : isActive ? ACCENT : colors.textDisabled}
                />
              </View>
              <Text style={[
                styles.label,
                isComplete && { color: colors.success },
                isActive && { color: ACCENT, fontFamily: FONTS.primaryBold },
                isPending && { color: colors.textDisabled },
              ]}>
                {step.label}
              </Text>
            </View>
            {i < STEPS.length - 1 && <View style={styles.connector} />}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacingX.sm, paddingVertical: spacingY.sm,
  },
  stepItem: { alignItems: 'center' },
  iconCircle: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  label: { fontFamily: FONTS.primary, fontSize: fontSizes.tiny, marginTop: 2 },
  connector: { flex: 1, height: 1, backgroundColor: colors.libraryBorder },
});
