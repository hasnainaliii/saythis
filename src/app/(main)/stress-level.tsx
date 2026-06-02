import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Activity } from 'lucide-react-native';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { useTrackerStore } from '../../store/trackerStore';

const STRESS_LEVELS = [
  { level: 1, label: 'Very Low', color: colors.metricGreen },
  { level: 2, label: 'Low', color: colors.metricGreenLight },
  { level: 3, label: 'Normal', color: colors.secondary },
  { level: 4, label: 'High', color: colors.metricOrange },
  { level: 5, label: 'Very High', color: colors.error },
];

export default function StressLevelScreen() {
  const router = useRouter();
  const { stressLevel, setStress } = useTrackerStore();
  const [selectedLevel, setSelectedLevel] = useState(stressLevel);

  const handleSave = () => {
    setStress(selectedLevel);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Stress Level</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Activity size={48} color={colors.secondary} />
        </View>
        <Text style={styles.title}>How stressed are you feeling?</Text>

        <View style={styles.levelsContainer}>
          {STRESS_LEVELS.map((item) => {
            const isSelected = selectedLevel === item.level;
            return (
              <Pressable
                key={item.level}
                style={[
                  styles.levelButton,
                  isSelected && { backgroundColor: item.color, borderColor: item.color }
                ]}
                onPress={() => setSelectedLevel(item.level)}
              >
                <Text style={[styles.levelLabel, isSelected && styles.levelLabelSelected]}>
                  {item.label}
                </Text>
                <Text style={[styles.levelNumber, isSelected && styles.levelLabelSelected]}>
                  Level {item.level}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save & Confirm</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  content: {
    flex: 1,
    paddingTop: spacingY.xl,
    paddingHorizontal: spacingX.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary + '22',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY.lg,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacingY.xxl,
  },
  levelsContainer: {
    width: '100%',
    gap: spacingY.md,
    marginBottom: spacingY.xxl,
  },
  levelButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingY.md,
    paddingHorizontal: spacingX.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  levelLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
  levelNumber: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
  },
  levelLabelSelected: {
    color: colors.white,
  },
  saveButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacingY.md,
    paddingHorizontal: spacingX.xl * 2,
    borderRadius: radii.pill,
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: spacingY.xl,
  },
  saveButtonText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});
