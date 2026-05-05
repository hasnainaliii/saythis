import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "../../../../components/BackButton";
import Button from "../../../../components/Button";
import DifficultyBadge from "../../../../components/library/DifficultyBadge";
import SectionHeader from "../../../../components/library/SectionHeader";
import ToolCard from "../../../../components/library/ToolCard";
import ToolHero from "../../../../components/library/ToolHero";
import ToolTag from "../../../../components/library/ToolTag";
import { getToolById, LIBRARY_TOOLS } from "../../../../data/libraryTools";
import {
    colors,
    dynamicSpacingY,
    FONTS,
    fontSizes,
    radii,
    spacingX,
    spacingY,
} from "../../../../theme/Theme";
import { LibraryTool } from "../../../../types/library";

const stepSize = dynamicSpacingY(4);

export default function LibraryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const tool = useMemo(() => (id ? getToolById(id) : undefined), [id]);

  const relatedTools = useMemo(() => {
    if (!tool) {
      return [] as LibraryTool[];
    }
    return LIBRARY_TOOLS.filter((item) => tool.relatedToolIds.includes(item.id));
  }, [tool]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!tool) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.libraryBg} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Tool not found</Text>
          <Text style={styles.emptySubtitle}>
            This tool may be unavailable or locked.
          </Text>
          <BackButton variant="dark" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.libraryBg} />
      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: spacingY.xxl + insets.bottom + spacingY.xl },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <ToolHero tool={tool} scrollY={scrollY} />

        <View style={styles.content}>
          <ToolTag category={tool.category} />
          <Text style={styles.title}>{tool.name}</Text>
          <Text style={styles.description}>{tool.description}</Text>

          <View style={styles.metaRow}>
            <DifficultyBadge difficulty={tool.difficulty} />
            <View style={styles.durationPill}>
              <Text style={styles.durationText}>{tool.durationMinutes} min</Text>
            </View>
          </View>

          <SectionHeader title="How to use" containerStyle={styles.sectionGap} />
          <View style={styles.stepsList}>
            {tool.steps.map((step, index) => (
              <View key={`${tool.id}-step-${index}`} style={styles.stepItem}>
                <View style={styles.stepIndex}>
                  <Text style={styles.stepIndexText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <SectionHeader title="Related tools" containerStyle={styles.sectionGap} />
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedRow}
          >
            {relatedTools.map((item) => (
              <ToolCard
                key={item.id}
                tool={item}
                onPress={() =>
                  router.push({
                    pathname: "/(main)/(tabs)/library/[id]",
                    params: { id: item.id },
                  })
                }
                variant="compact"
                style={styles.relatedCard}
              />
            ))}
          </Animated.ScrollView>
        </View>
      </Animated.ScrollView>

      <View
        style={[
          styles.headerOverlay,
          { top: insets.top + spacingY.sm, left: spacingX.lg },
        ]}
      >
        <BackButton variant="dark" onPress={() => router.back()} />
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + spacingY.md },
        ]}
      >
        <Button
          title={tool.isLocked ? "Locked" : "Start Exercise"}
          onPress={() =>
            router.push({
              pathname: "/(main)/(tabs)/library/[id]",
              params: { id: tool.id, start: "1" },
            })
          }
          size="large"
          fullWidth
          disabled={tool.isLocked}
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.libraryBg,
  },
  scrollContent: {
    paddingBottom: spacingY.xxl,
  },
  content: {
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.lg,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.libraryText,
    marginTop: spacingY.sm,
  },
  description: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.libraryMuted,
    marginTop: spacingY.sm,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    marginTop: spacingY.md,
  },
  durationPill: {
    backgroundColor: colors.libraryCardAlt,
    borderRadius: radii.pill,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
  },
  durationText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.librarySoft,
  },
  sectionGap: {
    marginTop: spacingY.lg,
  },
  stepsList: {
    gap: spacingY.sm,
  },
  stepItem: {
    flexDirection: "row",
    gap: spacingX.sm,
    alignItems: "flex-start",
  },
  stepIndex: {
    width: stepSize,
    height: stepSize,
    borderRadius: stepSize / 2,
    backgroundColor: colors.libraryCardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIndexText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.libraryText,
  },
  stepText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.libraryMuted,
    lineHeight: 20,
  },
  relatedRow: {
    gap: spacingX.md,
    paddingBottom: spacingY.sm,
  },
  relatedCard: {
    shadowColor: colors.libraryBg,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  headerOverlay: {
    position: "absolute",
    zIndex: 10,
  },
  footer: {
    position: "absolute",
    left: spacingX.lg,
    right: spacingX.lg,
    bottom: 0,
    paddingTop: spacingY.sm,
    backgroundColor: colors.libraryBg,
  },
  primaryButton: {
    backgroundColor: colors.libraryAccent,
  },
  primaryButtonText: {
    color: colors.white,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX.lg,
    gap: spacingY.sm,
  },
  emptyTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.libraryText,
  },
  emptySubtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.libraryMuted,
    textAlign: "center",
  },
});
