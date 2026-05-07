import React, { useEffect, useRef, useState } from "react";
import {
    LayoutChangeEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";
import { LibraryCategory } from "../../types/library";

interface CategoryTabsProps {
  categories: { key: LibraryCategory; label: string }[];
  activeCategory: LibraryCategory;
  onChange: (category: LibraryCategory) => void;
}

interface TabLayout {
  x: number;
  width: number;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onChange,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [layouts, setLayouts] = useState<Record<string, TabLayout>>({});

  useEffect(() => {
    const layout = layouts[activeCategory];
    if (!layout) {
      return;
    }
    scrollRef.current?.scrollTo({
      x: Math.max(layout.x - spacingX.lg, 0),
      animated: true,
    });
  }, [activeCategory, layouts]);

  const handleLayout = (key: string) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setLayouts((prev) => ({ ...prev, [key]: { x, width } }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.tabsRow}>
          {categories.map((category) => {
            const isActive = category.key === activeCategory;
            return (
              <Pressable
                key={category.key}
                onPress={() => onChange(category.key)}
                onLayout={handleLayout(category.key)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Text style={[styles.tabText, isActive && styles.activeText]}>
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacingY.sm,
    marginBottom: spacingY.md,
  },
  scrollContent: {
    paddingBottom: spacingY.xs,
  },
  tabsRow: {
    flexDirection: "row",
    gap: spacingX.sm,
    position: "relative",
  },
  tab: {
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.libraryCard,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: colors.primary_10,
    borderColor: colors.primary10,
  },
  tabText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  activeText: {
    fontFamily: FONTS.primaryBold,
    color: colors.textDark,
  },
});

export default CategoryTabs;
