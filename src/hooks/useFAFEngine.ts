import { useRef, useState, useCallback } from 'react';
import WebView from 'react-native-webview';

export const useFAFEngine = () => {
  const webViewRef = useRef<WebView>(null);
  const [amplitude, setAmplitude] = useState(0);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [isEngineStopped, setIsEngineStopped] = useState(false);

  const startEngine = useCallback(() => {
    setIsEngineStopped(false);
    webViewRef.current?.injectJavaScript(`document.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ cmd: 'start' }) })); true;`);
  }, []);

  const stopEngine = useCallback(() => {
    webViewRef.current?.injectJavaScript(`document.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ cmd: 'stop' }) })); true;`);
  }, []);

  const setSemitones = useCallback((st: number) => {
    webViewRef.current?.injectJavaScript(`document.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ cmd: 'setSemitones', value: ${st} }) })); true;`);
  }, []);

  const onMessage = useCallback((event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'amplitude') setAmplitude(msg.value);
      if (msg.type === 'ready') setIsEngineReady(true);
      if (msg.type === 'stopped') {
        setIsEngineReady(false);
        setIsEngineStopped(true);
      }
      if (msg.type === 'error') {
        console.error("FAF Engine Error:", msg.value);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  return {
    webViewRef,
    amplitude,
    isEngineReady,
    isEngineStopped,
    startEngine,
    stopEngine,
    setSemitones,
    onMessage
  };
};
