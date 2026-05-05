export type LibraryCategory =
  | "speech_fluency"
  | "breathing"
  | "drills"
  | "modification"
  | "biofeedback"
  | "gamification"
  | "simulation"
  | "progress"
  | "relaxation";

export type LibraryDifficulty = "beginner" | "intermediate" | "advanced";

export type LibraryIconKey =
  | "audio"
  | "volume"
  | "metronome"
  | "shadowing"
  | "slowed"
  | "phone"
  | "boxBreathing"
  | "diaphragmatic"
  | "pmr"
  | "routine"
  | "meditation"
  | "bodyScan"
  | "gentleOnset"
  | "lightContact"
  | "prolonged"
  | "continuous"
  | "phoneme"
  | "passage"
  | "cancellation"
  | "pullOut"
  | "preparatory"
  | "voluntary"
  | "block"
  | "tapCounter"
  | "wpm"
  | "silence"
  | "volumeMonitor"
  | "speechRate"
  | "playback"
  | "streak"
  | "xp"
  | "badges"
  | "challenges"
  | "fear"
  | "fluencyScore"
  | "coffee"
  | "phoneSim"
  | "intro"
  | "presentation"
  | "driveThru"
  | "trend"
  | "breakdown"
  | "history"
  | "compare"
  | "weekly"
  | "confidence"
  | "relaxBreathing"
  | "relaxPmr"
  | "relaxMeditation"
  | "relaxBodyScan"
  | "relaxRoutine";

export interface LibraryTool {
  id: string;
  name: string;
  summary: string;
  description: string;
  steps: string[];
  category: LibraryCategory;
  difficulty: LibraryDifficulty;
  durationMinutes: number;
  iconKey: LibraryIconKey;
  heroImage: string;
  relatedToolIds: string[];
  isLocked: boolean;
  completedToday: boolean;
  isRecommended?: boolean;
}
