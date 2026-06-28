import { BrainCircuit, ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from "../../theme/Theme";

export function AiFeedbackCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <BrainCircuit size={16} color={colors.white} />
        <Text style={styles.headerText}>AI Feedback</Text>
      </View>
      <Text style={styles.label} adjustsFontSizeToFit numberOfLines={1}>Personalized</Text>
      
      <View style={styles.waveRow}>
        <View style={styles.waveLine} />
        <View style={[styles.waveLine, styles.waveLineMd]} />
        <View style={[styles.waveLine, styles.waveLineLg]} />
        <View style={[styles.waveLine, styles.waveLineMd]} />
        <View style={styles.waveLine} />
      </View>
      
      <View style={styles.footerRow}>
        <Text style={styles.hint}>Tap to view</Text>
        <ChevronRight size={14} color={colors.white} opacity={0.8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.categorySelfAwareness,
    borderRadius: radii.xl,
    padding: spacingX.md,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: spacingY.xs,
  },
  headerText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.white,
  },
  label: {
    fontFamily: FONTS.primaryBlack,
    fontSize: fontSizes.xl,
    color: colors.white,
    marginBottom: spacingY.sm,
  },
  waveRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginBottom: spacingY.md,
    height: 16, // To give a fixed container height for the wave
  },
  waveLine: {
    width: 3,
    height: 6,
    borderRadius: 2,
    backgroundColor: colors.white + "66",
  },
  waveLineMd: {
    height: 10,
    backgroundColor: colors.white + "AA",
  },
  waveLineLg: {
    height: 16,
    backgroundColor: colors.white,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hint: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.white,
    opacity: 0.85,
  },
});
