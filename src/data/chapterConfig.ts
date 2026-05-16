import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/Theme";

export const CHAPTER_ACCENT: Record<string, string> = {
  "1": colors.secondary,
  "2": colors.categorySelfAwareness,
  "3": colors.categoryCBT,
  "4": colors.warning,
  "5": colors.categoryEducation,
};

export const CHAPTER_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  "1": "leaf-outline",
  "2": "water-outline",
  "3": "musical-notes-outline",
  "4": "shield-checkmark-outline",
  "5": "rocket-outline",
};

export const CHAPTER_TITLE: Record<string, string> = {
  "1": "Foundation & Awareness",
  "2": "Breathing & Relaxation",
  "3": "Rhythm & Pace",
  "4": "Confidence Building",
  "5": "Advanced Techniques",
};

export const CATEGORY_ACCENT: Record<string, string> = {
  education: colors.categoryEducation,
  self_awareness: colors.categorySelfAwareness,
  cognitive_behavioral: colors.categoryCBT,
  self_advocacy: colors.categorySelfAdvocacy,
  breathing_technique: colors.categoryEducation,
  tension_reduction: colors.categorySelfAwareness,
  breath_speech_coordination: colors.categoryCBT,
  rate_control: colors.categorySelfAdvocacy,
};
