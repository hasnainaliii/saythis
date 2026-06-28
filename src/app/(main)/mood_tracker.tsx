import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Svg, { Path, Polygon, Circle } from 'react-native-svg';
import { colors, FONTS, fontSizes, spacingX, spacingY } from '../../theme/Theme';
import { useMoodStore } from '../../store/moodStore';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const DIAL_WIDTH = width * 0.9;
const DIAL_HEIGHT = DIAL_WIDTH / 2;
const R = DIAL_WIDTH / 2;
const CX = R;
const CY = R;

const MOODS = [
  { name: 'Dizzy', color: '#A38FFB', emoji: require('../../assets/images/emoji/Purple-Dizzy.png'), start: 180, end: 144, center: 162, needleAngle: -72 },
  { name: 'Sad', color: '#FFA305', emoji: require('../../assets/images/emoji/Orange-Sad.png'), start: 144, end: 108, center: 126, needleAngle: -36 },
  { name: 'Neutral', color: '#C5A393', emoji: require('../../assets/images/emoji/Beige-Neutral.png'), start: 108, end: 72, center: 90, needleAngle: 0 },
  { name: 'Happy', color: '#FDC42C', emoji: require('../../assets/images/emoji/Yellow_Happy.png'), start: 72, end: 36, center: 54, needleAngle: 36 },
  { name: 'Great', color: '#99B762', emoji: require('../../assets/images/emoji/Green-Smile.png'), start: 36, end: 0, center: 18, needleAngle: 72 },
];

const getArcPath = (startAngle: number, endAngle: number) => {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = CX + R * Math.cos(startRad);
  const y1 = CY - R * Math.sin(startRad);
  const x2 = CX + R * Math.cos(endRad);
  const y2 = CY - R * Math.sin(endRad);
  return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} L ${CX} ${CY} Z`;
};

export default function MoodTrackerScreen() {
  const router = useRouter();
  const { currentMood, setMood, loadMood } = useMoodStore();
  const [selectedMood, setSelectedMood] = useState(currentMood || 'Neutral');
  
  const initialMoodObj = MOODS.find(m => m.name === currentMood) || MOODS[2];
  const rotation = useSharedValue(initialMoodObj.needleAngle);

  useEffect(() => {
    loadMood();
  }, []);

  useEffect(() => {
    const moodObj = MOODS.find(m => m.name === currentMood) || MOODS[2];
    setSelectedMood(moodObj.name);
    rotation.value = withSpring(moodObj.needleAngle, { damping: 15, stiffness: 100 });
  }, [currentMood]);

  const handleSelect = (moodName: string) => {
    setSelectedMood(moodName);
  };

  const handleMoodChange = (moodName: string) => {
    setSelectedMood(moodName);
  };

  const handleConfirm = () => {
    setMood(selectedMood);
    router.back();
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const dx = e.x - CX;
      const dy = CY - e.y;
      let angleDeg = Math.atan2(dx, dy) * (180 / Math.PI);
      if (angleDeg < -90) angleDeg = -90;
      if (angleDeg > 90) angleDeg = 90;
      rotation.value = angleDeg;
    })
    .onEnd((e) => {
      const dx = e.x - CX;
      const dy = CY - e.y;
      let angleDeg = Math.atan2(dx, dy) * (180 / Math.PI);
      if (angleDeg < -90) angleDeg = -90;
      if (angleDeg > 90) angleDeg = 90;
      
      let snappedMood = MOODS[2];
      let minDiff = Infinity;
      for(const m of MOODS) {
         const diff = Math.abs(angleDeg - m.needleAngle);
         if (diff < minDiff) {
            minDiff = diff;
            snappedMood = m;
         }
      }
      
      rotation.value = withSpring(snappedMood.needleAngle, { damping: 15, stiffness: 100 });
      runOnJS(handleMoodChange)(snappedMood.name);
    });

  const animatedPointerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: 10 },
        { translateY: R / 2 },
        { rotate: `${rotation.value}deg` },
        { translateX: -10 },
        { translateY: -R / 2 },
      ],
    };
  });

  const currentMoodObj = MOODS.find(m => m.name === selectedMood) || MOODS[2];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.textDark} />
          </Pressable>
          <Text style={styles.headerTitle}>Mood Tracker</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>How would you{'\n'}describe your mood?</Text>
          <Text style={styles.subtitle}>I Feel {selectedMood}.</Text>

          <Pressable style={styles.emojiContainer} onPress={handleConfirm}>
            <Image source={currentMoodObj.emoji} style={styles.mainEmoji} resizeMode="contain" />
            <View style={styles.indicator} />
          </Pressable>

          <View style={styles.dialWrapper}>
            <GestureDetector gesture={pan}>
              <View style={{ width: DIAL_WIDTH, height: DIAL_HEIGHT, position: 'relative' }}>
                <Svg width={DIAL_WIDTH} height={DIAL_WIDTH} viewBox={`0 0 ${DIAL_WIDTH} ${DIAL_WIDTH}`}>
                  {MOODS.map((m, i) => (
                    <Path key={i} d={getArcPath(m.start, m.end)} fill={m.color} />
                  ))}
                  {/* Inner Circle to create dial effect */}
                  <Circle cx={CX} cy={CY} r={R * 0.55} fill={colors.primary} />
                </Svg>

                {/* Small Emojis positioned on the arcs */}
                {MOODS.map((m, i) => {
                  const ex = CX + R * 0.75 * Math.cos((m.center * Math.PI) / 180) - 20;
                  const ey = CY - R * 0.75 * Math.sin((m.center * Math.PI) / 180) - 20;
                  return (
                    <Pressable
                      key={i}
                      style={[styles.smallEmojiWrapper, { left: ex, top: ey }]}
                      onPress={() => {
                        rotation.value = withSpring(m.needleAngle, { damping: 15, stiffness: 100 });
                        handleSelect(m.name);
                      }}
                    >
                      <Image source={m.emoji} style={styles.smallEmoji} resizeMode="contain" />
                    </Pressable>
                  );
                })}

                {/* Animated Pointer */}
                <Animated.View style={[{ position: 'absolute', top: 0, left: CX - 10, height: R, width: 20, overflow: 'visible' }, animatedPointerStyle]} pointerEvents="none">
                  <Svg width={20} height={R} viewBox={`0 0 20 ${R}`} style={{ overflow: 'visible' }}>
                    <Polygon points={`10,${R * 0.3} 15,${CY} 5,${CY}`} fill="#4A3B32" />
                    <Circle cx={10} cy={CY} r={10} fill="#4A3B32" />
                    <Circle cx={10} cy={CY} r={4} fill="#FFFFFF" />
                  </Svg>
                </Animated.View>
              </View>
            </GestureDetector>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacingY.xl,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacingY.lg,
  },
  subtitle: {
    fontFamily: FONTS.primaryMedium,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginBottom: spacingY.xl,
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingY.xxl,
  },
  mainEmoji: {
    width: 140,
    height: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  indicator: {
    width: 20,
    height: 8,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#CCC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopColor: 'transparent',
    marginTop: spacingY.lg,
    opacity: 0.5,
  },
  dialWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  smallEmojiWrapper: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallEmoji: {
    width: 32,
    height: 32,
    opacity: 0.9,
  },
});
