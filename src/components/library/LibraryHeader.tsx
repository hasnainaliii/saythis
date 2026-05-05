import { Search } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import {
    colors,
    FONTS,
    fontSizes,
    spacingX,
    spacingY,
} from "../../theme/Theme";
import { LibraryCategory, LibraryTool } from "../../types/library";
import CategoryTabs from "./CategoryTabs";
import SearchBar from "./SearchBar";
import SectionHeader from "./SectionHeader";
import ToolCard from "./ToolCard";

interface LibraryHeaderProps {
  title: string;
  subtitle: string;
  query: string;
  onQueryChange: (value: string) => void;
  categories: { key: LibraryCategory; label: string }[];
  activeCategory: LibraryCategory;
  onCategoryChange: (category: LibraryCategory) => void;
  recommendedTools: LibraryTool[];
  onPressTool: (tool: LibraryTool) => void;
  scrollY: SharedValue<number>;
  isSearchOpen: boolean;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  title,
  subtitle,
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  recommendedTools,
  onPressTool,
  scrollY,
  isSearchOpen,
  onOpenSearch,
  onCloseSearch,
}) => {
  const recommendedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 160], [0, -12]);
    const opacity = interpolate(scrollY.value, [0, 120], [1, 0.9]);

    return { transform: [{ translateY }], opacity };
  });
  const showBrowse = !isSearchOpen;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {!isSearchOpen ? (
          <Pressable
            onPress={onOpenSearch}
            style={styles.searchButton}
            hitSlop={spacingX.sm}
          >
            <Search size={18} color={colors.textDark} />
          </Pressable>
        ) : null}
      </View>

      {isSearchOpen ? (
        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <SearchBar
              value={query}
              onChangeText={onQueryChange}
              onClear={() => onQueryChange("")}
              autoFocus
            />
          </View>
          <Pressable
            onPress={onCloseSearch}
            style={styles.cancelButton}
            hitSlop={spacingX.sm}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      ) : null}

      {showBrowse ? (
        <>
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onChange={onCategoryChange}
          />

          <Animated.View style={recommendedStyle}>
            <SectionHeader
              title="Daily Recommended"
              subtitle="Based on your recent progress"
              containerStyle={styles.sectionSpacing}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedRow}
            >
              {recommendedTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onPress={() => onPressTool(tool)}
                  variant="compact"
                  style={styles.recommendedCard}
                />
              ))}
            </ScrollView>
          </Animated.View>

          <SectionHeader title="All Tools" containerStyle={styles.sectionSpacing} />
        </>
      ) : query.length > 0 ? (
        <SectionHeader title="Search Results" containerStyle={styles.sectionSpacing} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacingX.md,
  },
  titleBlock: {
    marginBottom: spacingY.md,
    flex: 1,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.libraryText,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.libraryMuted,
    marginTop: spacingY.xxs,
  },
  searchButton: {
    width: spacingX.xxl,
    height: spacingX.xxl,
    borderRadius: spacingX.xxl / 2,
    backgroundColor: colors.primary_20,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
    marginBottom: spacingY.md,
  },
  searchField: {
    flex: 1,
  },
  cancelButton: {
    paddingHorizontal: spacingX.xs,
    paddingVertical: spacingY.xs,
  },
  cancelText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textDark,
  },
  sectionSpacing: {
    marginTop: spacingY.lg,
  },
  recommendedRow: {
    gap: spacingX.md,
    paddingBottom: spacingY.sm,
  },
  recommendedCard: {
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
});

export default LibraryHeader;
