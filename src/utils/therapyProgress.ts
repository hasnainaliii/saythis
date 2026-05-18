import { CHAPTER_1_DATA } from "../data/chapter1Data";
import { CHAPTER_2_DATA } from "../data/chapter2Data";
import { storage } from "./storage";

const THERAPY_PROGRESS_KEY = "therapy.progress.v1";

const CHAPTER_TOTALS: Record<string, number> = {
  "1": CHAPTER_1_DATA.exercises.length,
  "2": CHAPTER_2_DATA.exercises.length,
};

export interface ExerciseCompletionEntry {
  exerciseId: string;
  chapterId: number;
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

const parseProgress = (raw: string | null): TherapyProgress => {
  if (!raw) {
    return { ...DEFAULT_THERAPY_PROGRESS };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<TherapyProgress> | null;
    if (!parsed || typeof parsed !== "object") {
      return { ...DEFAULT_THERAPY_PROGRESS };
    }

    return {
      introDismissed: parsed.introDismissed ?? {},
      completedExercises: parsed.completedExercises ?? {},
      chapterSummary: parsed.chapterSummary ?? {},
      stats: {
        ...DEFAULT_THERAPY_PROGRESS.stats,
        ...(parsed.stats ?? {}),
      },
    };
  } catch (error) {
    console.error("Failed to parse therapy progress", error);
    return { ...DEFAULT_THERAPY_PROGRESS };
  }
};

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
    (summary) => summary.isComplete,
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

export const getTherapyProgress = async (): Promise<TherapyProgress> => {
  const raw = await storage.getItem(THERAPY_PROGRESS_KEY);
  const parsed = parseProgress(raw);
  const summary = computeSummary(parsed.completedExercises);

  const normalized: TherapyProgress = {
    ...parsed,
    chapterSummary: summary.chapterSummary,
    stats: summary.stats,
  };

  if (!raw) {
    return normalized;
  }

  const shouldSync =
    JSON.stringify(parsed.chapterSummary) !== JSON.stringify(summary.chapterSummary) ||
    JSON.stringify(parsed.stats) !== JSON.stringify(summary.stats);

  if (shouldSync) {
    await storage.setItem(THERAPY_PROGRESS_KEY, normalized);
  }

  return normalized;
};

export const setIntroDismissed = async (
  chapterId: number,
  dismissed: boolean,
): Promise<TherapyProgress> => {
  const prev = await getTherapyProgress();
  const introDismissed = { ...prev.introDismissed };

  if (dismissed) {
    introDismissed[String(chapterId)] = true;
  } else {
    delete introDismissed[String(chapterId)];
  }

  const next: TherapyProgress = {
    ...prev,
    introDismissed,
  };

  await storage.setItem(THERAPY_PROGRESS_KEY, next);
  return next;
};

export const recordExerciseCompletion = async (params: {
  exerciseId: string;
  chapterId: number;
  rating: number;
  notes?: string | null;
}): Promise<TherapyProgress> => {
  const prev = await getTherapyProgress();
  const cleanedNotes = params.notes?.trim() ?? "";
  const normalizedRating = params.rating > 0 ? params.rating : 3;
  const completedAt = new Date().toISOString();

  const nextCompletedExercises: Record<string, ExerciseCompletionEntry> = {
    ...prev.completedExercises,
    [params.exerciseId]: {
      exerciseId: params.exerciseId,
      chapterId: params.chapterId,
      rating: normalizedRating,
      notes: cleanedNotes.length > 0 ? cleanedNotes : undefined,
      completedAt,
    },
  };

  const summary = computeSummary(nextCompletedExercises);
  const next: TherapyProgress = {
    ...prev,
    completedExercises: nextCompletedExercises,
    chapterSummary: summary.chapterSummary,
    stats: summary.stats,
  };

  await storage.setItem(THERAPY_PROGRESS_KEY, next);
  return next;
};

export const getChapterProgressPercent = (
  summary: ChapterProgressSummary | undefined,
): number => {
  if (!summary || summary.totalCount === 0) {
    return 0;
  }

  return Math.round((summary.completedCount / summary.totalCount) * 100);
};

export const isChapterComplete = (
  summary: ChapterProgressSummary | undefined,
): boolean => summary?.isComplete ?? false;

export const isIntroDismissed = (
  progress: TherapyProgress,
  chapterId: number,
): boolean => !!progress.introDismissed[String(chapterId)];
