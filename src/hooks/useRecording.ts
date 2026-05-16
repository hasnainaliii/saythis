import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useAudioRecorder,
  useAudioPlayer,
  AudioModule,
  RecordingPresets,
  useAudioRecorderState,
} from 'expo-audio';

// Session-only recordings — not persisted between app restarts
export function useRecording() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const [recordings, setRecordings] = useState<Record<string, string>>({});
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [permGranted, setPermGranted] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setPermGranted(status.granted);
      return status.granted;
    } catch {
      setPermGranted(false);
      return false;
    }
  }, []);

  const startRecording = useCallback(async (key: string) => {
    if (permGranted === null || permGranted === false) {
      const granted = await requestPermission();
      if (!granted) return false;
    }
    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      setActiveKey(key);
      return true;
    } catch {
      return false;
    }
  }, [recorder, permGranted, requestPermission]);

  const stopRecording = useCallback(async () => {
    if (!activeKey) return null;
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (uri) {
        setRecordings(prev => ({ ...prev, [activeKey]: uri }));
      }
      const key = activeKey;
      setActiveKey(null);
      return { key, uri };
    } catch {
      setActiveKey(null);
      return null;
    }
  }, [recorder, activeKey]);

  const getUri = useCallback((key: string) => recordings[key] ?? null, [recordings]);

  const clearRecording = useCallback((key: string) => {
    setRecordings(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  return {
    startRecording,
    stopRecording,
    getUri,
    clearRecording,
    isRecording: recorderState.isRecording,
    activeKey,
    permGranted,
    requestPermission,
  };
}
