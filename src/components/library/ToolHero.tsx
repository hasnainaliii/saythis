import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
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

interface ToolHeroProps {
  tool: LibraryTool;
  scrollY: SharedValue<number>;
}

const ToolHero: React.FC<ToolHeroProps> = ({ tool, scrollY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 180], [0, -28]);
    const scale = interpolate(scrollY.value, [0, 180], [1, 1.08]);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: tool.heroImage }}
        style={[styles.image, animatedStyle]}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>Library Tool</Text>
        <Text style={styles.title}>{tool.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: dynamicSpacingY(28),
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.libraryOverlay,
  },
  titleBlock: {
    position: "absolute",
    left: spacingX.lg,
    right: spacingX.lg,
    bottom: spacingY.lg,
  },
  kicker: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.libraryMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacingY.xxs,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.libraryText,
  },
});

export default ToolHero;
