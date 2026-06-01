import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';

const REFERENCE_TEXT =
  'My name is Alex and I am twenty years old. I like going to the park and talking to people. Sometimes it is hard for me to say what I want to say, but I keep trying because communication is important to me.';

export function ReferenceCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.label}>
          <Text style={styles.labelText}>REFERENCE TEXT</Text>
        </View>
        <Text style={styles.hint}>Read aloud</Text>
      </View>
      <Text style={styles.body}>{REFERENCE_TEXT}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacingX.md,
    marginBottom: spacingY.md,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY.sm,
  },
  label: {
    backgroundColor: colors.secondary + '22',
    borderRadius: radii.pill,
    paddingHorizontal: spacingX.sm,
    paddingVertical: 3,
  },
  labelText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.secondary,
    letterSpacing: 1,
  },
  hint: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  body: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 26,
  },
});
