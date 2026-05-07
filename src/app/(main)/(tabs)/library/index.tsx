import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import LibraryHeader from "../../../../components/library/LibraryHeader";
import QuickStartFab from "../../../../components/library/QuickStartFab";
import ToolCard from "../../../../components/library/ToolCard";
import {
    getToolById,
    LAST_USED_TOOL_ID,
    LIBRARY_CATEGORIES,
    LIBRARY_TOOLS,
} from "../../../../data/libraryTools";
import {
    colors,
    FONTS,
    fontSizes,
    spacingX,
    spacingY,
} from "../../../../theme/Theme";
import { LibraryCategory, LibraryTool } from "../../../../types/library";

export default function LibraryScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>(
    "all",
  );
  const scrollY = useSharedValue(0);

  const toolsToShow = useMemo(() => {
    if (activeCategory === "all") {
      return LIBRARY_TOOLS;
    }
    return LIBRARY_TOOLS.filter((tool) => tool.category === activeCategory);
  }, [activeCategory]);

  const recommendedTools = useMemo(() => {
    return LIBRARY_TOOLS.filter((tool) => tool.isRecommended);
  }, []);

  const lastUsedTool = useMemo(() => {
    return getToolById(LAST_USED_TOOL_ID) ?? LIBRARY_TOOLS[0];
  }, []);

  const handlePressTool = (tool: LibraryTool) => {
    router.push({
      pathname: "/(main)/(tabs)/library/[id]",
      params: { id: tool.id },
    });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.libraryBg} />
      <Animated.FlatList
        data={toolsToShow}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item, index }) => (
          <ToolCard
            tool={item}
            onPress={() => handlePressTool(item)}
            variant="grid"
            style={[
              styles.card,
              index % 2 === 0 ? styles.cardLeft : styles.cardRight,
            ]}
          />
        )}
        ListHeaderComponent={
          <LibraryHeader
            title="Library"
            categories={LIBRARY_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            recommendedTools={recommendedTools}
            onPressTool={handlePressTool}
            scrollY={scrollY}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tools found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different category.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      {lastUsedTool ? (
        <QuickStartFab onPress={() => handlePressTool(lastUsedTool)} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.libraryBg,
  },
  listContent: {
    paddingBottom: spacingY.xxl,
  },
  columnWrapper: {
    paddingHorizontal: spacingX.lg,
  },
  card: {
    flex: 1,
    marginBottom: spacingY.md,
  },
  cardLeft: {
    marginRight: spacingX.md,
  },
  cardRight: {
    marginLeft: 0,
  },
  emptyState: {
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.xl,
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
    marginTop: spacingY.xs,
  },
});
