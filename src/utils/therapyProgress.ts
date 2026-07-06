import { CHAPTER_1_DATA } from "../data/chapter1Data";
import { CHAPTER_2_DATA } from "../data/chapter2Data";
import { therapyService, CompletedExerciseDTO } from "../services/therapyService";
import { storage } from "./storage";

const INTRO_DISMISSED_KEY = "therapy.intro_dismissed.v1";

const CHAPTER_TOTALS: Record<string, number> = {
  "1": CHAPTER_1_DATA.exercises.length,
  "2": CHAPTER_2_DATA.exercises.length,
};

export interface ExerciseCompletionEntry {
  exerciseId: string;
  chapterId: string;
  rating: number;
  notes?: string;
  completedAt: string;
}

export interface ChapterProgressSummary {
  completedCount: number;
  totalCount: number;
  isComplete: boolean;
  completedAt?: string;
}

export interface TherapyProgressStats {
  totalExercisesCompleted: number;
  totalChaptersCompleted: number;
  completedExercisesByChapter: Record<string, number>;
  lastCompletedAt?: string;
}

export interface TherapyProgress {
  introDismissed: Record<string, boolean>;
  completedExercises: Record<string, ExerciseCompletionEntry>;
  chapterSummary: Record<string, ChapterProgressSummary>;
  stats: TherapyProgressStats;
}

export const DEFAULT_THERAPY_PROGRESS: TherapyProgress = {
  introDismissed: {},
  completedExercises: {},
  chapterSummary: {},
  stats: {
    totalExercisesCompleted: 0,
    totalChaptersCompleted: 0,
    completedExercisesByChapter: {},
  },
};

// map chapter_id strings like "chapter_1" to our local key "1"
const normalizeChapterId = (raw: string): string => {
  const match = raw.match(/(\d+)/);
  return match ? match[1] : raw;
};

const dtoToEntry = (dto: CompletedExerciseDTO): ExerciseCompletionEntry => ({
  exerciseId: dto.exercise_id,
  chapterId: normalizeChapterId(dto.chapter_id),
  rating: dto.rating,
  notes: dto.remarks || undefined,
  completedAt: dto.completed_at,
});

const computeSummary = (
  completedExercises: Record<string, ExerciseCompletionEntry>,
): { chapterSummary: Record<string, ChapterProgressSummary>; stats: TherapyProgressStats } => {
  const completedExercisesByChapter: Record<string, number> = {};
  const latestByChapter: Record<string, string> = {};
  let lastCompletedAt: string | undefined;

  Object.values(completedExercises).forEach((entry) => {
    const chapterKey = String(entry.chapterId);
    completedExercisesByChapter[chapterKey] =
      (completedExercisesByChapter[chapterKey] ?? 0) + 1;

    if (!latestByChapter[chapterKey] || entry.completedAt > latestByChapter[chapterKey]) {
      latestByChapter[chapterKey] = entry.completedAt;
    }

    if (!lastCompletedAt || entry.completedAt > lastCompletedAt) {
      lastCompletedAt = entry.completedAt;
    }
  });

  const chapterSummary: Record<string, ChapterProgressSummary> = {};
  Object.entries(CHAPTER_TOTALS).forEach(([chapterKey, totalCount]) => {
    const completedCount = completedExercisesByChapter[chapterKey] ?? 0;
    const isComplete = totalCount > 0 && completedCount >= totalCount;

    chapterSummary[chapterKey] = {
      completedCount,
      totalCount,
      isComplete,
      completedAt: isComplete ? latestByChapter[chapterKey] : undefined,
    };
  });

  const totalExercisesCompleted = Object.keys(completedExercises).length;
  const totalChaptersCompleted = Object.values(chapterSummary).filter(
    (s) => s.isComplete,
  ).length;

  return {
    chapterSummary,
    stats: {
      totalExercisesCompleted,
      totalChaptersCompleted,
      completedExercisesByChapter,
      lastCompletedAt,
    },
  };
};

const loadIntroDismissed = async (): Promise<Record<string, boolean>> => {
  const raw = await storage.getItem(INTRO_DISMISSED_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
};

export const getTherapyProgress = async (): Promise<TherapyProgress> => {
  try {
    const [apiData, introDismissed] = await Promise.all([
      therapyService.getProgress(),
      loadIntroDismissed(),
    ]);

    const completedExercises: Record<string, ExerciseCompletionEntry> = {};
    apiData.completed_exercises.forEach((dto) => {
      const entry = dtoToEntry(dto);
      completedExercises[entry.exerciseId] = entry;
    });

    const summary = computeSummary(completedExercises);

    return {
      introDismissed,
      completedExercises,
      chapterSummary: summary.chapterSummary,
      stats: summary.stats,
    };
  } catch (error) {
    console.warn("Failed to fetch therapy progress", error);
    const introDismissed = await loadIntroDismissed();
    return { ...DEFAULT_THERAPY_PROGRESS, introDismissed };
  }
};

export const setIntroDismissed = async (
  chapterId: number,
  dismissed: boolean,
): Promise<TherapyProgress> => {
  const introDismissed = await loadIntroDismissed();

  if (dismissed) {
    introDismissed[String(chapterId)] = true;
  } else {
    delete introDismissed[String(chapterId)];
  }

  await storage.setItem(INTRO_DISMISSED_KEY, JSON.stringify(introDismissed));

  const prev = await getTherapyProgress();
  return { ...prev, introDismissed };
};

export const recordExerciseCompletion = async (params: {
  exerciseId: string;
  chapterId: number;
  rating: number;
  notes?: string | null;
}): Promise<TherapyProgress> => {
  const remarks = params.notes?.trim() ?? "";
  const rating = params.rating > 0 ? params.rating : 3;

  await therapyService.markComplete({
    chapterId: `chapter_${params.chapterId}`,
    exerciseId: params.exerciseId,
    rating,
    remarks,
  });

  return getTherapyProgress();
};

export const getChapterProgressPercent = (
  summary: ChapterProgressSummary | undefined,
): number => {
  if (!summary || summary.totalCount === 0) return 0;
  return Math.round((summary.completedCount / summary.totalCount) * 100);
};

export const isChapterComplete = (
  summary: ChapterProgressSummary | undefined,
): boolean => summary?.isComplete ?? false;

export const isIntroDismissed = (
  progress: TherapyProgress,
  chapterId: number,
): boolean => !!progress.introDismissed[String(chapterId)];
