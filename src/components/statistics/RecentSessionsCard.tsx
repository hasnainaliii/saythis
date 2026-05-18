import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface RecentSessionRowProps {
  toolType: string;
  date: string;
  detail: string;
  rating: number | null;
}

const TOOL_COLORS: Record<string, string> = {
  DAF: colors.secondary,
  FAF: colors.categorySelfAwareness,
  BOX_BREATHING: colors.categoryCBT,
  DIAPHRAGMATIC: colors.categoryCBT,
  PRE_SPEECH: colors.categorySelfAdvocacy,
  GENTLE_ONSET: colors.categoryEducation,
  PROLONGED_SPEECH: colors.categoryEducation,
  STUTTER_TAP_COUNTER: colors.secondary,
  TIMED_READING_WPM: colors.secondary,
  VIRTUAL_COFFEE_ORDER: colors.warning,
  PHONE_CALL_SIMULATOR: colors.warning,
};

const TOOL_LABELS: Record<string, string> = {
  DAF: "DAF",
  FAF: "FAF",
  BOX_BREATHING: "Box",
  DIAPHRAGMATIC: "Dia",
  PRE_SPEECH: "Pre-S",
  GENTLE_ONSET: "Gentle",
  PROLONGED_SPEECH: "Prol.",
  STUTTER_TAP_COUNTER: "Tap",
  TIMED_READING_WPM: "Read",
  VIRTUAL_COFFEE_ORDER: "Coffee",
  PHONE_CALL_SIMULATOR: "Call",
};

export const RecentSessionRow: React.FC<RecentSessionRowProps> = ({ toolType, date, detail, rating }) => {
  const accent = TOOL_COLORS[toolType] || colors.secondary;

  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: accent + "1A" }]}>
        <Text style={[styles.badgeText, { color: accent }]}>{TOOL_LABELS[toolType] || toolType}</Text>
      </View>
      <View style={styles.mid}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.detail} numberOfLines={1}>{detail}</Text>
      </View>
      {rating ? (
        <View style={styles.ratingWrap}>
          <Text style={styles.rating}>{rating}</Text>
          <Ionicons name="star" size={12} color={colors.star} />
        </View>
      ) : (
        <Text style={styles.noRating}>—</Text>
      )}
    </View>
  );
};

interface RecentSessionsCardProps {
  sessions: any[];
}

export const RecentSessionsCard: React.FC<RecentSessionsCardProps> = ({ sessions }) => {
  if (!sessions.length) return null;

  const formatDetail = (s: any) => {
    const mins = Math.round(s.durationSeconds / 60);
    if (s.toolType === 'DAF') return `${s.settings?.delay_ms || 0}ms delay · ${mins} min`;
    if (s.toolType === 'FAF') return `${s.settings?.pitch_direction === 'down' ? '−' : '+'}${s.settings?.pitch_semitones || 0} st · ${mins} min`;
    return `${mins} min`;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recent activity</Text>
      {sessions.map((s, i) => (
        <RecentSessionRow
          key={i}
          toolType={s.toolType}
          date={new Date(s.startedAt).toLocaleDateString()}
          detail={formatDetail(s)}
          rating={s.selfRating}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.libraryCard,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    paddingVertical: spacingY.md,
    marginHorizontal: spacingX.md,
    marginBottom: spacingY.lg,
    overflow: "hidden",
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
    paddingHorizontal: spacingX.lg,
    marginBottom: spacingY.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.libraryBorder,
  },
  badge: {
    paddingHorizontal: spacingX.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginRight: spacingX.sm,
    minWidth: 44,
    alignItems: "center",
  },
  badgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
  },
  mid: {
    flex: 1,
  },
  date: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  detail: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.textMuted,
  },
  ratingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rating: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.star,
  },
  noRating: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
});
