import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Moon } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { useTrackerStore } from '../../store/trackerStore';

export default function SleepTrackerScreen() {
  const router = useRouter();
  const { sleepHours, setSleep } = useTrackerStore();
  const [hours, setHours] = useState(sleepHours);

  const handleSave = () => {
    setSleep(hours);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Sleep Quality</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Moon size={64} color={colors.headerDark} />
        </View>
        <Text style={styles.title}>How many hours did you sleep?</Text>
        
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{hours}</Text>
          <Text style={styles.unitText}>hours</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={12}
          step={0.5}
          value={hours}
          onValueChange={setHours}
          minimumTrackTintColor={colors.headerDark}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.headerDark}
        />

        <View style={styles.sliderLabels}>
          <Text style={styles.labelText}>0h</Text>
          <Text style={styles.labelText}>12h+</Text>
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
    alignItems: 'center',
    paddingTop: spacingY.xl,
    paddingHorizontal: spacingX.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.headerDark + '22',
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
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacingY.lg,
  },
  valueText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl * 1.5,
    color: colors.headerDark,
  },
  unitText: {
    fontFamily: FONTS.primaryMedium,
    fontSize: fontSizes.large,
    color: colors.textMuted,
    marginLeft: spacingX.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacingX.xs,
    marginBottom: spacingY.xxl,
  },
  labelText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
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
