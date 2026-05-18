import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface StatChipProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

export const StatChip: React.FC<StatChipProps> = ({ label, value, unit, color }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: color || colors.textDark }]}>
        {value}
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.librarySurface,
    borderRadius: radii.md,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xs,
    minWidth: wp("22%"),
    alignItems: 'center',
  },
  label: {
    fontSize: fontSizes.tiny,
    fontFamily: FONTS.primary,
    color: colors.textMuted,
    marginBottom: 2,
  },
  value: {
    fontSize: fontSizes.xl,
    fontFamily: FONTS.primaryBold,
  },
  unit: {
    fontSize: fontSizes.tiny,
    fontFamily: FONTS.primary,
    color: colors.textMuted,
  },
});
