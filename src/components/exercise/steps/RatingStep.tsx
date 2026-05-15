import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Exercise } from '../../../data/chapter1Data';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../../theme/Theme';

interface RatingStepProps {
  exercise: Exercise;
  onComplete: (rating: number, notes: string) => void;
}

const RatingStep: React.FC<RatingStepProps> = ({ exercise, onComplete }) => {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const { progress_tracking } = exercise;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.checkCircleWrap}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={32} color={colors.success} />
        </View>
        <Text style={styles.completeTitle}>Exercise Complete!</Text>
        <Text style={styles.completeSub}>{progress_tracking.completion_criteria}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>How did it go?</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <StarButton
              key={star}
              starNum={star}
              isActive={star <= rating}
              onPress={() => setRating(star)}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What you've gained:</Text>
        {exercise.expected_outcomes.map((outcome, i) => (
          <OutcomeRow key={i} text={outcome} index={i} />
        ))}
      </View>

      {progress_tracking.notes_enabled && (
        <View style={styles.notesWrap}>
          <TextInput
            style={styles.notesInput}
            placeholder="Add a note about this session..."
            placeholderTextColor={colors.textDisabled}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      )}

      <Pressable style={styles.saveBtn} onPress={() => onComplete(rating, notes)}>
        <Text style={styles.saveBtnText}>Save & Complete</Text>
      </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
          size={32}
          color={isActive ? colors.star : colors.border}
        />
      </Animated.View>
    </Pressable>
  );
};

const OutcomeRow: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      index * 80,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) }),
    );
  }, [index, opacity, translateY]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.outcomeRow, anim]}>
      <Ionicons name="checkmark-circle" size={18} color={colors.success} />
      <Text style={styles.outcomeText}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: spacingX.lg, paddingBottom: 100 },
  checkCircleWrap: {
    alignItems: 'center',
    paddingVertical: spacingY.lg,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY.sm,
  },
  completeTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    marginBottom: spacingY.xxs,
  },
  completeSub: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacingX.md,
    marginBottom: spacingY.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.sm,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  outcomeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacingX.sm,
    marginBottom: spacingY.sm,
  },
  outcomeText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: 24,
  },
  notesWrap: { marginBottom: spacingY.md },
  notesInput: {
    backgroundColor: colors.primary10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacingX.md,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radii.xl,
    paddingVertical: spacingY.sm,
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});

export default RatingStep;
