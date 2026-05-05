import { CheckCircle2, Lock } from "lucide-react-native";
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
import ToolTag from "./ToolTag";
import { TOOL_ICON_MAP } from "./toolIcons";

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
  const Icon = TOOL_ICON_MAP[tool.iconKey];
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
        <View style={[styles.content, isCompact && styles.contentCompact]}>
          <View style={styles.headerRow}>
            <View style={[styles.iconWrap, isCompact && styles.iconWrapCompact]}>
              <Icon size={isCompact ? 18 : 22} color={colors.libraryText} />
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
          </View>

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
            <ToolTag category={tool.category} />
            <Text style={styles.duration}>{tool.durationMinutes} min</Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  iconWrap: {
    width: dynamicSpacingY(4.5),
    height: dynamicSpacingY(4.5),
    borderRadius: radii.pill,
    backgroundColor: colors.libraryCardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapCompact: {
    width: dynamicSpacingY(3.6),
    height: dynamicSpacingY(3.6),
  },
  statusBadge: {
    minHeight: dynamicSpacingY(3),
    minWidth: dynamicSpacingY(3),
    borderRadius: radii.pill,
    backgroundColor: colors.libraryCardAlt,
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
  duration: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.tiny,
    color: colors.librarySoft,
  },
});

export default ToolCard;
