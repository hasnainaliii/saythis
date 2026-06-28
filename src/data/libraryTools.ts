import { colors } from "../theme/Theme";
import { LibraryCategory, LibraryTool } from "../types/library";

export const LIBRARY_CATEGORIES: { key: LibraryCategory; label: string }[] = [
  { key: "all", label: "All" },
  // { key: "speech_fluency", label: "Speech Fluency" },
  { key: "breathing", label: "Breathing" },
  { key: "drills", label: "Drills" },
  { key: "biofeedback", label: "Biofeedback" },
  { key: "simulation", label: "Simulation" },
];

export const LIBRARY_CATEGORY_STYLES: Record<
  LibraryCategory,
  { label: string; tagBg: string; tagText: string; gradient: [string, string] }
> = {
  all: {
    label: "All",
    tagBg: colors.libraryCard,
    tagText: colors.libraryText,
    gradient: [colors.libraryCard, colors.libraryCardAlt],
  },
  speech_fluency: {
    label: "Speech Fluency",
    tagBg: colors.tagSpeechBg,
    tagText: colors.tagSpeechText,
    gradient: [colors.gradSpeechStart, colors.gradSpeechEnd],
  },
  breathing: {
    label: "Breathing",
    tagBg: colors.tagBreathingBg,
    tagText: colors.tagBreathingText,
    gradient: [colors.gradBreathingStart, colors.gradBreathingEnd],
  },
  drills: {
    label: "Drills",
    tagBg: colors.tagDrillsBg,
    tagText: colors.tagDrillsText,
    gradient: [colors.gradDrillsStart, colors.gradDrillsEnd],
  },
  biofeedback: {
    label: "Biofeedback",
    tagBg: colors.tagBiofeedbackBg,
    tagText: colors.tagBiofeedbackText,
    gradient: [colors.gradBiofeedbackStart, colors.gradBiofeedbackEnd],
  },
  simulation: {
    label: "Simulation",
    tagBg: colors.tagSimulationBg,
    tagText: colors.tagSimulationText,
    gradient: [colors.gradSimulationStart, colors.gradSimulationEnd],
  },
};

const HERO_IMAGES = {
  speech: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80",
  breathing: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
  drills: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?auto=format&fit=crop&w=1600&q=80",
  modification: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80",
  biofeedback: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80",
  gamification: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1600&q=80",
  simulation: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
  progress: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  relaxation: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80",
};

export const LAST_USED_TOOL_ID = "box-breathing";

export const LIBRARY_TOOLS: LibraryTool[] = [
  // { id: "daf", name: "DAF", summary: "Delay your voice to steady rhythm.", description: "Delayed auditory feedback shifts your timing so words feel more paced and predictable.", steps: ["Choose a delay level that feels comfortable.", "Read a short phrase and listen to the delay.", "Move to natural speech while keeping the new rhythm."], category: "speech_fluency", difficulty: "beginner", durationMinutes: 8, iconKey: "audio", heroImage: require("../assets/images/tools/daf.png"), relatedToolIds: ["faf"], isLocked: false, completedToday: true, isRecommended: true },
  // { id: "faf", name: "FAF", summary: "Shift pitch for smoother flow.", description: "Frequency altered feedback changes your voice tone, reducing tension and easing speech flow.", steps: ["Pick a gentle pitch shift.", "Practice short phrases with feedback.", "Lower the shift as speech feels easier."], category: "speech_fluency", difficulty: "beginner", durationMinutes: 7, iconKey: "volume", heroImage: require("../assets/images/tools/faf.png"), relatedToolIds: ["daf"], isLocked: false, completedToday: false },

  { id: "box-breathing", name: "Box Breathing", summary: "Calm your system in four counts.", description: "Box breathing steadies the nervous system to reduce tension before speech.", steps: ["Inhale for four counts.", "Hold for four counts.", "Exhale for four counts, then hold again."], category: "breathing", difficulty: "beginner", durationMinutes: 5, iconKey: "boxBreathing", heroImage: require("../assets/images/tools/box-breathing.png"), relatedToolIds: ["diaphragmatic-breathing"], isLocked: false, completedToday: true, isRecommended: true },
  { id: "diaphragmatic-breathing", name: "Diaphragmatic Breathing", summary: "Breathe low and steady.", description: "Deep belly breathing supports smoother airflow and calmer speech starts.", steps: ["Place a hand on your belly.", "Inhale and feel the belly rise.", "Speak a short phrase on a slow exhale."], category: "breathing", difficulty: "beginner", durationMinutes: 6, iconKey: "diaphragmatic", heroImage: require("../assets/images/tools/diaphragmatic-breathing.png"), relatedToolIds: ["box-breathing", "pre-speech-routine"], isLocked: false, completedToday: false },
  { id: "pre-speech-routine", name: "Pre-Speech Routine", summary: "Warm up your breath and voice.", description: "A short routine prepares airflow, posture, and focus before speaking tasks.", steps: ["Do two cycles of slow breathing.", "Hum lightly to relax the voice.", "Start with a gentle onset phrase."], category: "breathing", difficulty: "beginner", durationMinutes: 7, iconKey: "routine", heroImage: require("../assets/images/tools/pre-speech-routine.png"), relatedToolIds: ["diaphragmatic-breathing"], isLocked: false, completedToday: false },

  { id: "gentle-onset", name: "Gentle Onset Practice", summary: "Ease into vowels and words.", description: "Gentle onset reduces hard starts by softening voice onset and airflow.", steps: ["Take a slow breath.", "Start with an easy vowel.", "Blend into the full word."], category: "drills", difficulty: "beginner", durationMinutes: 8, iconKey: "gentleOnset", heroImage: require("../assets/images/tools/gentle-onset.png"), relatedToolIds: ["prolonged-speech"], isLocked: false, completedToday: true },
  { id: "prolonged-speech", name: "Prolonged Speech Stretcher", summary: "Stretch sounds for control.", description: "Prolonged speech slows rate and improves control across phrases.", steps: ["Stretch each vowel slightly.", "Keep airflow steady.", "Shorten gradually as control improves."], category: "drills", difficulty: "intermediate", durationMinutes: 12, iconKey: "prolonged", heroImage: require("../assets/images/tools/prolonged-speech.png"), relatedToolIds: ["gentle-onset"], isLocked: false, completedToday: false },

  { id: "stutter-tap-counter", name: "Stutter Tap Counter", summary: "Track moments with a quick tap.", description: "Tapping helps you capture stutter moments and build awareness over time.", steps: ["Tap once for each stutter.", "Review the count after a session.", "Note triggers and patterns."], category: "biofeedback", difficulty: "beginner", durationMinutes: 6, iconKey: "tapCounter", heroImage: require("../assets/images/tools/stutter-tap-counter.png"), relatedToolIds: ["timed-reading-wpm"], isLocked: false, completedToday: false },
  { id: "timed-reading-wpm", name: "Timed Reading WPM", summary: "Measure your reading speed.", description: "Timed reading builds awareness of pace and how it affects fluency.", steps: ["Read a short passage.", "Check words per minute.", "Repeat at a slower target pace."], category: "biofeedback", difficulty: "beginner", durationMinutes: 8, iconKey: "wpm", heroImage: require("../assets/images/tools/timed-reading-wpm.png"), relatedToolIds: ["stutter-tap-counter"], isLocked: false, completedToday: false },

  { id: "virtual-coffee-order", name: "Virtual Coffee Order", summary: "Practice a short scripted order.", description: "Simulated ordering builds confidence with structured speech and pacing.", steps: ["Read the sample order.", "Speak it aloud with pacing.", "Repeat with your own words."], category: "simulation", difficulty: "beginner", durationMinutes: 8, iconKey: "coffee", heroImage: require("../assets/images/tools/virtual-coffee-order.png"), relatedToolIds: ["phone-call-simulator"], isLocked: false, completedToday: false },
  { id: "phone-call-simulator", name: "Phone Call Simulator", summary: "Rehearse calls without pressure.", description: "Simulated calls reduce anxiety and help you stay fluent on the phone.", steps: ["Choose a call scenario.", "Use a slow, steady pace.", "Replay and refine your response."], category: "simulation", difficulty: "intermediate", durationMinutes: 10, iconKey: "phoneSim", heroImage: require("../assets/images/tools/phone-call-simulator.png"), relatedToolIds: ["virtual-coffee-order"], isLocked: true, completedToday: false },
];

export const getToolById = (id: string) =>
  LIBRARY_TOOLS.find((tool) => tool.id === id);
