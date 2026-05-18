import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { WaveformVisualizer } from './WaveformVisualizer';

interface GentleOnsetSessionProps {
  onComplete: (stats: { softCount: number; hardCount: number; attempts: number }) => void;
}

const WORD_LIST = [
  'Easy', 'Apple', 'Ocean', 'Always', 'Under', // Vowels
  'Soft', 'Feather', 'View', 'Shine', 'Hello', // Fricatives
  'Base', 'Time', 'Door', 'Keep', 'Go',       // Plosives
];

export const GentleOnsetSession: React.FC<GentleOnsetSessionProps> = ({ onComplete }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [softCount, setSoftCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const [waveColor, setWaveColor] = useState(colors.secondary);
  const [waveActive, setWaveActive] = useState(false);
  const [waveAmplitude, setWaveAmplitude] = useState(0.2);

  const handleAction = (type: 'soft' | 'hard') => {
    setAttempts(prev => prev + 1);
    
    if (type === 'soft') {
      setSoftCount(prev => prev + 1);
      setWaveColor(colors.success);
      setWaveAmplitude(0.4);
      setWaveActive(true);
      
      setTimeout(() => {
        setWaveActive(false);
        if (wordIndex < WORD_LIST.length - 1) {
          setWordIndex(prev => prev + 1);
          setWaveColor(colors.secondary);
          setWaveAmplitude(0.2);
        } else {
          onComplete({
            softCount: softCount + 1,
            hardCount,
            attempts: attempts + 1
          });
        }
      }, 1000);

    } else {
      setHardCount(prev => prev + 1);
      setWaveColor(colors.error);
      setWaveAmplitude(1.0); // Spiky
      setWaveActive(true);
      
      setTimeout(() => {
        setWaveActive(false);
        setWaveColor(colors.secondary);
        setWaveAmplitude(0.2);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} exiting={FadeOut} key={wordIndex} style={styles.wordContainer}>
        <Text style={styles.wordLabel}>Word {wordIndex + 1} of {WORD_LIST.length}</Text>
        <Text style={styles.wordText}>{WORD_LIST[wordIndex]}</Text>
      </Animated.View>

      <View style={styles.visualizerContainer}>
        <WaveformVisualizer 
          isActive={waveActive} 
          amplitude={waveAmplitude} 
          color={waveColor} 
          barCount={30} 
        />
      </View>

      <View style={styles.controls}>
        <Text style={styles.instructionText}>
          Read the word aloud. Focus on starting the sound gently.
        </Text>
        
        <View style={styles.buttonRow}>
          <Pressable 
            style={[styles.btn, styles.btnHard]} 
            onPress={() => handleAction('hard')}
            disabled={waveActive}
          >
            <Text style={styles.btnHardText}>Try Again</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.btn, styles.btnSoft]} 
            onPress={() => handleAction('soft')}
            disabled={waveActive}
          >
            <Text style={styles.btnSoftText}>Got It</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacingY.xl,
  },
  wordContainer: {
    alignItems: 'center',
    marginTop: spacingY.xxl,
  },
  wordLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginBottom: spacingY.sm,
  },
  wordText: {
    fontFamily: FONTS.primaryBlack,
    fontSize: 48,
    color: colors.textDark,
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  controls: {
    alignItems: 'center',
    paddingHorizontal: spacingX.lg,
  },
  instructionText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacingY.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacingX.md,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: spacingY.md,
    borderRadius: radii.pill,
    alignItems: 'center',
    borderWidth: 2,
  },
  btnHard: {
    backgroundColor: 'transparent',
    borderColor: colors.libraryBorder,
  },
  btnSoft: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  btnHardText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  btnSoftText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
});
