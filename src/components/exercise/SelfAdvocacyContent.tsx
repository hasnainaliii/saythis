import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";

interface SelfAdvocacyContentProps {
  content: Record<string, unknown>;
}

const SelfAdvocacyContent: React.FC<SelfAdvocacyContentProps> = ({
  content,
}) => {
  const disclosureTypes = content.types_of_disclosure as
    | Array<{ type: string; examples: string[] }>
    | undefined;

  const dosAndDonts = content.dos_and_donts as
    | { do: string[]; dont: string[] }
    | undefined;

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {!!content.why_disclosure_helps && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: "#FF8C4215" }]}>
              <Ionicons name="megaphone-outline" size={18} color="#FF8C42" />
            </View>
            <Text style={styles.cardTitle}>Why Disclosure Helps</Text>
          </View>
          <Text style={styles.cardBody}>
            {String(content.why_disclosure_helps)}
          </Text>
        </View>
      )}

      {disclosureTypes && disclosureTypes.map((section, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: colors.secondary + "15" }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.secondary} />
            </View>
            <Text style={styles.cardTitle}>{section.type}</Text>
          </View>
          {section.examples.map((example, i) => (
            <View key={i} style={styles.quoteCard}>
              <View style={styles.quoteMark}>
                <Text style={styles.quoteMarkText}>"</Text>
              </View>
              <Text style={styles.quoteText}>{example}</Text>
            </View>
          ))}
        </View>
      ))}

      {dosAndDonts && (
        <View style={styles.dosGrid}>
          <View style={[styles.card, styles.doCard]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: "#50C87815" }]}>
                <Ionicons name="checkmark-circle" size={18} color="#50C878" />
              </View>
              <Text style={[styles.cardTitle, { color: "#50C878" }]}>Do</Text>
            </View>
            {dosAndDonts.do.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.listDot, { backgroundColor: "#50C878" }]} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.card, styles.dontCard]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: colors.errorLight + "15" }]}>
                <Ionicons name="close-circle" size={18} color={colors.errorLight} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.errorLight }]}>Don't</Text>
            </View>
            {dosAndDonts.dont.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.listDot, { backgroundColor: colors.errorLight }]} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacingX.md,
    marginBottom: spacingY.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    marginBottom: spacingY.sm,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  cardBody: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    lineHeight: 22,
  },

  // Quotes
  quoteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.primary_10,
    borderRadius: 12,
    padding: spacingX.sm,
    marginBottom: spacingY.xs,
    gap: 6,
  },
  quoteMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondary + "18",
    justifyContent: "center",
    alignItems: "center",
  },
  quoteMarkText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.secondary,
    marginTop: -2,
  },
  quoteText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
    fontStyle: "italic",
    lineHeight: 20,
  },

  // Do's and Don'ts
  dosGrid: {
    gap: 0,
  },
  doCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#50C878",
  },
  dontCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.errorLight,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX.sm,
    marginBottom: spacingY.xs,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  listText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
    lineHeight: 20,
  },
});

export default SelfAdvocacyContent;
