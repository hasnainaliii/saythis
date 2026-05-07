import { ArrowRight, CheckCircle2, Clock, Lock } from "lucide-react-native";
import React from "react";
import {
    Image,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { LIBRARY_CATEGORY_STYLES } from "../../data/libraryTools";
import {
    colors,
    dynamicSpacingX,
    dynamicSpacingY,
    FONTS,
    fontSizes,
    radii,
    spacingX,
    spacingY,
} from "../../theme/Theme";
import { LibraryTool } from "../../types/library";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ToolCardProps {
  tool: LibraryTool;
  onPress: () => void;
  variant?: "grid" | "compact";
  style?: StyleProp<ViewStyle>;
  showStatus?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onPress,
  variant = "grid",
  style,
  showStatus = true,
}) => {
  const pressed = useSharedValue(0);
  const cardStyle = LIBRARY_CATEGORY_STYLES[tool.category];
  const isCompact = variant === "compact";
  const showStatusIcon = tool.isLocked || tool.completedToday;
  const imageSource = tool.heroImage;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(pressed.value ? 0.97 : 1, {
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
      style={[animatedStyle, styles.pressable, style]}
    >
      <View style={[styles.card, isCompact && styles.cardCompact]}>
        <View
          style={[
            styles.mediaWrap,
            { backgroundColor: cardStyle.tagBg },
            isCompact && styles.mediaWrapCompact,
          ]}
        >
          <Image
            source={{ uri: imageSource }}
            style={styles.media}
            resizeMode="cover"
          />
        </View>
        {showStatus && showStatusIcon ? (
          <View style={styles.statusBadge}>
            {tool.isLocked ? (
              <Lock size={14} color={colors.librarySoft} />
            ) : tool.completedToday ? (
              <CheckCircle2 size={14} color={colors.libraryAccent} />
            ) : null}
          </View>
        ) : null}

        <View style={[styles.content, isCompact && styles.contentCompact]}>
          <Text
            style={[styles.title, isCompact && styles.titleCompact]}
            numberOfLines={2}
          >
            {tool.name}
          </Text>
          <Text
            style={[styles.summary, isCompact && styles.summaryCompact]}
            numberOfLines={1}
          >
            {tool.summary}
          </Text>

          <View style={styles.footer}>
            <View style={styles.metaRow}>
              <Clock size={14} color={colors.libraryMuted} />
              <Text style={styles.metaText}>{tool.durationMinutes} min</Text>
            </View>
            <View style={styles.startRow}>
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
  pressable: {
    borderRadius: radii.lg,
    overflow: "hidden",
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    backgroundColor: colors.libraryCard,
    minHeight: dynamicSpacingY(20),
  },
  cardCompact: {
    width: dynamicSpacingX(42),
  },
  mediaWrap: {
    height: dynamicSpacingY(9.5),
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    overflow: "hidden",
  },
  mediaWrapCompact: {
    height: dynamicSpacingY(7),
  },
  media: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: spacingX.md,
  },
  contentCompact: {
    padding: spacingX.sm,
  },
  statusBadge: {
    position: "absolute",
    right: spacingX.sm,
    top: spacingY.sm,
    minHeight: dynamicSpacingY(3),
    minWidth: dynamicSpacingY(3),
    borderRadius: radii.pill,
    backgroundColor: colors.libraryCard,
    borderWidth: 1,
    borderColor: colors.libraryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.libraryText,
    marginTop: spacingY.sm,
  },
  titleCompact: {
    fontSize: fontSizes.small,
    marginTop: spacingY.xs,
  },
  summary: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.libraryMuted,
    marginTop: spacingY.xs,
  },
  summaryCompact: {
    fontSize: fontSizes.tiny,
  },
  footer: {
    marginTop: spacingY.sm,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xxs,
  },
  metaText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.libraryMuted,
  },
  startRow: {
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

export default ToolCard;
