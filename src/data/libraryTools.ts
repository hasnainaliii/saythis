import { colors } from "../theme/Theme";
import { LibraryCategory, LibraryTool } from "../types/library";

export const LIBRARY_CATEGORIES: { key: LibraryCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "speech_fluency", label: "Speech Fluency" },
  { key: "breathing", label: "Breathing" },
  { key: "drills", label: "Drills" },
  { key: "modification", label: "Modification" },
  { key: "biofeedback", label: "Biofeedback" },
  { key: "gamification", label: "Gamification" },
  { key: "simulation", label: "Simulation" },
  { key: "progress", label: "Progress" },
  { key: "relaxation", label: "Relaxation" },
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
  modification: {
    label: "Modification",
    tagBg: colors.tagModificationBg,
    tagText: colors.tagModificationText,
    gradient: [colors.gradModificationStart, colors.gradModificationEnd],
  },
  biofeedback: {
    label: "Biofeedback",
    tagBg: colors.tagBiofeedbackBg,
    tagText: colors.tagBiofeedbackText,
    gradient: [colors.gradBiofeedbackStart, colors.gradBiofeedbackEnd],
  },
  gamification: {
    label: "Gamification",
    tagBg: colors.tagGamificationBg,
    tagText: colors.tagGamificationText,
    gradient: [colors.gradGamificationStart, colors.gradGamificationEnd],
  },
  simulation: {
    label: "Simulation",
    tagBg: colors.tagSimulationBg,
    tagText: colors.tagSimulationText,
    gradient: [colors.gradSimulationStart, colors.gradSimulationEnd],
  },
  progress: {
    label: "Progress",
    tagBg: colors.tagProgressBg,
    tagText: colors.tagProgressText,
    gradient: [colors.gradProgressStart, colors.gradProgressEnd],
  },
  relaxation: {
    label: "Relaxation",
    tagBg: colors.tagRelaxationBg,
    tagText: colors.tagRelaxationText,
    gradient: [colors.gradRelaxationStart, colors.gradRelaxationEnd],
  },
};

const HERO_IMAGES = {
  speech: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1600&q=80",
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
  { id: "daf", name: "DAF", summary: "Delay your voice to steady rhythm.", description: "Delayed auditory feedback shifts your timing so words feel more paced and predictable.", steps: ["Choose a delay level that feels comfortable.", "Read a short phrase and listen to the delay.", "Move to natural speech while keeping the new rhythm."], category: "speech_fluency", difficulty: "beginner", durationMinutes: 8, iconKey: "audio", heroImage: HERO_IMAGES.speech, relatedToolIds: ["faf", "metronome-pacing", "slowed-playback"], isLocked: false, completedToday: true, isRecommended: true },
  { id: "faf", name: "FAF", summary: "Shift pitch for smoother flow.", description: "Frequency altered feedback changes your voice tone, reducing tension and easing speech flow.", steps: ["Pick a gentle pitch shift.", "Practice short phrases with feedback.", "Lower the shift as speech feels easier."], category: "speech_fluency", difficulty: "beginner", durationMinutes: 7, iconKey: "volume", heroImage: HERO_IMAGES.speech, relatedToolIds: ["daf", "phone-filter"], isLocked: false, completedToday: false },
  { id: "metronome-pacing", name: "Metronome Pacing", summary: "Speak in time with a beat.", description: "A steady beat guides your rate and helps reduce rushing and blocks.", steps: ["Set a slow tempo.", "Speak one syllable per beat.", "Gradually increase tempo while staying smooth."], category: "speech_fluency", difficulty: "beginner", durationMinutes: 10, iconKey: "metronome", heroImage: HERO_IMAGES.speech, relatedToolIds: ["shadowing", "slowed-playback"], isLocked: false, completedToday: false },
  { id: "shadowing", name: "Shadowing", summary: "Echo speech to build flow.", description: "Shadowing helps you mirror fluent speech patterns and reduce anticipation.", steps: ["Play a short audio clip.", "Repeat the words with a slight delay.", "Shift to matching pace and tone."], category: "speech_fluency", difficulty: "intermediate", durationMinutes: 12, iconKey: "shadowing", heroImage: HERO_IMAGES.speech, relatedToolIds: ["metronome-pacing", "slowed-playback"], isLocked: false, completedToday: false },
  { id: "slowed-playback", name: "Slowed Playback", summary: "Slow speech to retrain timing.", description: "Slower playback creates space for smoother articulation and cleaner onsets.", steps: ["Record a short sentence.", "Play it back at a slower speed.", "Repeat along and keep the same pacing."], category: "speech_fluency", difficulty: "beginner", durationMinutes: 6, iconKey: "slowed", heroImage: HERO_IMAGES.speech, relatedToolIds: ["metronome-pacing", "daf"], isLocked: false, completedToday: false },
  { id: "phone-filter", name: "Phone Filter", summary: "Filter audio for calmer speech.", description: "Phone filters reduce harsh feedback and help keep your voice relaxed in calls.", steps: ["Enable the filter preset.", "Practice a short phone script.", "Move to real calls with the same setup."], category: "speech_fluency", difficulty: "intermediate", durationMinutes: 9, iconKey: "phone", heroImage: HERO_IMAGES.speech, relatedToolIds: ["faf", "phone-call-simulator"], isLocked: true, completedToday: false },

  { id: "box-breathing", name: "Box Breathing", summary: "Calm your system in four counts.", description: "Box breathing steadies the nervous system to reduce tension before speech.", steps: ["Inhale for four counts.", "Hold for four counts.", "Exhale for four counts, then hold again."], category: "breathing", difficulty: "beginner", durationMinutes: 5, iconKey: "boxBreathing", heroImage: HERO_IMAGES.breathing, relatedToolIds: ["meditation-timer", "body-scan"], isLocked: false, completedToday: true, isRecommended: true },
  { id: "diaphragmatic-breathing", name: "Diaphragmatic Breathing", summary: "Breathe low and steady.", description: "Deep belly breathing supports smoother airflow and calmer speech starts.", steps: ["Place a hand on your belly.", "Inhale and feel the belly rise.", "Speak a short phrase on a slow exhale."], category: "breathing", difficulty: "beginner", durationMinutes: 6, iconKey: "diaphragmatic", heroImage: HERO_IMAGES.breathing, relatedToolIds: ["box-breathing", "pre-speech-routine"], isLocked: false, completedToday: false },
  { id: "pmr-breathing", name: "PMR", summary: "Release tension muscle by muscle.", description: "Progressive muscle relaxation lowers physical tension that can trigger blocks.", steps: ["Tense shoulders for five seconds.", "Release and notice the drop in tension.", "Move down the body in small groups."], category: "breathing", difficulty: "beginner", durationMinutes: 8, iconKey: "pmr", heroImage: HERO_IMAGES.breathing, relatedToolIds: ["body-scan", "pre-speech-routine"], isLocked: false, completedToday: false },
  { id: "pre-speech-routine", name: "Pre-Speech Routine", summary: "Warm up your breath and voice.", description: "A short routine prepares airflow, posture, and focus before speaking tasks.", steps: ["Do two cycles of slow breathing.", "Hum lightly to relax the voice.", "Start with a gentle onset phrase."], category: "breathing", difficulty: "beginner", durationMinutes: 7, iconKey: "routine", heroImage: HERO_IMAGES.breathing, relatedToolIds: ["diaphragmatic-breathing", "gentle-onset"], isLocked: false, completedToday: false },
  { id: "meditation-timer", name: "Meditation Timer", summary: "Short guided calm before speech.", description: "A focused timer helps settle attention and reduce speech anxiety.", steps: ["Choose a short duration.", "Focus on slow exhales.", "Notice tension and let it soften."], category: "breathing", difficulty: "beginner", durationMinutes: 5, iconKey: "meditation", heroImage: HERO_IMAGES.breathing, relatedToolIds: ["box-breathing", "body-scan"], isLocked: false, completedToday: false },
  { id: "body-scan", name: "Body Scan", summary: "Check in with hidden tension.", description: "Body scan practice builds awareness of tight areas that affect speech flow.", steps: ["Start at the forehead and move down.", "Pause where tension is felt.", "Breathe into the area and release."], category: "breathing", difficulty: "beginner", durationMinutes: 6, iconKey: "bodyScan", heroImage: HERO_IMAGES.breathing, relatedToolIds: ["pmr-breathing", "meditation-timer"], isLocked: false, completedToday: false },

  { id: "gentle-onset", name: "Gentle Onset Practice", summary: "Ease into vowels and words.", description: "Gentle onset reduces hard starts by softening voice onset and airflow.", steps: ["Take a slow breath.", "Start with an easy vowel.", "Blend into the full word."], category: "drills", difficulty: "beginner", durationMinutes: 8, iconKey: "gentleOnset", heroImage: HERO_IMAGES.drills, relatedToolIds: ["prolonged-speech", "light-contact"], isLocked: false, completedToday: true },
  { id: "light-contact", name: "Light Contact Drill", summary: "Soften consonant touch.", description: "Light contact reduces pressure on consonants to smooth out transitions.", steps: ["Say a soft B or D sound.", "Keep lips or tongue barely touching.", "Move into a word with the same touch."], category: "drills", difficulty: "beginner", durationMinutes: 9, iconKey: "lightContact", heroImage: HERO_IMAGES.drills, relatedToolIds: ["gentle-onset", "phoneme-targeting"], isLocked: false, completedToday: false },
  { id: "prolonged-speech", name: "Prolonged Speech Stretcher", summary: "Stretch sounds for control.", description: "Prolonged speech slows rate and improves control across phrases.", steps: ["Stretch each vowel slightly.", "Keep airflow steady.", "Shorten gradually as control improves."], category: "drills", difficulty: "intermediate", durationMinutes: 12, iconKey: "prolonged", heroImage: HERO_IMAGES.drills, relatedToolIds: ["gentle-onset", "continuous-phonation"], isLocked: false, completedToday: false },
  { id: "continuous-phonation", name: "Continuous Phonation", summary: "Keep voice on through phrases.", description: "Continuous phonation trains smooth voicing to avoid breaks between words.", steps: ["Connect words with a soft hum.", "Maintain gentle voicing.", "Add natural pauses without breaking flow."], category: "drills", difficulty: "intermediate", durationMinutes: 10, iconKey: "continuous", heroImage: HERO_IMAGES.drills, relatedToolIds: ["prolonged-speech", "passage-reading"], isLocked: true, completedToday: false },
  { id: "phoneme-targeting", name: "Phoneme Targeting", summary: "Practice tricky sounds on purpose.", description: "Targeted phoneme practice reduces fear and improves precision.", steps: ["Pick one hard sound.", "Say it in short words.", "Use it in simple sentences."], category: "drills", difficulty: "intermediate", durationMinutes: 9, iconKey: "phoneme", heroImage: HERO_IMAGES.drills, relatedToolIds: ["light-contact", "passage-reading"], isLocked: false, completedToday: false },
  { id: "passage-reading", name: "Passage Reading", summary: "Apply skills to real text.", description: "Structured reading turns techniques into real speech habits.", steps: ["Choose a short passage.", "Use your target technique.", "Read again with natural pace."], category: "drills", difficulty: "intermediate", durationMinutes: 12, iconKey: "passage", heroImage: HERO_IMAGES.drills, relatedToolIds: ["continuous-phonation", "phoneme-targeting"], isLocked: true, completedToday: false },

  { id: "cancellation-trainer", name: "Cancellation Trainer", summary: "Pause and reset after a block.", description: "Cancellation teaches you to stop, reset, and restart smoothly after a stutter.", steps: ["Notice the stutter moment.", "Pause and breathe once.", "Repeat the word with a relaxed onset."], category: "modification", difficulty: "intermediate", durationMinutes: 10, iconKey: "cancellation", heroImage: HERO_IMAGES.modification, relatedToolIds: ["pull-out-practice", "preparatory-set"], isLocked: true, completedToday: false },
  { id: "pull-out-practice", name: "Pull-Out Practice", summary: "Ease out mid-block.", description: "Pull-outs help you release tension during a block and keep moving forward.", steps: ["Sense the block tension.", "Reduce pressure gradually.", "Finish the word with a smooth release."], category: "modification", difficulty: "intermediate", durationMinutes: 11, iconKey: "pullOut", heroImage: HERO_IMAGES.modification, relatedToolIds: ["cancellation-trainer", "preparatory-set"], isLocked: true, completedToday: false },
  { id: "preparatory-set", name: "Preparatory Set", summary: "Plan for smooth starts.", description: "Preparatory set focuses on relaxed posture, breath, and gentle onset before words.", steps: ["Set posture and exhale slowly.", "Choose a gentle onset.", "Begin speaking with low tension."], category: "modification", difficulty: "beginner", durationMinutes: 7, iconKey: "preparatory", heroImage: HERO_IMAGES.modification, relatedToolIds: ["gentle-onset", "pull-out-practice"], isLocked: false, completedToday: false },
  { id: "voluntary-stuttering", name: "Voluntary Stuttering", summary: "Practice stutters on purpose.", description: "Intentional stuttering reduces fear and builds control in real speech.", steps: ["Choose a safe word.", "Insert a light stutter on purpose.", "Repeat with less tension each time."], category: "modification", difficulty: "advanced", durationMinutes: 9, iconKey: "voluntary", heroImage: HERO_IMAGES.modification, relatedToolIds: ["cancellation-trainer", "block-simulation"], isLocked: true, completedToday: false },
  { id: "block-simulation", name: "Block Simulation", summary: "Rehearse a block safely.", description: "Block simulation helps you practice exit strategies without pressure.", steps: ["Create a soft block.", "Release tension slowly.", "Finish the word with airflow."], category: "modification", difficulty: "advanced", durationMinutes: 10, iconKey: "block", heroImage: HERO_IMAGES.modification, relatedToolIds: ["voluntary-stuttering", "pull-out-practice"], isLocked: true, completedToday: false },

  { id: "stutter-tap-counter", name: "Stutter Tap Counter", summary: "Track moments with a quick tap.", description: "Tapping helps you capture stutter moments and build awareness over time.", steps: ["Tap once for each stutter.", "Review the count after a session.", "Note triggers and patterns."], category: "biofeedback", difficulty: "beginner", durationMinutes: 6, iconKey: "tapCounter", heroImage: HERO_IMAGES.biofeedback, relatedToolIds: ["silence-ratio", "speech-rate-gauge"], isLocked: false, completedToday: false },
  { id: "timed-reading-wpm", name: "Timed Reading WPM", summary: "Measure your reading speed.", description: "Timed reading builds awareness of pace and how it affects fluency.", steps: ["Read a short passage.", "Check words per minute.", "Repeat at a slower target pace."], category: "biofeedback", difficulty: "beginner", durationMinutes: 8, iconKey: "wpm", heroImage: HERO_IMAGES.biofeedback, relatedToolIds: ["speech-rate-gauge", "playback-review"], isLocked: false, completedToday: false },
  { id: "silence-ratio", name: "Silence Ratio Meter", summary: "Balance pauses and speech.", description: "Silence ratio shows how much you pause versus speak to guide pacing.", steps: ["Record a short talk.", "Review silence to speech ratio.", "Adjust with longer, calmer pauses."], category: "biofeedback", difficulty: "intermediate", durationMinutes: 7, iconKey: "silence", heroImage: HERO_IMAGES.biofeedback, relatedToolIds: ["speech-rate-gauge", "playback-review"], isLocked: true, completedToday: false },
  { id: "volume-monitor", name: "Volume Monitor", summary: "Keep loudness steady.", description: "Volume monitoring helps avoid strain and keeps airflow consistent.", steps: ["Speak at a comfortable volume.", "Watch the meter for spikes.", "Aim for a steady range."], category: "biofeedback", difficulty: "beginner", durationMinutes: 6, iconKey: "volumeMonitor", heroImage: HERO_IMAGES.biofeedback, relatedToolIds: ["speech-rate-gauge", "timed-reading-wpm"], isLocked: false, completedToday: false },
  { id: "speech-rate-gauge", name: "Speech Rate Gauge", summary: "See pacing in real time.", description: "Rate feedback makes it easier to slow down and keep words smooth.", steps: ["Start with a slow rate.", "Speak a short paragraph.", "Keep the gauge within the target zone."], category: "biofeedback", difficulty: "intermediate", durationMinutes: 9, iconKey: "speechRate", heroImage: HERO_IMAGES.biofeedback, relatedToolIds: ["timed-reading-wpm", "silence-ratio"], isLocked: true, completedToday: false },
  { id: "playback-review", name: "Playback Review", summary: "Listen and refine calmly.", description: "Playback review helps you spot patterns and adjust technique.", steps: ["Record a short session.", "Listen for smooth spots.", "Choose one change for next time."], category: "biofeedback", difficulty: "beginner", durationMinutes: 5, iconKey: "playback", heroImage: HERO_IMAGES.biofeedback, relatedToolIds: ["timed-reading-wpm", "stutter-tap-counter"], isLocked: false, completedToday: false },

  { id: "daily-streak", name: "Daily Streak", summary: "Stay consistent with rewards.", description: "Streaks encourage daily practice and build momentum.", steps: ["Complete one short tool daily.", "Check your streak count.", "Protect the streak with a quick session."], category: "gamification", difficulty: "beginner", durationMinutes: 3, iconKey: "streak", heroImage: HERO_IMAGES.gamification, relatedToolIds: ["daily-challenges", "xp-levels"], isLocked: false, completedToday: true },
  { id: "xp-levels", name: "XP & Levels", summary: "Earn points as you train.", description: "XP turns practice into progress you can see and celebrate.", steps: ["Finish a tool to earn XP.", "Level up to unlock content.", "Use milestones to plan your week."], category: "gamification", difficulty: "beginner", durationMinutes: 4, iconKey: "xp", heroImage: HERO_IMAGES.gamification, relatedToolIds: ["daily-streak", "technique-badges"], isLocked: false, completedToday: false },
  { id: "technique-badges", name: "Technique Badges", summary: "Collect badges for mastery.", description: "Badges reward consistent technique use and reinforce success.", steps: ["Pick a technique badge.", "Complete the practice goals.", "Show progress in your profile."], category: "gamification", difficulty: "beginner", durationMinutes: 4, iconKey: "badges", heroImage: HERO_IMAGES.gamification, relatedToolIds: ["xp-levels", "fluency-score"], isLocked: false, completedToday: false },
  { id: "daily-challenges", name: "Daily Challenges", summary: "Quick tasks with focus.", description: "Short daily missions keep practice varied and engaging.", steps: ["Open today's challenge.", "Complete the quick task.", "Claim the reward and reflect."], category: "gamification", difficulty: "beginner", durationMinutes: 4, iconKey: "challenges", heroImage: HERO_IMAGES.gamification, relatedToolIds: ["daily-streak", "fluency-score"], isLocked: false, completedToday: false },
  { id: "fear-hierarchy", name: "Fear Hierarchy", summary: "Climb speaking fears step by step.", description: "Fear hierarchy helps you practice harder situations gradually.", steps: ["List easy to hard situations.", "Practice one level at a time.", "Move up when you feel ready."], category: "gamification", difficulty: "advanced", durationMinutes: 10, iconKey: "fear", heroImage: HERO_IMAGES.gamification, relatedToolIds: ["presentation-mode", "phone-call-simulator"], isLocked: true, completedToday: false },
  { id: "fluency-score", name: "Fluency Score", summary: "Track your smoothness score.", description: "A simple score highlights steady improvement over time.", steps: ["Complete a session.", "Review the fluency score.", "Set a small target for next time."], category: "gamification", difficulty: "intermediate", durationMinutes: 5, iconKey: "fluencyScore", heroImage: HERO_IMAGES.gamification, relatedToolIds: ["xp-levels", "daily-streak"], isLocked: false, completedToday: false, isRecommended: true },

  { id: "virtual-coffee-order", name: "Virtual Coffee Order", summary: "Practice a short scripted order.", description: "Simulated ordering builds confidence with structured speech and pacing.", steps: ["Read the sample order.", "Speak it aloud with pacing.", "Repeat with your own words."], category: "simulation", difficulty: "beginner", durationMinutes: 8, iconKey: "coffee", heroImage: HERO_IMAGES.simulation, relatedToolIds: ["phone-call-simulator", "introduction-practice"], isLocked: false, completedToday: false },
  { id: "phone-call-simulator", name: "Phone Call Simulator", summary: "Rehearse calls without pressure.", description: "Simulated calls reduce anxiety and help you stay fluent on the phone.", steps: ["Choose a call scenario.", "Use a slow, steady pace.", "Replay and refine your response."], category: "simulation", difficulty: "intermediate", durationMinutes: 10, iconKey: "phoneSim", heroImage: HERO_IMAGES.simulation, relatedToolIds: ["virtual-coffee-order", "presentation-mode"], isLocked: true, completedToday: false },
  { id: "introduction-practice", name: "Introduction Practice", summary: "Craft a confident intro.", description: "Short introductions help you practice calm starts and smooth pacing.", steps: ["Write a two sentence intro.", "Practice with gentle onset.", "Add a follow up line."], category: "simulation", difficulty: "beginner", durationMinutes: 7, iconKey: "intro", heroImage: HERO_IMAGES.simulation, relatedToolIds: ["presentation-mode", "virtual-coffee-order"], isLocked: false, completedToday: false },
  { id: "presentation-mode", name: "Presentation Mode", summary: "Speak with steady structure.", description: "Presentation mode trains pacing and breath support for longer speech.", steps: ["Outline three key points.", "Use a slow start and clear pauses.", "Record and review one run."], category: "simulation", difficulty: "advanced", durationMinutes: 12, iconKey: "presentation", heroImage: HERO_IMAGES.simulation, relatedToolIds: ["introduction-practice", "fear-hierarchy"], isLocked: true, completedToday: false },
  { id: "drive-thru-simulator", name: "Drive-Thru Simulator", summary: "Practice quick responses.", description: "Drive thru practice builds confidence under time pressure.", steps: ["Select a menu prompt.", "Respond with a short order.", "Repeat with steady pacing."], category: "simulation", difficulty: "intermediate", durationMinutes: 9, iconKey: "driveThru", heroImage: HERO_IMAGES.simulation, relatedToolIds: ["virtual-coffee-order", "phone-call-simulator"], isLocked: true, completedToday: false },

  { id: "fluency-trend-chart", name: "Fluency Trend Chart", summary: "See progress over time.", description: "Trend charts visualize your growth and highlight steady wins.", steps: ["Complete a few sessions.", "Review the weekly trend.", "Adjust goals based on the curve."], category: "progress", difficulty: "beginner", durationMinutes: 5, iconKey: "trend", heroImage: HERO_IMAGES.progress, relatedToolIds: ["weekly-report", "session-history"], isLocked: false, completedToday: false },
  { id: "technique-breakdown", name: "Technique Breakdown", summary: "Track which tools help most.", description: "Breakdown views show which techniques are boosting fluency.", steps: ["Open a recent session.", "See top performing tools.", "Choose one to double down on."], category: "progress", difficulty: "beginner", durationMinutes: 5, iconKey: "breakdown", heroImage: HERO_IMAGES.progress, relatedToolIds: ["fluency-trend-chart", "weekly-report"], isLocked: false, completedToday: false },
  { id: "session-history", name: "Session History", summary: "Review past practice logs.", description: "History helps you spot patterns and stay consistent.", steps: ["Scroll through recent sessions.", "Tap for details.", "Note what worked best."], category: "progress", difficulty: "beginner", durationMinutes: 4, iconKey: "history", heroImage: HERO_IMAGES.progress, relatedToolIds: ["weekly-report", "fluency-trend-chart"], isLocked: false, completedToday: false },
  { id: "before-after-compare", name: "Before/After Compare", summary: "Compare sessions side by side.", description: "Compare clips to hear changes in flow and confidence.", steps: ["Choose two sessions.", "Listen to both clips.", "Write one improvement to keep."], category: "progress", difficulty: "intermediate", durationMinutes: 6, iconKey: "compare", heroImage: HERO_IMAGES.progress, relatedToolIds: ["fluency-trend-chart", "playback-review"], isLocked: true, completedToday: false },
  { id: "weekly-report", name: "Weekly Report", summary: "Get a weekly summary.", description: "Weekly reports highlight progress and focus areas.", steps: ["Open the weekly report.", "Review wins and misses.", "Set one goal for next week."], category: "progress", difficulty: "beginner", durationMinutes: 5, iconKey: "weekly", heroImage: HERO_IMAGES.progress, relatedToolIds: ["fluency-trend-chart", "technique-breakdown"], isLocked: false, completedToday: false },
  { id: "confidence-scale", name: "Confidence Scale", summary: "Rate confidence quickly.", description: "A simple rating tracks how confident you feel before and after practice.", steps: ["Rate confidence before speaking.", "Complete a tool.", "Rate again and compare."], category: "progress", difficulty: "beginner", durationMinutes: 4, iconKey: "confidence", heroImage: HERO_IMAGES.progress, relatedToolIds: ["fluency-score", "session-history"], isLocked: false, completedToday: false },

  { id: "breathing-tools", name: "Breathing Tools", summary: "Quick calm breath menu.", description: "A short menu of breathing drills to reset your system before speech.", steps: ["Pick a breathing drill.", "Complete a short cycle.", "Start your speaking task."], category: "relaxation", difficulty: "beginner", durationMinutes: 4, iconKey: "relaxBreathing", heroImage: HERO_IMAGES.relaxation, relatedToolIds: ["relax-meditation", "relax-body-scan"], isLocked: false, completedToday: false },
  { id: "relax-pmr", name: "PMR", summary: "Release tension for calmer speech.", description: "Progressive muscle relaxation helps your body stay loose and steady.", steps: ["Tense and release shoulders.", "Move down the body slowly.", "End with a slow exhale."], category: "relaxation", difficulty: "beginner", durationMinutes: 7, iconKey: "relaxPmr", heroImage: HERO_IMAGES.relaxation, relatedToolIds: ["relax-body-scan", "relax-routine"], isLocked: false, completedToday: false },
  { id: "relax-meditation", name: "Meditation", summary: "Calm focus in a few minutes.", description: "Meditation builds steady attention and lowers speech anxiety.", steps: ["Sit comfortably and close your eyes.", "Follow slow breaths.", "Return gently when attention drifts."], category: "relaxation", difficulty: "beginner", durationMinutes: 6, iconKey: "relaxMeditation", heroImage: HERO_IMAGES.relaxation, relatedToolIds: ["relax-body-scan", "breathing-tools"], isLocked: false, completedToday: false },
  { id: "relax-body-scan", name: "Body Scan", summary: "Release hidden tension gently.", description: "Body scan relaxation helps you notice and soften tight areas.", steps: ["Scan from head to toe.", "Pause at tense spots.", "Breathe and let them relax."], category: "relaxation", difficulty: "beginner", durationMinutes: 6, iconKey: "relaxBodyScan", heroImage: HERO_IMAGES.relaxation, relatedToolIds: ["relax-pmr", "relax-meditation"], isLocked: false, completedToday: false },
  { id: "relax-routine", name: "Pre-Speech Routine", summary: "A calm warm up sequence.", description: "A short routine to prepare breath, posture, and focus before speaking.", steps: ["Breathe slowly for one minute.", "Loosen shoulders and jaw.", "Start with a gentle onset phrase."], category: "relaxation", difficulty: "beginner", durationMinutes: 7, iconKey: "relaxRoutine", heroImage: HERO_IMAGES.relaxation, relatedToolIds: ["breathing-tools", "relax-body-scan"], isLocked: false, completedToday: false },
];

export const getToolById = (id: string) =>
  LIBRARY_TOOLS.find((tool) => tool.id === id);
