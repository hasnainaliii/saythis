import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, BookOpen } from 'lucide-react-native';
import { colors, FONTS, fontSizes, spacingX, spacingY, radii } from '../../theme/Theme';
import { useTrackerStore } from '../../store/trackerStore';

export default function JournalScreen() {
  const router = useRouter();
  const { journalEntry, setJournal } = useTrackerStore();
  const [text, setText] = useState(journalEntry);

  const handleSave = () => {
    setJournal(text);
    router.back();
  };

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

        <View style={styles.content}>
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
    paddingTop: spacingY.xl,
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
});
