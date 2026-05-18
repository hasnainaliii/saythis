import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';

interface InstructionCardProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  highlight?: string;
  step?: number;
}

export const InstructionCard: React.FC<InstructionCardProps> = ({
  icon,
  title,
  body,
  highlight,
  step,
}) => {
  return (
    <View style={styles.card}>
      {step !== undefined && (
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>Step {step}</Text>
        </View>
      )}
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {highlight && (
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>{highlight}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.libraryCard,
    borderColor: colors.libraryBorder,
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.md,
    position: 'relative',
    width: '100%',
  },
  stepBadge: {
    position: 'absolute',
    top: spacingY.sm,
    right: spacingX.sm,
    backgroundColor: colors.secondary,
    borderRadius: radii.pill,
    paddingHorizontal: spacingX.xs,
    paddingVertical: 2,
  },
  stepText: {
    fontSize: fontSizes.tiny,
    fontFamily: FONTS.primaryBold,
    color: colors.white,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY.sm,
  },
  title: {
    fontSize: fontSizes.medium,
    fontFamily: FONTS.primaryBold,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  body: {
    fontSize: fontSizes.small,
    fontFamily: FONTS.primary,
    color: colors.textMuted,
    lineHeight: fontSizes.small * 1.5,
    marginBottom: spacingY.sm,
  },
  highlightBox: {
    backgroundColor: colors.secondary + '22',
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xs,
    borderRadius: radii.sm,
  },
  highlightText: {
    fontSize: fontSizes.small,
    fontFamily: FONTS.primaryBold,
    color: colors.secondary10,
  },
});
