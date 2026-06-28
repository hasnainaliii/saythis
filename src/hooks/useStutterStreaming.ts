import { useState, useRef, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { AudioModule } from 'expo-audio';
import { WebView } from 'react-native-webview';
import { calculateStutterScore, StutterResult } from '../utils/stutterScore';
import statsService from '../services/statsService';

const ASSEMBLYAI_API_KEY = process.env.EXPO_PUBLIC_ASSEMBLYAI_API_KEY ?? '';
const WS_BASE = 'wss://streaming.assemblyai.com/v3/ws';
const TOKEN_URL = 'https://streaming.assemblyai.com/v3/token';

const STUTTER_PROMPT =
  'Every disfluency is meaningful data. This is a stuttering analysis session. ' +
  'Transcribe exactly as spoken. Include all of the following: ' +
  '- Stutters: b-but, th-that, w-w-want, s-so ' +
  '- Repetitions: I I, the the, and and, to to ' +
  '- Restarts: I was- I went, He is- he did ' +
  '- Fillers: um, uh, ah, er ' +
  'Do NOT clean up, autocorrect, or remove any speech patterns.';

export const AUDIO_CAPTURE_HTML = `
<!DOCTYPE html>
<html><body><script>
let audioCtx, stream, processor;
let isCapturing = false;

async function startCapture() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: true,
        sampleRate: 16000,
        channelCount: 1
      }
    });
    audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    const source = audioCtx.createMediaStreamSource(stream);
    processor = audioCtx.createScriptProcessor(2048, 1, 1);

    processor.onaudioprocess = function(e) {
      if (!isCapturing) return;
      const float32 = e.inputBuffer.getChannelData(0);
      const pcm16 = new Int16Array(float32.length);
      for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      const bytes = new Uint8Array(pcm16.buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'audio', data: btoa(binary) }));
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);
    isCapturing = true;
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
  } catch(err) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: err.message || 'Microphone error' }));
  }
}

function stopCapture() {
  isCapturing = false;
  if (processor) { processor.disconnect(); processor = null; }
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'stopped' }));
}

document.addEventListener('message', function(e) {
  try { const m = JSON.parse(e.data); if (m.cmd==='start') startCapture(); if (m.cmd==='stop') stopCapture(); } catch(err) {}
});
window.addEventListener('message', function(e) {
  try { const m = JSON.parse(e.data); if (m.cmd==='start') startCapture(); if (m.cmd==='stop') stopCapture(); } catch(err) {}
});
</script></body></html>
`;

async function mintToken(): Promise<string | null> {
  try {
    const resp = await fetch(`${TOKEN_URL}?expires_in_seconds=60`, {
      method: 'GET',
      headers: { Authorization: ASSEMBLYAI_API_KEY },
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.token;
  } catch {
    return null;
  }
}

export function useStutterStreaming() {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [partialText, setPartialText] = useState('');
  const [finalizedLines, setFinalizedLines] = useState<string[]>([]);
  const [statusText, setStatusText] = useState('Tap Start Recording to begin');
  const [result, setResult] = useState<StutterResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  const webViewRef = useRef<WebView>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fullTranscriptRef = useRef('');

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        try { wsRef.current.send(JSON.stringify({ type: 'Terminate' })); wsRef.current.close(); } catch {}
        wsRef.current = null;
      }
    };
  }, []);

  const connectWebSocket = useCallback((token: string) => {
    const prompt = encodeURIComponent(STUTTER_PROMPT);
    const url = `${WS_BASE}?sample_rate=16000&speech_model=u3-rt-pro&token=${token}&prompt=${prompt}&continuous_partials=true`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => { setStatusText('Connected — speak now'); setIsConnecting(false); };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        if (msg.type === 'Begin') {
          setStatusText('Session started — listening…');
        } else if (msg.type === 'Turn') {
          const transcript = msg.transcript || '';
          if (msg.end_of_turn) {
            if (transcript.trim()) {
              setFinalizedLines((prev) => [...prev, transcript.trim()]);
              fullTranscriptRef.current += ' ' + transcript.trim();
            }
            setPartialText('');
          } else {
            setPartialText(transcript);
          }
        } else if (msg.type === 'Termination') {
          setStatusText(`Session ended — ${msg.audio_duration_seconds ?? 0}s processed`);
        } else if (msg.type === 'SpeechStarted') {
          setStatusText('Speech detected — transcribing…');
        }
      } catch {}
    };

    ws.onerror = () => { setStatusText('Connection error — try again'); setIsConnecting(false); setIsRecording(false); };
    ws.onclose = () => { wsRef.current = null; };
  }, []);

  const onWebViewMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'audio' && wsRef.current?.readyState === WebSocket.OPEN) {
        const bin = atob(msg.data);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        wsRef.current.send(bytes.buffer);
      } else if (msg.type === 'ready') {
        setStatusText('Microphone active — connecting…');
      } else if (msg.type === 'error') {
        Alert.alert('Microphone Error', msg.message || 'Could not access microphone');
        setIsRecording(false);
        setIsConnecting(false);
      }
    } catch {}
  }, []);

  const startRecording = useCallback(async () => {
    if (!ASSEMBLYAI_API_KEY) {
      Alert.alert('Missing API Key', 'EXPO_PUBLIC_ASSEMBLYAI_API_KEY is not set in .env');
      return;
    }

    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission Required', 'Microphone permission is needed.');
        return;
      }
    } catch {}

    setResult(null);
    setFinalizedLines([]);
    setPartialText('');
    setTimeLeft(120);
    fullTranscriptRef.current = '';
    setIsConnecting(true);
    setStatusText('Minting session token…');

    const token = await mintToken();
    if (!token) {
      Alert.alert('Connection Failed', 'Could not get session token. Check your API key.');
      setIsConnecting(false);
      return;
    }

    connectWebSocket(token);
    setIsRecording(true);
    webViewRef.current?.postMessage(JSON.stringify({ cmd: 'start' }));
  }, [connectWebSocket]);

  const stopRecording = useCallback(() => {
    webViewRef.current?.postMessage(JSON.stringify({ cmd: 'stop' }));
    setIsRecording(false);
    setStatusText('Calculating stutter score…');

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'Terminate' }));
      setTimeout(() => { wsRef.current?.close(); wsRef.current = null; }, 1500);
    }

    const fullText = fullTranscriptRef.current.trim();
    if (fullText) {
      const scored = calculateStutterScore(fullText);
      setResult(scored);
      setStatusText('Analysis complete');

      // persist to backend
      const today = new Date().toISOString().split('T')[0];
      statsService.patchDaily({
        date: today,
        stutter_score: scored.score,
        stutter_count: scored.stutters,
        repetition_count: scored.repetitions,
        filler_count: scored.fillers,
        total_words: scored.totalWords,
        stutter_transcript: fullText,
      }).catch((e) => console.warn('Failed to sync stutter score:', e));
    } else {
      setResult({ score: 0, stutters: 0, repetitions: 0, fillers: 0, totalWords: 0 });
      setStatusText('No speech detected — try again');
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, stopRecording]);

  return {
    isRecording, isConnecting, partialText, finalizedLines,
    statusText, result, timeLeft, webViewRef, onWebViewMessage,
    startRecording, stopRecording,
  };
}
