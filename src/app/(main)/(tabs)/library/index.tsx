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
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>(
    "speech_fluency",
  );
  const scrollY = useSharedValue(0);

  const normalizedQuery = query.trim().toLowerCase();

  const toolsToShow = useMemo(() => {
    if (isSearchOpen) {
      if (!normalizedQuery) {
        return [] as LibraryTool[];
      }
      return LIBRARY_TOOLS.filter((tool) =>
        tool.name.toLowerCase().includes(normalizedQuery),
      );
    }

    return LIBRARY_TOOLS.filter((tool) => {
      const matchesCategory = tool.category === activeCategory;
      const matchesQuery = normalizedQuery
        ? tool.name.toLowerCase().includes(normalizedQuery)
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, isSearchOpen, normalizedQuery]);

  const recommendedTools = useMemo(() => {
    return LIBRARY_TOOLS.filter((tool) => tool.isRecommended).filter((tool) =>
      normalizedQuery
        ? tool.name.toLowerCase().includes(normalizedQuery)
        : true,
    );
  }, [normalizedQuery]);

  const lastUsedTool = useMemo(() => {
    return getToolById(LAST_USED_TOOL_ID) ?? LIBRARY_TOOLS[0];
  }, []);

  const handlePressTool = (tool: LibraryTool) => {
    router.push({
      pathname: "/(main)/(tabs)/library/[id]",
      params: { id: tool.id },
    });
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setQuery("");
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
            subtitle="Your full catalog of fluency tools"
            query={query}
            onQueryChange={setQuery}
            categories={LIBRARY_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            recommendedTools={recommendedTools}
            onPressTool={handlePressTool}
            scrollY={scrollY}
            isSearchOpen={isSearchOpen}
            onOpenSearch={handleOpenSearch}
            onCloseSearch={handleCloseSearch}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {isSearchOpen
                ? normalizedQuery
                  ? "No results"
                  : "Search the library"
                : "No tools found"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isSearchOpen
                ? normalizedQuery
                  ? "Try another keyword."
                  : "Type a tool name to begin."
                : "Try a different search or category."}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      {lastUsedTool && !isSearchOpen ? (
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
