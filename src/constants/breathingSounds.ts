// Minimal tone generation via expo-av is too heavy for base64 approach.
// Instead we use expo-haptics as the "audio cue" — a distinct vibration pattern
// for each phase transition. For actual tone playback we generate short
// oscillator tones via the Audio API when expo-av is available.

export const PHASE_TONES = {
  inhale: 440,   // A4
  hold: 528,     // C5
  exhale: 396,   // G4
  rest: 396,
  complete: 880, // A5
} as const;

// Duration of each tone in ms
export const TONE_DURATION_MS = 80;
