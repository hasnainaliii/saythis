import { Search, X } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors, FONTS, fontSizes, radii, spacingX, spacingY } from "../../theme/Theme";

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search tools...",
  onClear,
  autoFocus = false,
}) => {
  return (
    <View style={styles.container}>
      <Search size={18} color={colors.libraryMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.librarySoft}
        style={styles.input}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable onPress={onClear} hitSlop={spacingX.sm}>
          <X size={16} color={colors.libraryMuted} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.libraryCard,
    borderRadius: radii.lg,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.sm,
    gap: spacingX.sm,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.libraryBorder,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.small,
    fontFamily: FONTS.primary,
    color: colors.libraryText,
  },
});

export default SearchBar;
