import { StyleSheet } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";

/**
 * Shared styles used across all exercise content renderer components
 * (Education, SelfAwareness, CBT, SelfAdvocacy).
 */
export const contentStyles = StyleSheet.create({
  contentScroll: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacingX.md,
    marginBottom: spacingY.md,
  },
  infoTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.black,
    marginBottom: spacingY.sm,
  },
  infoText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
    lineHeight: 22,
  },
});
