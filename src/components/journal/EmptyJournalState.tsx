import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileQuestion } from 'lucide-react-native';
import { colors, FONTS, fontSizes, spacingY } from '../../theme/Theme';

export default function EmptyJournalState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FileQuestion size={48} color={colors.textDisabled} />
      </View>
      <Text style={styles.title}>Nothing is written here</Text>
      <Text style={styles.subtitle}>You didn't write a journal entry on this day.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100, // offset for visual center
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY.md,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textMuted,
    marginBottom: spacingY.xs,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDisabled,
    textAlign: 'center',
  },
});
