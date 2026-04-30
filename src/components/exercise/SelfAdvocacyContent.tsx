import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";
import { contentStyles } from "./contentStyles";

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
      style={contentStyles.contentScroll}
      showsVerticalScrollIndicator={false}
    >
      {!!content.why_disclosure_helps && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Why Disclosure Helps</Text>
          <Text style={contentStyles.infoText}>
            {String(content.why_disclosure_helps)}
          </Text>
        </View>
      )}

      {disclosureTypes && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Types of Disclosure</Text>
          {disclosureTypes.map((section, index) => (
            <View key={index} style={styles.disclosureSection}>
              <Text style={styles.disclosureType}>{section.type}</Text>
              {section.examples.map((example, i) => (
                <View key={i} style={styles.exampleCard}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={16}
                    color={colors.secondary}
                  />
                  <Text style={styles.exampleQuote}>"{example}"</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {dosAndDonts && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Do's and Don'ts</Text>
          <View style={styles.dosContainer}>
            <Text style={styles.dosTitle}>✓ Do</Text>
            {dosAndDonts.do.map((item, index) => (
              <Text key={index} style={styles.doItem}>
                • {item}
              </Text>
            ))}
          </View>
          <View>
            <Text style={styles.dontsTitle}>✗ Don't</Text>
            {dosAndDonts.dont.map((item, index) => (
              <Text key={index} style={styles.dontItem}>
                • {item}
              </Text>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  disclosureSection: {
    marginBottom: spacingY.md,
  },
  disclosureType: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
    marginBottom: spacingY.xs,
  },
  exampleCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.primary_10,
    borderRadius: 8,
    padding: spacingX.sm,
    marginBottom: spacingY.xs,
    gap: spacingX.sm,
  },
  exampleQuote: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
    fontStyle: "italic",
  },
  dosContainer: {
    marginBottom: spacingY.md,
  },
  dosTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.success,
    marginBottom: spacingY.xs,
  },
  doItem: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
    marginLeft: spacingX.sm,
    marginBottom: 4,
  },
  dontsTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.errorLight,
    marginBottom: spacingY.xs,
  },
  dontItem: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
    marginLeft: spacingX.sm,
    marginBottom: 4,
  },
});

export default SelfAdvocacyContent;
