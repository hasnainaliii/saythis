import { storage, StorageKeys } from './storage';
import { API_BASE_URL } from '../config/api';
import { addToQueue, getPendingSessions, removePendingSession, incrementAttempt } from './offlineQueue';

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
    const token = await storage.getItem(StorageKeys.USER_TOKEN);
    if (!token) throw new Error('No auth token');

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
    throw error;
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
  const token = await storage.getItem(StorageKeys.USER_TOKEN);
  if (!token) throw new Error('No auth token');

  const response = await fetch(`${API_BASE_URL}/tool-sessions/stats/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch stats');
  return await response.json();
};

export type ToolType = 'DAF' | 'FAF' | 'BOX_BREATHING' | 'DIAPHRAGMATIC' | 'PRE_SPEECH' | 'GENTLE_ONSET' | 'PROLONGED_SPEECH' | 'STUTTER_TAP_COUNTER' | 'TIMED_READING_WPM' | 'VIRTUAL_COFFEE_ORDER' | 'PHONE_CALL_SIMULATOR';

export const getRecentSessions = async (toolType: ToolType, limit: number = 10) => {
  const token = await storage.getItem(StorageKeys.USER_TOKEN);
  if (!token) throw new Error('No auth token');

  const response = await fetch(`${API_BASE_URL}/tool-sessions?toolType=${toolType}&limit=${limit}&offset=0`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch sessions');
  return await response.json();
};
