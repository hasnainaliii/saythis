import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle as SvgCircle } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  Easing, interpolate,
} from 'react-native-reanimated';
import { colors, FONTS, fontSizes, radii } from '../../theme/Theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type BoxPhase = 'inhale' | 'hold_top' | 'exhale' | 'hold_bottom';

interface BoxBreathingVisualProps {
  currentPhase: BoxPhase;
  progress: number;
  secondsPerSide: number;
  accentColor: string;
}

const SIDE_LABELS: Record<BoxPhase, string> = {
  inhale: 'INHALE',
  hold_top: 'HOLD',
  exhale: 'EXHALE',
  hold_bottom: 'HOLD',
};

const PHASE_ORDER: BoxPhase[] = ['inhale', 'hold_top', 'exhale', 'hold_bottom'];

export const BoxBreathingVisual: React.FC<BoxBreathingVisualProps> = ({
  currentPhase,
  progress,
  secondsPerSide,
  accentColor,
}) => {
  const squareSize = wp('70%');
  const margin = 40;
  const svgSize = squareSize + margin * 2;
  const remaining = ((1 - progress) * secondsPerSide).toFixed(1);
  const phaseIdx = PHASE_ORDER.indexOf(currentPhase);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (currentPhase === 'inhale') {
      pulseScale.value = withTiming(1.02, { duration: secondsPerSide * 1000, easing: Easing.inOut(Easing.ease) });
    } else if (currentPhase === 'exhale') {
      pulseScale.value = withTiming(0.98, { duration: secondsPerSide * 1000, easing: Easing.inOut(Easing.ease) });
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [currentPhase, secondsPerSide]);

  const bgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  // Corner coordinates: BL → TL → TR → BR
  const BL = { x: margin, y: margin + squareSize };
  const TL = { x: margin, y: margin };
  const TR = { x: margin + squareSize, y: margin };
  const BR = { x: margin + squareSize, y: margin + squareSize };

  // Each phase draws a side
  const sides = [
    { from: BL, to: TL }, // inhale
    { from: TL, to: TR }, // hold_top
    { from: TR, to: BR }, // exhale
    { from: BR, to: BL }, // hold_bottom
  ];

  // Dot position along perimeter
  const totalPerimeter = squareSize * 4;
  const dotProgress = (phaseIdx + progress) / 4;
  const dotDist = dotProgress * totalPerimeter;

  const getDotPos = (dist: number) => {
    const d = dist % totalPerimeter;
    if (d <= squareSize) {
      return { x: BL.x, y: BL.y - d };
    } else if (d <= squareSize * 2) {
      return { x: TL.x + (d - squareSize), y: TL.y };
    } else if (d <= squareSize * 3) {
      return { x: TR.x, y: TR.y + (d - squareSize * 2) };
    } else {
      return { x: BR.x - (d - squareSize * 3), y: BR.y };
    }
  };

  const dotPos = getDotPos(dotDist);

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return colors.secondary;
      case 'hold_top': case 'hold_bottom': return colors.warning;
      case 'exhale': return colors.secondary;
    }
  };

  // Side label positions
  const labelPositions = [
    { x: margin - 14, y: margin + squareSize / 2, rotation: -90 }, // left: inhale
    { x: margin + squareSize / 2, y: margin - 14, rotation: 0 },   // top: hold
    { x: margin + squareSize + 14, y: margin + squareSize / 2, rotation: 90 }, // right: exhale
    { x: margin + squareSize / 2, y: margin + squareSize + 18, rotation: 0 }, // bottom: hold
  ];

  const corners = [BL, TL, TR, BR];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bgPulse, bgStyle, { width: squareSize, height: squareSize }]}>
        <View style={[styles.innerBg, {
          backgroundColor: currentPhase === 'inhale' ? accentColor + '18' : accentColor + '08',
          borderRadius: radii.xl,
        }]} />
      </Animated.View>

      <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {/* Base square */}
        <Rect
          x={margin} y={margin}
          width={squareSize} height={squareSize}
          rx={radii.xl} ry={radii.xl}
          fill="none"
          stroke={colors.libraryBorder}
          strokeWidth={2}
        />

        {/* Animated side strokes */}
        {sides.map((side, i) => {
          const isActive = i === phaseIdx;
          const isCompleted = i < phaseIdx || (i === 0 && phaseIdx === 0 && progress === 0 ? false : i < phaseIdx);
          const length = squareSize;

          if (!isActive && !isCompleted) return null;

          const dashOffset = isActive ? length * (1 - progress) : 0;

          return (
            <Line
              key={i}
              x1={side.from.x} y1={side.from.y}
              x2={side.to.x} y2={side.to.y}
              stroke={isActive ? accentColor : accentColor + '55'}
              strokeWidth={isActive ? 4 : 2}
              strokeLinecap="round"
              strokeDasharray={`${length}`}
              strokeDashoffset={dashOffset}
            />
          );
        })}

        {/* Corner dots */}
        {corners.map((c, i) => {
          const isStart = i === phaseIdx;
          return (
            <SvgCircle
              key={i}
              cx={c.x} cy={c.y}
              r={isStart ? 8 : 6}
              fill={isStart ? accentColor : colors.libraryBorder}
            />
          );
        })}

        {/* Traveling dot */}
        <SvgCircle
          cx={dotPos.x} cy={dotPos.y}
          r={8}
          fill={accentColor}
        />
      </Svg>

      {/* Side labels */}
      {PHASE_ORDER.map((phase, i) => {
        const isActive = i === phaseIdx;
        const pos = labelPositions[i];
        return (
          <Text
            key={phase + i}
            style={[
              styles.sideLabel,
              {
                position: 'absolute',
                left: pos.x - 20,
                top: pos.y - 6,
                color: isActive ? accentColor : colors.textDisabled,
                fontFamily: FONTS.primaryBold,
                fontSize: fontSizes.tiny,
                width: 60,
                textAlign: 'center',
              },
              pos.rotation !== 0 && { transform: [{ rotate: `${pos.rotation}deg` }] },
            ]}
          >
            {SIDE_LABELS[phase]}
          </Text>
        );
      })}

      {/* Center content */}
      <View style={[styles.center, { top: margin + squareSize * 0.35 }]}>
        <Text style={[styles.phaseLabel, { color: getPhaseColor() }]}>
          {SIDE_LABELS[currentPhase]}
        </Text>
        <Text style={styles.countdown}>{remaining}s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  bgPulse: { position: 'absolute', alignSelf: 'center' },
  innerBg: { flex: 1 },
  sideLabel: {},
  center: {
    position: 'absolute', alignSelf: 'center', alignItems: 'center',
  },
  phaseLabel: {
    fontFamily: FONTS.primaryBlack, fontSize: fontSizes.xl,
  },
  countdown: {
    fontFamily: FONTS.primary, fontSize: fontSizes.large,
    color: colors.textMuted, marginTop: 4,
  },
});
