import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import { LIBRARY_CATEGORY_STYLES } from "../../data/libraryTools";
import {
    colors,
    FONTS,
    fontSizes,
    spacingX,
    spacingY,
} from "../../theme/Theme";
import { LibraryCategory, LibraryTool } from "../../types/library";
import CategoryTabs from "./CategoryTabs";
import FeaturedToolCard from "./FeaturedToolCard";
import SectionHeader from "./SectionHeader";

interface LibraryHeaderProps {
  title: string;
  categories: { key: LibraryCategory; label: string }[];
  activeCategory: LibraryCategory;
  onCategoryChange: (category: LibraryCategory) => void;
  recommendedTools: LibraryTool[];
  onPressTool: (tool: LibraryTool) => void;
  scrollY: SharedValue<number>;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  title,
  categories,
  activeCategory,
  onCategoryChange,
  recommendedTools,
  onPressTool,
  scrollY,
}) => {
  const recommendedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 160], [0, -12]);
    const opacity = interpolate(scrollY.value, [0, 120], [1, 0.9]);

    return { transform: [{ translateY }], opacity };
  });
  const featuredTool = recommendedTools[0];
  const activeLabel = LIBRARY_CATEGORY_STYLES[activeCategory]?.label ?? "All";
  const toolsTitle =
    activeCategory === "all" ? "All Tools" : `${activeLabel} Tools`;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <View style={styles.headerDivider} />

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={onCategoryChange}
      />

      {featuredTool ? (
        <Animated.View style={recommendedStyle}>
          <SectionHeader
            title="Daily Recommended"
            containerStyle={styles.sectionSpacing}
          />
          <FeaturedToolCard
            tool={featuredTool}
            onPress={() => onPressTool(featuredTool)}
          />
        </Animated.View>
      ) : null}

      <SectionHeader title={toolsTitle} containerStyle={styles.sectionSpacing} />
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
  headerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.libraryBorder,
    marginBottom: spacingY.md,
  },
  sectionSpacing: {
    marginTop: spacingY.lg,
  },
});

export default LibraryHeader;
