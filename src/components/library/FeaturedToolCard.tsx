import { ArrowRight, Clock } from "lucide-react-native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import {
    colors,
    dynamicSpacingY,
    FONTS,
    fontSizes,
    radii,
    spacingX,
    spacingY,
} from "../../theme/Theme";
import { LibraryTool } from "../../types/library";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FeaturedToolCardProps {
  tool: LibraryTool;
  onPress: () => void;
  style?: ViewStyle;
}

const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({
  tool,
  onPress,
  style,
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(pressed.value ? 0.98 : 1, {
          damping: 16,
          stiffness: 140,
        }),
      },
    ],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      style={[styles.container, animatedStyle, style]}
    >
      <View style={styles.card}>
        <Image source={{ uri: tool.heroImage }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{tool.name}</Text>
          <Text style={styles.summary} numberOfLines={1}>
            {tool.summary}
          </Text>
          <View style={styles.footer}>
            <View style={styles.meta}>
              <Clock size={14} color={colors.libraryMuted} />
              <Text style={styles.metaText}>{tool.durationMinutes} min</Text>
            </View>
            <View style={styles.startWrap}>
              <Text style={styles.startText}>Start</Text>
              <ArrowRight size={14} color={colors.libraryText} />
            </View>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
  },
  card: {
    backgroundColor: colors.libraryCard,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: dynamicSpacingY(16),
  },
  content: {
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.sm,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.libraryText,
  },
  summary: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.libraryMuted,
    marginTop: spacingY.xxs,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacingY.sm,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xs,
  },
  metaText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.libraryMuted,
  },
  startWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xxs,
  },
  startText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.libraryText,
  },
});

export default FeaturedToolCard;
