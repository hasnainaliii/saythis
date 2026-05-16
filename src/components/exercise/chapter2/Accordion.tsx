import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';

interface AccordionItemProps {
  title: string;
  titleColor?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title, titleColor = colors.textDark, children, isOpen, onToggle,
}) => {
  const height = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    height.value = withSpring(isOpen ? 1 : 0, { damping: 18, stiffness: 120 });
    rotate.value = withSpring(isOpen ? 1 : 0, { damping: 18, stiffness: 120 });
  }, [isOpen]);

  const bodyStyle = useAnimatedStyle(() => ({
    maxHeight: height.value * 300,
    opacity: height.value,
    overflow: 'hidden' as const,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 180}deg` }],
  }));

  return (
    <View style={styles.item}>
      <Pressable style={styles.header} onPress={onToggle}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={2}>
          {title}
        </Text>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
        </Animated.View>
      </Pressable>
      <Animated.View style={bodyStyle}>
        <View style={styles.body}>{children}</View>
      </Animated.View>
    </View>
  );
};

interface SingleOpenAccordionProps {
  items: { title: string; content: string; titleColor?: string }[];
}

export const SingleOpenAccordion: React.FC<SingleOpenAccordionProps> = ({ items }) => {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  return (
    <View>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          titleColor={item.titleColor}
          isOpen={openIdx === i}
          onToggle={() => setOpenIdx(openIdx === i ? null : i)}
        >
          <Text style={styles.bodyText}>{item.content}</Text>
        </AccordionItem>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    marginBottom: spacingY.xs,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacingX.md,
  },
  title: {
    flex: 1,
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    marginRight: spacingX.sm,
  },
  body: { paddingHorizontal: spacingX.md, paddingBottom: spacingY.sm },
  bodyText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textDark,
    lineHeight: 20,
  },
});
