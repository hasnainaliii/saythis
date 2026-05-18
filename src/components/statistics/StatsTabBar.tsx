import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatsTab, STATS_TABS } from "../../hooks/useStatsData";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";

interface StatsTabBarProps {
  active: StatsTab;
  onChange: (tab: StatsTab) => void;
}

export const StatsTabBar: React.FC<StatsTabBarProps> = ({ active, onChange }) => (
  <View style={styles.wrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {STATS_TABS.map((tab) => (
        <Pressable
          key={tab}
          style={[styles.tab, active === tab && styles.tabActive]}
          onPress={() => onChange(tab)}
        >
          <Text style={[styles.text, active === tab && styles.textActive]}>{tab}</Text>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    height: 44,
    marginBottom: spacingY.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX.md,
    gap: spacingX.xs,
    height: 44,
  },
  tab: {
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX.md,
    borderRadius: 17,
    backgroundColor: colors.libraryCard,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
  },
  tabActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  text: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  textActive: {
    fontFamily: FONTS.primaryBold,
    color: colors.white,
  },
});
