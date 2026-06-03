import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, BookOpen } from 'lucide-react-native';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { useTrackerStore } from '../../store/trackerStore';
import JournalCalendar from '../../components/journal/JournalCalendar';
import EmptyJournalState from '../../components/journal/EmptyJournalState';

export default function JournalScreen() {
  const router = useRouter();
  const { journalEntry, setJournal, getJournalByDate } = useTrackerStore();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [text, setText] = useState(journalEntry);
  const [pastEntry, setPastEntry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDate !== todayStr) {
      const fetchPastEntry = async () => {
        setIsLoading(true);
        const entry = await getJournalByDate(selectedDate);
        setPastEntry(entry);
        setIsLoading(false);
      };
      fetchPastEntry();
    }
  }, [selectedDate, todayStr, getJournalByDate]);

  const handleSave = () => {
    if (selectedDate === todayStr) {
      setJournal(text);
      router.back();
    }
  };

  const isToday = selectedDate === todayStr;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.textDark} />
          </Pressable>
          <Text style={styles.headerTitle}>Mindful Journal</Text>
          <View style={{ width: 40 }} />
        </View>

        <JournalCalendar 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
        />

        <View style={styles.content}>
          {isToday ? (
            <>
              <View style={styles.iconContainer}>
                <BookOpen size={48} color={colors.metricOrange} />
              </View>
              <Text style={styles.title}>What's on your mind today?</Text>
              
              <TextInput
                style={styles.textArea}
                multiline
                placeholder="Write your thoughts here..."
                placeholderTextColor={colors.textDisabled}
                value={text}
                onChangeText={setText}
                textAlignVertical="top"
              />

              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Entry</Text>
              </Pressable>
            </>
          ) : (
            <ScrollView style={styles.pastEntryContainer} showsVerticalScrollIndicator={false}>
              {pastEntry ? (
                <View style={styles.readOnlyCard}>
                  <Text style={styles.readOnlyDate}>
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Text>
                  <Text style={styles.readOnlyText}>{pastEntry}</Text>
                </View>
              ) : (
                !isLoading && <EmptyJournalState />
              )}
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingHorizontal: spacingX.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.metricOrange + '22',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY.lg,
    alignSelf: 'center',
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacingY.lg,
  },
  textArea: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacingX.lg,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacingY.xl,
  },
  saveButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacingY.md,
    paddingHorizontal: spacingX.xl * 2,
    borderRadius: radii.pill,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacingY.xl,
  },
  saveButtonText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.white,
  },
  pastEntryContainer: {
    flex: 1,
  },
  readOnlyCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacingX.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacingY.xl,
    minHeight: 200,
  },
  readOnlyDate: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.metricOrange,
    marginBottom: spacingY.md,
  },
  readOnlyText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    lineHeight: fontSizes.medium * 1.5,
  },
});
