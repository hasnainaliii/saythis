import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";
import { contentStyles } from "./contentStyles";

interface SelfAwarenessContentProps {
  content: Record<string, unknown>;
}

const SelfAwarenessContent: React.FC<SelfAwarenessContentProps> = ({
  content,
}) => {
  const observations = content.what_to_observe as
    | Array<{ category: string; items: string[] }>
    | undefined;

  return (
    <ScrollView
      style={contentStyles.contentScroll}
      showsVerticalScrollIndicator={false}
    >
      {!!content.why_awareness && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>Why Awareness?</Text>
          <Text style={contentStyles.infoText}>
            {String(content.why_awareness)}
          </Text>
        </View>
      )}

      {observations && (
        <View style={contentStyles.infoCard}>
          <Text style={contentStyles.infoTitle}>What to Observe</Text>
          {observations.map((section, index) => (
            <View key={index} style={styles.observeSection}>
              <Text style={styles.observeCategory}>{section.category}</Text>
              {section.items.map((item, i) => (
                <View key={i} style={styles.checkItem}>
                  <View style={styles.checkbox} />
                  <Text style={styles.checkText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  observeSection: {
    marginBottom: spacingY.md,
  },
  observeCategory: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
    marginBottom: spacingY.xs,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX.sm,
    marginBottom: spacingY.xs,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary20,
    marginTop: 2,
  },
  checkText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
  },
});

export default SelfAwarenessContent;
