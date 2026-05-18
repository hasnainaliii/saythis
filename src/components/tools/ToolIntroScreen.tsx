import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { InstructionCard } from './InstructionCard';
import { HoldToContinueButton } from './HoldToContinueButton';

interface IntroCard {
  icon: string;
  iconColor: string;
  title: string;
  body: string;
  highlight?: string;
  step?: number;
}

interface ToolIntroScreenProps {
  toolName: string;
  tagline: string;
  accentColor: string;
  cards: IntroCard[];
  holdLabel?: string;
  onComplete: () => void;
}

export const ToolIntroScreen: React.FC<ToolIntroScreenProps> = ({
  toolName,
  tagline,
  accentColor,
  cards,
  holdLabel = 'Hold to continue',
  onComplete,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentCard, setCurrentCard] = useState(0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color={colors.textDark} />
      </Pressable>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: accentColor + '22' }]}>
            <Ionicons name={cards[0]?.icon as any} size={32} color={accentColor} />
          </View>
          <Text style={styles.toolName}>{toolName}</Text>
          <Text style={styles.tagline}>{tagline}</Text>
        </View>

        <Animated.View entering={FadeIn.duration(300)} key={currentCard}>
          <InstructionCard
            icon={<Ionicons name={cards[currentCard].icon as any} size={28} color={cards[currentCard].iconColor} />}
            title={cards[currentCard].title}
            body={cards[currentCard].body}
            highlight={cards[currentCard].highlight}
            step={cards[currentCard].step}
          />
        </Animated.View>

        <View style={styles.navRow}>
          <Pressable
            onPress={() => setCurrentCard(Math.max(0, currentCard - 1))}
            disabled={currentCard === 0}
          >
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={currentCard === 0 ? colors.textDisabled : colors.textMuted}
            />
          </Pressable>
          <View style={styles.dots}>
            {cards.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentCard && { backgroundColor: accentColor }]}
              />
            ))}
          </View>
          <Pressable
            onPress={() => setCurrentCard(Math.min(cards.length - 1, currentCard + 1))}
            disabled={currentCard === cards.length - 1}
          >
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={currentCard === cards.length - 1 ? colors.textDisabled : colors.textMuted}
            />
          </Pressable>
        </View>

        {currentCard === cards.length - 1 && (
          <HoldToContinueButton
            label={holdLabel}
            holdDurationMs={1500}
            onComplete={onComplete}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.librarySurface,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: spacingX.md, marginTop: spacingY.xs,
  },
  scroll: { flex: 1 },
  content: { padding: spacingX.md, paddingBottom: spacingY.xxl },
  header: { alignItems: 'center', marginVertical: spacingY.lg },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: spacingY.sm,
  },
  toolName: {
    fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xl,
    color: colors.textDark, marginBottom: spacingY.xxs,
  },
  tagline: {
    fontFamily: FONTS.primary, fontSize: fontSizes.small,
    color: colors.textMuted, textAlign: 'center',
  },
  navRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', marginVertical: spacingY.md,
  },
  dots: { flexDirection: 'row', gap: spacingX.xs, marginHorizontal: spacingX.md },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.libraryBorder,
  },
});
