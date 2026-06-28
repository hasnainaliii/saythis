// Maps snake_case backend tool_stats to camelCase for frontend components

const snakeToCamel = (str: string) =>
  str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

const mapKeys = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const camelKey = snakeToCamel(key);
    result[camelKey] = val !== null && typeof val === "object" && !Array.isArray(val)
      ? mapKeys(val)
      : val;
  }
  return result;
};

export const mapToolStats = (raw: Record<string, any>) => {
  const mapped: Record<string, any> = {};
  for (const category of Object.keys(raw)) {
    mapped[category] = mapKeys(raw[category]);
  }
  return mapped;
};

export const mapWeeklyActivity = (
  raw: { date: string; day: string; sessions: number }[]
) => raw.map((d) => ({ label: d.day, value: d.sessions }));

export const mapWeeklyTrend = (
  raw: { week_label: string; total_minutes: number }[]
) => raw.map((w) => ({ label: w.week_label, value: w.total_minutes }));

export const mapRecentSessions = (raw: any[]) =>
  raw.map((s) => mapKeys(s));
