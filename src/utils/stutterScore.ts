export interface StutterResult {
  score: number;
  stutters: number;
  repetitions: number;
  fillers: number;
  totalWords: number;
}

export function calculateStutterScore(transcript: string): StutterResult {
  const tokens = transcript
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  const totalWords = tokens.length;

  if (totalWords === 0) {
    return { score: 0, stutters: 0, repetitions: 0, fillers: 0, totalWords: 0 };
  }

  const stutterPattern = /\b\w+-\w+\b/;
  let stutters = 0;
  for (const token of tokens) {
    if (stutterPattern.test(token)) stutters++;
  }

  let repetitions = 0;
  for (let i = 1; i < tokens.length; i++) {
    if (tokens[i].toLowerCase() === tokens[i - 1].toLowerCase()) repetitions++;
  }

  const fillerSet = new Set(['um', 'uh', 'ah', 'er']);
  let fillers = 0;
  for (const token of tokens) {
    const clean = token.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (fillerSet.has(clean)) fillers++;
  }

  const rawScore = ((stutters + repetitions + fillers) / totalWords) * 100;
  const score = Math.min(100, Math.round(rawScore * 10) / 10);

  return { score, stutters, repetitions, fillers, totalWords };
}
