import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { situations } from '../../constants/situations';

const ACCENT = colors.secondary;

interface SituationSelectorProps {
  onStart: (situation: string, customText?: string) => void;
}

export const SituationSelector: React.FC<SituationSelectorProps> = ({ onStart }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');

  const handleSelect = (label: string) => {
    setSelected(label);
    Haptics.selectionAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you preparing for?</Text>
      <Text style={styles.subtitle}>This helps track which situations you practice most</Text>

      <View style={styles.grid}>
        {situations.map((s) => {
          const sel = selected === s.label;
          return (
            <Pressable
              key={s.label}
              style={[styles.tile, sel && styles.tileActive]}
              onPress={() => handleSelect(s.label)}
            >
              <Ionicons
                name={s.icon as any}
                size={24}
                color={sel ? ACCENT : colors.textMuted}
              />
              <Text style={[styles.tileLabel, sel && { color: ACCENT }]}>{s.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {selected === 'Other' && (
        <TextInput
          style={styles.customInput}
          placeholder="Describe the situation..."
          placeholderTextColor={colors.textDisabled}
          value={customText}
          onChangeText={setCustomText}
        />
      )}

      <Pressable
        style={[styles.startBtn, !selected && { opacity: 0.4 }]}
        onPress={() => selected && onStart(selected, customText)}
        disabled={!selected}
      >
        <Text style={styles.startText}>Start the routine →</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacingX.md },
  title: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.large, color: colors.textDark, marginBottom: spacingY.xs },
  subtitle: { fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textMuted, marginBottom: spacingY.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacingY.sm },
  tile: {
    width: wp('44%'), height: hp('9%'), borderRadius: radii.lg,
    borderWidth: 1, borderColor: colors.libraryBorder, backgroundColor: colors.libraryCard,
    alignItems: 'center', justifyContent: 'center', padding: spacingX.sm,
  },
  tileActive: { borderColor: ACCENT, backgroundColor: ACCENT + '18' },
  tileLabel: { fontFamily: FONTS.primaryBold, fontSize: fontSizes.small, color: colors.textDark, marginTop: 4 },
  customInput: {
    backgroundColor: colors.librarySurface, borderRadius: radii.md,
    paddingHorizontal: spacingX.sm, paddingVertical: spacingY.xs,
    fontFamily: FONTS.primary, fontSize: fontSizes.small, color: colors.textDark,
    marginTop: spacingY.sm,
  },
  startBtn: {
    backgroundColor: ACCENT, borderRadius: radii.pill,
    paddingVertical: spacingY.sm, alignItems: 'center', marginTop: spacingY.xl,
  },
  startText: { color: colors.white, fontFamily: FONTS.primaryBold, fontSize: fontSizes.medium },
});
