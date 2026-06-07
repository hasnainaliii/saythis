import { storage, StorageKeys } from './storage';
import { addToQueue, getPendingSessions, removePendingSession, incrementAttempt } from './offlineQueue';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export interface BaseSessionStats {
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  selfRating: number | null;
  estimatedWords: number;
}

export interface DAFSessionStats extends BaseSessionStats {
  toolType: 'DAF';
  delayMs: number;
  volumePercent: number;
  passageIndex: number;
  delayAdjustments: number;
}

export interface FAFSessionStats extends BaseSessionStats {
  toolType: 'FAF';
  pitchDirection: 'up' | 'down';
  pitchSemitones: number;
  mode: 'reading' | 'conversation';
  pitchAdjustments: number;
}

export interface BoxBreathingSessionStats extends BaseSessionStats {
  toolType: 'BOX_BREATHING';
  secondsPerSide: number;
  targetCycles: number;
  cyclesCompleted: number;
  audioCuesEnabled: boolean;
}

export interface DiaphragmaticSessionStats extends BaseSessionStats {
  toolType: 'DIAPHRAGMATIC';
  inhaleDuration: number;
  exhaleDuration: number;
  targetCycles: number;
  cyclesCompleted: number;
}

export interface PreSpeechSessionStats extends BaseSessionStats {
  toolType: 'PRE_SPEECH';
  situation: string;
  situationCustomText?: string;
  stepsCompleted: number;
  stepDurations: Record<string, number>;
  affirmationIndex: number;
}

export interface GentleOnsetSessionStats extends BaseSessionStats {
  toolType: 'GENTLE_ONSET';
  softOnsetCount: number;
  hardOnsetCount: number;
  successRate: number;
  wordsAttempted: number;
  averageScore: number;
}

export interface ProlongedSpeechSessionStats extends BaseSessionStats {
  toolType: 'PROLONGED_SPEECH';
  targetWpm: number;
  estimatedWpm: number;
  completionPercentage: number;
  overSpeedCount: number;
}

export interface StutterTapCounterSessionStats extends BaseSessionStats {
  toolType: 'STUTTER_TAP_COUNTER';
  totalTaps: number;
}

export interface TimedReadingWpmSessionStats extends BaseSessionStats {
  toolType: 'TIMED_READING_WPM';
  targetWpm?: number;
  actualWpm: number;
  wordsRead: number;
}

export interface VirtualCoffeeOrderSessionStats extends BaseSessionStats {
  toolType: 'VIRTUAL_COFFEE_ORDER';
  orderType: string;
  completed: boolean;
}

export interface PhoneCallSimulatorSessionStats extends BaseSessionStats {
  toolType: 'PHONE_CALL_SIMULATOR';
  scenario: string;
  completed: boolean;
}

export type ToolSessionStats =
  | DAFSessionStats
  | FAFSessionStats
  | BoxBreathingSessionStats
  | DiaphragmaticSessionStats
  | PreSpeechSessionStats
  | GentleOnsetSessionStats
  | ProlongedSpeechSessionStats
  | StutterTapCounterSessionStats
  | TimedReadingWpmSessionStats
  | VirtualCoffeeOrderSessionStats
  | PhoneCallSimulatorSessionStats;

export const saveSessionToBackend = async (session: ToolSessionStats) => {
  try {
    const cached = await storage.getItem(StorageKeys.APP_SESSIONS);
    const sessions: ToolSessionStats[] = cached ? JSON.parse(cached as string) : [];
    sessions.unshift(session);
    await storage.setItem(StorageKeys.APP_SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session locally", error);
  }

  try {
    const token = await storage.getItem(StorageKeys.USER_TOKEN);
    if (!token) return session;

    const response = await fetch(`${API_BASE_URL}/tool-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving session to backend, queuing offline:", error);
    await addToQueue(session);
    return session;
  }
};

export const syncOfflineSessions = async () => {
  const sessions = await getPendingSessions();
  
  for (const session of sessions) {
    try {
      const payload = JSON.parse(session.payload);
      const token = await storage.getItem(StorageKeys.USER_TOKEN);
      if (!token) continue;

      const response = await fetch(`${API_BASE_URL}/tool-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await removePendingSession(session.id);
      } else {
        await incrementAttempt(session.id, session.attempts);
      }
    } catch (error) {
      await incrementAttempt(session.id, session.attempts);
    }
  }
};

export const getToolStats = async () => {
  try {
    const cached = await storage.getItem(StorageKeys.APP_SESSIONS);
    const sessions: ToolSessionStats[] = cached ? JSON.parse(cached as string) : [];

    const stats = {
      daf: { totalSessions: 0, totalMinutes: 0, avgRating: 0, avgDelayMs: 0, sessionsThisWeek: 0, bestStreak: 0 },
      faf: { totalSessions: 0, totalMinutes: 0, avgRating: 0, preferredDirection: 'down', avgSemitones: 0, sessionsThisWeek: 0, bestStreak: 0 },
      combined: { totalToolMinutes: 0, currentStreak: 0, bestStreak: 0, lastSessionAt: null as string | null, activeDays: 0, totalSessions: 0 },
      breathing: { totalSessions: 0, totalMinutes: 0, avgRating: 0, boxBreathingSessions: 0, diaphragmaticSessions: 0, preSpeechSessions: 0, situationBreakdown: {} as Record<string, number>, currentStreak: 0 },
      drills: { totalSessions: 0, totalMinutes: 0, avgRating: 0, gentleOnsetSessions: 0, prolongedSpeechSessions: 0, avgGentleScore: 0, avgProlongedWpm: 0, currentStreak: 0 },
      biofeedback: { totalSessions: 0, totalMinutes: 0, avgRating: 0, stutterTapSessions: 0, timedReadingSessions: 0, avgStuttersPerMin: 0, avgReadingWpm: 0, currentStreak: 0 },
      simulation: { totalSessions: 0, totalMinutes: 0, avgRating: 0, coffeeSessions: 0, callSessions: 0, avgCompletionScore: 0, currentStreak: 0 },
    };

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    let dafDelaySum = 0;
    let fafSemiSum = 0;
    let dafRatingSum = 0;
    let fafRatingSum = 0;

    stats.combined.totalSessions = sessions.length;
    const activeDates = new Set<string>();

    for (const s of sessions) {
      activeDates.add(s.startedAt.split('T')[0]);
      stats.combined.totalToolMinutes += s.durationSeconds / 60;
      if (!stats.combined.lastSessionAt || new Date(s.startedAt) > new Date(stats.combined.lastSessionAt)) {
        stats.combined.lastSessionAt = s.startedAt;
      }
      
      if (s.toolType === 'DAF') {
        stats.daf.totalSessions++;
        stats.daf.totalMinutes += s.durationSeconds / 60;
        if (s.startedAt > oneWeekAgo) stats.daf.sessionsThisWeek++;
        if (s.selfRating) dafRatingSum += s.selfRating;
        dafDelaySum += (s as any).delayMs || 0;
      } else if (s.toolType === 'FAF') {
        stats.faf.totalSessions++;
        stats.faf.totalMinutes += s.durationSeconds / 60;
        if (s.startedAt > oneWeekAgo) stats.faf.sessionsThisWeek++;
        if (s.selfRating) fafRatingSum += s.selfRating;
        fafSemiSum += (s as any).pitchSemitones || 0;
      } else if (['BOX_BREATHING', 'DIAPHRAGMATIC', 'PRE_SPEECH'].includes(s.toolType)) {
        stats.breathing.totalSessions++;
        stats.breathing.totalMinutes += s.durationSeconds / 60;
        if (s.toolType === 'BOX_BREATHING') stats.breathing.boxBreathingSessions++;
        if (s.toolType === 'DIAPHRAGMATIC') stats.breathing.diaphragmaticSessions++;
        if (s.toolType === 'PRE_SPEECH') stats.breathing.preSpeechSessions++;
      } else if (['GENTLE_ONSET', 'PROLONGED_SPEECH'].includes(s.toolType)) {
        stats.drills.totalSessions++;
        stats.drills.totalMinutes += s.durationSeconds / 60;
      } else if (['STUTTER_TAP_COUNTER', 'TIMED_READING_WPM'].includes(s.toolType)) {
        stats.biofeedback.totalSessions++;
        stats.biofeedback.totalMinutes += s.durationSeconds / 60;
      } else if (['VIRTUAL_COFFEE_ORDER', 'PHONE_CALL_SIMULATOR'].includes(s.toolType)) {
        stats.simulation.totalSessions++;
        stats.simulation.totalMinutes += s.durationSeconds / 60;
      }
    }

    stats.combined.activeDays = activeDates.size;
    if (stats.daf.totalSessions > 0) {
      stats.daf.avgRating = dafRatingSum / stats.daf.totalSessions;
      stats.daf.avgDelayMs = dafDelaySum / stats.daf.totalSessions;
    }
    if (stats.faf.totalSessions > 0) {
      stats.faf.avgRating = fafRatingSum / stats.faf.totalSessions;
      stats.faf.avgSemitones = fafSemiSum / stats.faf.totalSessions;
    }

    return stats;
  } catch (e) {
    console.error("Error getting tool stats from local storage", e);
    throw new Error('Failed to fetch stats');
  }
};

export type ToolType = 'DAF' | 'FAF' | 'BOX_BREATHING' | 'DIAPHRAGMATIC' | 'PRE_SPEECH' | 'GENTLE_ONSET' | 'PROLONGED_SPEECH' | 'STUTTER_TAP_COUNTER' | 'TIMED_READING_WPM' | 'VIRTUAL_COFFEE_ORDER' | 'PHONE_CALL_SIMULATOR' | 'ALL';

export const getRecentSessions = async (toolType: ToolType, limit: number = 10) => {
  try {
    const cached = await storage.getItem(StorageKeys.APP_SESSIONS);
    const sessions: ToolSessionStats[] = cached ? JSON.parse(cached as string) : [];
    
    const filtered = toolType === 'ALL' 
      ? sessions 
      : sessions.filter(s => s.toolType === toolType);
      
    filtered.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    return { sessions: filtered.slice(0, limit) };
  } catch (e) {
    return { sessions: [] };
  }
};
