import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, FeatureListItem, ScreenHeader } from "../../../../components";
import { colors, FONTS, fontSizes, spacingX, spacingY } from "../../../../theme/Theme";

const FEATURES = [
  "Full therapy library access",
  "Personalized practice plans",
  "Progress insights and reports",
];

const billingHistory: string[] = [];

export default function SubscriptionScreen() {
  const handleActivate = () => {
    console.log("Activate Pro subscription");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Subscription" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SayThis Pro</Text>
          <View style={styles.planCard}>
            <Text style={styles.planName}>Pro Membership</Text>
            <Text style={styles.planPrice}>$9.99 / month</Text>
            <Text style={styles.planDescription}>
              Unlock the full therapy library and personalized exercises.
            </Text>

            <View style={styles.features}>
              {FEATURES.map((feature) => (
                <FeatureListItem key={feature} text={feature} />
              ))}
            </View>

            <Button
              title="Activate Pro"
              onPress={handleActivate}
              size="large"
              fullWidth
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing History</Text>
          {billingHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nothing to show here</Text>
              <Text style={styles.emptySubtitle}>
                Your receipts will appear here once you subscribe.
              </Text>
            </View>
          ) : (
            <View style={styles.historyList} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: spacingX.lg,
    paddingBottom: spacingY.xxl,
  },
  section: {
    marginBottom: spacingY.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.black,
    marginBottom: spacingY.sm,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: spacingY.md,
    padding: spacingX.lg,
    borderWidth: spacingX.xxs,
    borderColor: colors.primary10,
    gap: spacingY.sm,
  },
  planName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  planPrice: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.secondary,
  },
  planDescription: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  features: {
    marginTop: spacingY.xs,
    marginBottom: spacingY.sm,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: spacingY.md,
    padding: spacingX.lg,
    borderWidth: spacingX.xxs,
    borderColor: colors.primary10,
    alignItems: "center",
    gap: spacingY.xs,
  },
  emptyTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  emptySubtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: "center",
  },
  historyList: {},
});
