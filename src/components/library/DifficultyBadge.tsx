import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";
import { LibraryDifficulty } from "../../types/library";

interface DifficultyBadgeProps {
  difficulty: LibraryDifficulty;
}

const DIFFICULTY_STYLES: Record<
  LibraryDifficulty,
  { label: string; bg: string; text: string }
> = {
  beginner: {
    label: "Beginner",
    bg: colors.libraryCardAlt,
    text: colors.libraryText,
  },
  intermediate: {
    label: "Intermediate",
    bg: colors.secondary_20,
    text: colors.libraryText,
  },
  advanced: {
    label: "Advanced",
    bg: colors.warning,
    text: colors.libraryText,
  },
};

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const style = DIFFICULTY_STYLES[difficulty];

  return (
    <View style={[styles.container, { backgroundColor: style.bg }]}> 
      <Text style={[styles.text, { color: style.text }]}>{style.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.pill,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
  },
  text: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
  },
});

export default DifficultyBadge;
