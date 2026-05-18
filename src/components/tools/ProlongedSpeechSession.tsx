import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';

const PASSAGE = "Speech is a complex motor task. It requires coordination of breathing, voicing, and articulation. When we slow down, we give our brain more time to plan the next movement. This reduces tension and helps words flow more smoothly. Stretching the vowels is a great way to control your pace.";
const WORDS = PASSAGE.split(' ');

interface ProlongedSpeechSessionProps {
  targetWpm: number;
  onComplete: (stats: { overSpeedCount: number; completionPercentage: number; estimatedWpm: number }) => void;
  onCancel: () => void;
}

export const ProlongedSpeechSession: React.FC<ProlongedSpeechSessionProps> = ({ 
  targetWpm, 
  onComplete,
  onCancel 
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [dotIndex, setDotIndex] = useState(0);
  const [userIndex, setUserIndex] = useState(0);
  const [wordStatuses, setWordStatuses] = useState<('none' | 'green' | 'orange')[]>(Array(WORDS.length).fill('none'));
  const [overSpeedCount, setOverSpeedCount] = useState(0);
  
  const startTimeRef = useRef<number | null>(null);

  // WPM to MS per word
  const msPerWord = (60 / targetWpm) * 1000;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && dotIndex < WORDS.length) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();

      interval = setInterval(() => {
        setDotIndex(prev => {
          if (prev >= WORDS.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, msPerWord);
    }
    return () => clearInterval(interval);
  }, [isPlaying, dotIndex, msPerWord]);

  useEffect(() => {
    if (userIndex >= WORDS.length && WORDS.length > 0) {
      handleComplete();
    }
  }, [userIndex]);

  const handleComplete = () => {
    setIsPlaying(false);
    const durationMin = (Date.now() - (startTimeRef.current || Date.now())) / 60000;
    const estWpm = durationMin > 0 ? WORDS.length / durationMin : targetWpm;
    
    onComplete({
      overSpeedCount,
      completionPercentage: Math.round((userIndex / WORDS.length) * 100),
      estimatedWpm: Math.round(estWpm)
    });
  };

  const handleWordTap = (index: number) => {
    if (!isPlaying) setIsPlaying(true);
    
    // Only allow tapping the next sequential word
    if (index !== userIndex) return;

    const newStatuses = [...wordStatuses];
    
    if (index > dotIndex) {
      newStatuses[index] = 'orange';
      setOverSpeedCount(prev => prev + 1);
    } else {
      newStatuses[index] = 'green';
    }
    
    setWordStatuses(newStatuses);
    setUserIndex(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onCancel} style={styles.iconBtn}>
          <Ionicons name="close" size={24} color={colors.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Target: {targetWpm} WPM</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          Tap each word as you speak it. Don't beat the dot!
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.passageContainer}>
        <View style={styles.wordWrap}>
          {WORDS.map((word, index) => {
            const status = wordStatuses[index];
            const isDotHere = index === dotIndex;
            const isNext = index === userIndex;

            let bgColor = 'transparent';
            if (status === 'green') bgColor = colors.success + '33'; // light green
            if (status === 'orange') bgColor = colors.warning + '33'; // light orange

            return (
              <Pressable 
                key={index} 
                style={[styles.wordBox, { backgroundColor: bgColor }]}
                onPress={() => handleWordTap(index)}
              >
                <Text style={[
                  styles.wordText, 
                  isNext && !isPlaying ? styles.wordNext : null,
                  status !== 'none' ? { color: status === 'green' ? colors.successText : colors.warning } : null
                ]}>
                  {word}
                </Text>
                {/* Stretch Indicator Line */}
                <View style={styles.stretchLine} />
                {/* Metronome Dot */}
                {isDotHere && <View style={styles.dot} />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(userIndex / WORDS.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round((userIndex / WORDS.length) * 100)}%</Text>
      </View>
      
      <Pressable 
        style={styles.finishBtn} 
        onPress={handleComplete}
      >
        <Text style={styles.finishBtnText}>Finish Early</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.sm,
  },
  iconBtn: {
    padding: spacingY.xs,
  },
  headerTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  instructionBox: {
    padding: spacingX.lg,
    alignItems: 'center',
  },
  instructionText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  passageContainer: {
    padding: spacingX.lg,
  },
  wordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacingX.sm,
    rowGap: spacingY.lg,
  },
  wordBox: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: radii.sm,
    position: 'relative',
    alignItems: 'center',
  },
  wordText: {
    fontFamily: FONTS.primary,
    fontSize: 24,
    color: colors.textDark,
  },
  wordNext: {
    fontFamily: FONTS.primaryBold,
    color: colors.secondary,
  },
  stretchLine: {
    width: '80%',
    height: 2,
    backgroundColor: colors.libraryBorder,
    marginTop: 4,
    borderRadius: 1,
  },
  dot: {
    position: 'absolute',
    bottom: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.md,
    gap: spacingX.md,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.libraryBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    width: 40,
    textAlign: 'right',
  },
  finishBtn: {
    marginHorizontal: spacingX.lg,
    marginBottom: spacingY.xl,
    paddingVertical: spacingY.md,
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.libraryBorder,
  },
  finishBtnText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
  },
});
