import { useState, useCallback } from "react";
import { storage } from "../utils/storage";
import statsService, { StatsResponse } from "../services/statsService";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "";

export interface FeedbackResult {
  response: string;
  generatedAt: string;
}

const FEEDBACK_CACHE_KEY = "ai_feedback_cache";

const buildPrompt = (stats: StatsResponse): string => {
  const t = stats.today;
  const ws = stats.wellness_summary;
  const ss = stats.stutter_summary;
  const ts = stats.tool_stats?.combined;

  return `You are a caring and knowledgeable speech therapy AI coach for a stuttering therapy app called SayThis. Analyze the user's data below and provide personalized, encouraging feedback.

USER DATA:
- Today's mood: ${t?.mood ?? "not logged"}
- Today's sleep: ${t?.sleep_hours != null ? t.sleep_hours + "h" : "not logged"}
- Today's stress: ${t?.stress_level != null ? "level " + t.stress_level + "/5" : "not logged"}
- Today's mindful hours: ${t?.mindful_hours != null ? t.mindful_hours + "h" : "not logged"}
- Journal streak: ${stats.journal_streak} days
- Days tracked: ${ws?.days_tracked ?? 0}
- Avg sleep: ${ws?.avg_sleep_hours != null ? ws.avg_sleep_hours.toFixed(1) + "h" : "N/A"}
- Avg stress: ${ws?.avg_stress_level != null ? ws.avg_stress_level.toFixed(1) + "/5" : "N/A"}
- Total journal entries: ${ws?.total_journal_entries ?? 0}
- Latest stutter score: ${ss?.latest_score != null ? ss.latest_score + "%" : "no analysis done"}
- Average stutter score: ${ss?.avg_score != null ? ss.avg_score.toFixed(1) + "%" : "N/A"}
- Best stutter score: ${ss?.best_score != null ? ss.best_score + "%" : "N/A"}
- Total stutter analyses: ${ss?.total_analyses ?? 0}
- Total therapy sessions: ${ts?.total_sessions ?? 0}
- Total practice minutes: ${ts?.total_minutes != null ? Math.round(ts.total_minutes) : 0}
- Current practice streak: ${ts?.current_streak ?? 0} days
- Active practice days: ${ts?.active_days ?? 0}

INSTRUCTIONS:
1. Start with a warm, personal greeting
2. Comment on their current wellness (sleep, stress, mood) if available
3. Analyze their stutter score trend — improving or needs attention?
4. Acknowledge their practice consistency (streaks, sessions)
5. Give 2-3 specific, actionable tips to improve
6. If they have very little data, encourage them to use the stutter analysis tool and practice with therapy exercises
7. End with motivation
8. Keep the response concise — around 150-200 words
9. Use plain text only, no markdown formatting
10. Be empathetic and understanding about stuttering`;
};

export const useAiFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCachedFeedback = useCallback(async () => {
    try {
      const cached = await storage.getItem(FEEDBACK_CACHE_KEY);
      if (!cached) return;
      const parsed = JSON.parse(cached as string) as FeedbackResult;
      const today = new Date().toISOString().split("T")[0];
      if (parsed.generatedAt === today) {
        setFeedback(parsed);
      }
    } catch {
      // no cache
    }
  }, []);

  const canRequestToday = useCallback(async (): Promise<boolean> => {
    try {
      const cached = await storage.getItem(FEEDBACK_CACHE_KEY);
      if (!cached) return true;
      const parsed = JSON.parse(cached as string) as FeedbackResult;
      const today = new Date().toISOString().split("T")[0];
      return parsed.generatedAt !== today;
    } catch {
      return true;
    }
  }, []);

  const generateFeedback = useCallback(async () => {
    if (!GEMINI_API_KEY) {
      setError("Gemini API key not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stats = await statsService.getStats();
      const prompt = buildPrompt(stats);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: {
              role: "user",
              parts: [{ text: "You are a caring and knowledgeable speech therapy AI coach for a stuttering therapy app called SayThis." }]
            }
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Gemini request failed: ${res.status}`);
      }

      const data = await res.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        throw new Error("Invalid response format from Gemini");
      }

      const today = new Date().toISOString().split("T")[0];
      const result: FeedbackResult = {
        response: textResponse,
        generatedAt: today,
      };

      setFeedback(result);
      await storage.setItem(FEEDBACK_CACHE_KEY, JSON.stringify(result));
    } catch (e: any) {
      setError(e.message || "Failed to generate feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  return { feedback, loading, error, loadCachedFeedback, canRequestToday, generateFeedback };
};
