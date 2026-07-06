import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StatChip } from './StatChip';
import { SessionRating } from './SessionRating';
import { InstructionCard } from './InstructionCard';

interface StatItem {
  label: string;
  value: string | number;
  unit?: string;
}

interface TipCardData {
  icon: string;
  iconColor: string;
  title: string;
  body: string;
}

interface ToolResultScreenProps {
  toolName: string;
  subtitle: string;
  accentColor: string;
  stats: StatItem[];
  tipCard: TipCardData;
  onSave: (rating: number | null) => void;
  onRepeat: () => void;
}

export const ToolResultScreen: React.FC<ToolResultScreenProps> = ({
  toolName,
  subtitle,
  accentColor,
  stats,
  tipCard,
  onSave,
  onRepeat,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handleRate = (r: number) => {
    if (!saved) {
      setSaved(true);
      onSave(r);
    }
  };

  const handleSkip = () => {
    if (!saved) {
      setSaved(true);
      onSave(null);
    }
  };

  const handleDone = () => {
    // If user hasn't rated/skipped yet, save with no rating before navigating away
    if (!saved) {
      setSaved(true);
      onSave(null);
    }
    router.replace('/(main)/(tabs)/library');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={ZoomIn} style={styles.header}>
          <Ionicons name="checkmark-circle" size={72} color={colors.success} />
          <Text style={styles.title}>{toolName}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>

        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <StatChip key={i} label={s.label} value={s.value} unit={s.unit} color={accentColor} />
          ))}
        </View>

        <SessionRating onRate={handleRate} onSkip={handleSkip} />

        <InstructionCard
          icon={<Ionicons name={tipCard.icon as any} size={28} color={tipCard.iconColor} />}
          title={tipCard.title}
          body={tipCard.body}
        />

        <View style={styles.buttonsRow}>
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: accentColor }]}
            onPress={handleDone}
          >
            <Text style={styles.primaryBtnText}>Done</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={onRepeat}>
            <Text style={[styles.secondaryBtnText, { color: accentColor }]}>Repeat</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scrollContent: { padding: spacingX.md, paddingBottom: 120 },
  header: { alignItems: 'center', marginVertical: spacingY.lg },
  title: {
    fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xxl,
    color: colors.textDark, marginTop: spacingY.sm,
  },
  subtitle: {
    fontFamily: FONTS.primary, fontSize: fontSizes.small,
    color: colors.textMuted, textAlign: 'center', marginTop: spacingY.xxs,
  },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacingX.sm,
    justifyContent: 'center', marginBottom: spacingY.md,
  },
  buttonsRow: {
    flexDirection: 'row', gap: spacingX.md, marginTop: spacingY.lg,
  },
  primaryBtn: {
    flex: 1, borderRadius: radii.pill,
    paddingVertical: spacingY.sm, alignItems: 'center',
  },
  primaryBtnText: {
    color: colors.white, fontSize: fontSizes.medium,
    fontFamily: FONTS.primaryBold,
  },
  secondaryBtn: {
    flex: 1, borderRadius: radii.pill,
    paddingVertical: spacingY.sm, alignItems: 'center',
    borderWidth: 1, borderColor: colors.libraryBorder,
  },
  secondaryBtnText: {
    fontSize: fontSizes.medium, fontFamily: FONTS.primaryBold,
  },
});
