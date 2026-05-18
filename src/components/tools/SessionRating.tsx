import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';

interface SessionRatingProps {
  onRate: (rating: number) => void;
  onSkip: () => void;
}

export const SessionRating: React.FC<SessionRatingProps> = ({ onRate, onSkip }) => {
  const [rating, setRating] = useState(0);

  const handleRate = (value: number) => {
    setRating(value);
    onRate(value);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>How did this session feel?</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <StarButton
            key={star}
            starNum={star}
            isActive={star <= rating}
            onPress={() => handleRate(star)}
          />
        ))}
      </View>
    </View>
  );
};

const StarButton: React.FC<{
  starNum: number;
  isActive: boolean;
  onPress: () => void;
}> = ({ isActive, onPress }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      scale.value = withTiming(1.15, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 150 });
      });
    }
  }, [isActive, scale]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={anim}>
        <Ionicons
          name={isActive ? 'star' : 'star-outline'}
          size={40}
          color={isActive ? colors.star : colors.libraryBorder}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.libraryCard,
    borderRadius: radii.lg,
    padding: spacingX.md,
    marginVertical: spacingY.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.libraryBorder,
  },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.md,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacingX.sm,
    marginBottom: spacingY.md,
  },
  skipBtn: {
    padding: spacingY.xs,
  },
  skipText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
