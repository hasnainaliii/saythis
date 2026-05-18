import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/Theme";

export const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap; bg: string }
> = {
  education: {
    label: "Education",
    color: colors.categoryEducation,
    icon: "book-outline",
    bg: colors.categoryEducation + "15",
  },
  self_awareness: {
    label: "Self Awareness",
    color: colors.categorySelfAwareness,
    icon: "eye-outline",
    bg: colors.categorySelfAwareness + "15",
  },
  cognitive_behavioral: {
    label: "CBT",
    color: colors.categoryCBT,
    icon: "bulb-outline",
    bg: colors.categoryCBT + "15",
  },
  self_advocacy: {
    label: "Self Advocacy",
    color: colors.categorySelfAdvocacy,
    icon: "megaphone-outline",
    bg: colors.categorySelfAdvocacy + "15",
  },
  breathing_technique: {
    label: "Breathing",
    color: colors.categoryEducation,
    icon: "water-outline",
    bg: colors.categoryEducation + "15",
  },
  tension_reduction: {
    label: "Relaxation",
    color: colors.categorySelfAwareness,
    icon: "body-outline",
    bg: colors.categorySelfAwareness + "15",
  },
  breath_speech_coordination: {
    label: "Breath-Speech",
    color: colors.categoryCBT,
    icon: "mic-outline",
    bg: colors.categoryCBT + "15",
  },
  rate_control: {
    label: "Rate Control",
    color: colors.categorySelfAdvocacy,
    icon: "speedometer-outline",
    bg: colors.categorySelfAdvocacy + "15",
  },
};

export const DIFFICULTY_CONFIG: Record<
  "beginner" | "intermediate" | "advanced",
  { label: string; color: string }
> = {
  beginner: { label: "Beginner", color: colors.success },
  intermediate: { label: "Intermediate", color: colors.warning },
  advanced: { label: "Advanced", color: colors.errorLight },
};
