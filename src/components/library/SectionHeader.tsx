import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, FONTS, fontSizes, spacingY } from "../../theme/Theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  containerStyle?: ViewStyle;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacingY.sm,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.libraryText,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.libraryMuted,
    marginTop: spacingY.xxs,
  },
});

export default SectionHeader;
