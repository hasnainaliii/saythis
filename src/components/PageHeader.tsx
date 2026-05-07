import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, FONTS, fontSizes, spacingY } from "../theme/Theme";

interface PageHeaderProps {
  title: string;
  headline: string;
  subtitle?: string;
  containerStyle?: ViewStyle;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  headline,
  subtitle,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      <Text style={styles.headline}>{headline}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacingY.md,
    marginBottom: spacingY.xl,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: spacingY.xs,
    marginBottom: spacingY.md,
  },
  headline: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    marginBottom: spacingY.xs,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
  },
});

export default PageHeader;
