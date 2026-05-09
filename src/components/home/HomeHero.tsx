import { Calendar, Search, Sparkles, Zap, SmilePlus, Bell } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  colors, FONTS, fontSizes, spacingX, spacingY, radii,
} from "../../theme/Theme";

interface Props {
  userName: string;
  dateString: string;
  level: string;
  fluencyPercent: number;
  mood: string;
}

export function HomeHero({ userName, dateString, level, fluencyPercent, mood }: Props) {
  return (
    <View style={styles.container}>
      {/* top row */}
      <View style={styles.topRow}>
        <View style={styles.dateRow}>
          <Calendar size={13} color={colors.white} />
          <Text style={styles.dateText}>{dateString}</Text>
        </View>
        <View style={styles.bellWrap}>
          <Bell size={18} color={colors.white} />
        </View>
      </View>

      {/* greeting */}
      <View style={styles.greetRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🗣️</Text>
        </View>
        <View style={styles.greetCol}>
          <Text style={styles.name}>Hi, {userName}!</Text>
          <View style={styles.badges}>
            <Sparkles size={13} color={colors.star} />
            <Text style={styles.badgeText}>{level}</Text>
            <Text style={styles.dot}>·</Text>
            <Zap size={13} color={colors.white} />
            <Text style={styles.badgeText}>{fluencyPercent}%</Text>
            <Text style={styles.dot}>·</Text>
            <SmilePlus size={13} color={colors.white} />
            <Text style={styles.badgeText}>{mood}</Text>
          </View>
        </View>
      </View>

      {/* search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search anything..."
          placeholderTextColor={colors.textMuted}
          editable={false}
        />
        <Search size={18} color={colors.textMuted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: spacingX.xl,
    paddingTop: spacingY.sm,
    paddingBottom: spacingY.xl,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY.md,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.white,
    opacity: 0.9,
  },
  bellWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  greetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.md,
    marginBottom: spacingY.xl,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.45)",
  },
  avatarEmoji: {
    fontSize: 26,
  },
  greetCol: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.white,
    marginBottom: 6,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  dot: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
    opacity: 0.5,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    padding: 0,
  },
});
