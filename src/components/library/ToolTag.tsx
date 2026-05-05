import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LIBRARY_CATEGORY_STYLES } from "../../data/libraryTools";
import { FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";
import { LibraryCategory } from "../../types/library";

interface ToolTagProps {
  category: LibraryCategory;
}

const ToolTag: React.FC<ToolTagProps> = ({ category }) => {
  const style = LIBRARY_CATEGORY_STYLES[category];

  return (
    <View style={[styles.container, { backgroundColor: style.tagBg }]}>
      <Text style={[styles.text, { color: style.tagText }]}>{style.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xxs,
  },
  text: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
  },
});

export default ToolTag;
