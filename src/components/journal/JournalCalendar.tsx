import React, { useRef, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';

interface JournalCalendarProps {
  selectedDate: string; // ISO format: YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export default function JournalCalendar({ selectedDate, onSelectDate }: JournalCalendarProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate past 30 days + today + future 7 days
  const dates = useMemo(() => {
    const generatedDates = [];
    const today = new Date();
    
    for (let i = -30; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      generatedDates.push({
        dateStr: d.toISOString().split('T')[0],
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: i === 0,
      });
    }
    return generatedDates;
  }, []);

  // Center the scrollview on today initially
  useEffect(() => {
    if (scrollViewRef.current) {
      // 30 days past * item width (~60)
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: 30 * 60 - 150, animated: true });
      }, 100);
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((item, index) => {
          const isSelected = item.dateStr === selectedDate;
          return (
            <Pressable
              key={item.dateStr}
              style={[
                styles.dateCard,
                isSelected && styles.dateCardSelected,
                item.isToday && !isSelected && styles.dateCardToday
              ]}
              onPress={() => onSelectDate(item.dateStr)}
            >
              <Text style={[
                styles.dayOfWeek,
                isSelected && styles.textSelected,
                item.isToday && !isSelected && styles.textToday
              ]}>
                {item.dayOfWeek}
              </Text>
              <Text style={[
                styles.dayNum,
                isSelected && styles.textSelected,
                item.isToday && !isSelected && styles.textToday
              ]}>
                {item.dayNum}
              </Text>
              {item.isToday && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    marginBottom: spacingY.lg,
  },
  scrollContent: {
    paddingHorizontal: spacingX.lg,
    alignItems: 'center',
    gap: spacingX.sm,
  },
  dateCard: {
    width: 56,
    height: 76,
    borderRadius: radii.xl,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateCardSelected: {
    backgroundColor: colors.metricOrange,
    borderColor: colors.metricOrange,
  },
  dateCardToday: {
    borderColor: colors.metricOrange,
    borderWidth: 2,
  },
  dayOfWeek: {
    fontFamily: FONTS.primaryMedium,
    fontSize: fontSizes.small,
    color: colors.textMuted,
    marginBottom: spacingY.xxs,
  },
  dayNum: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.textDark,
  },
  textSelected: {
    color: colors.white,
  },
  textToday: {
    color: colors.metricOrange,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.metricOrange,
    marginTop: 4,
  },
  dotSelected: {
    backgroundColor: colors.white,
  },
});
