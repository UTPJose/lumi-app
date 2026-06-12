import { useState, useRef, useCallback, useEffect } from "react";
import { acquire, release } from "../services/speechRecognitionManager";

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  clearTranscript: () => void;
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const shouldRestartRef = useRef(false);

  const isSupported = typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      release("recorder");
    };
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  const tryAcquire = useCallback(() => {
    if (!shouldRestartRef.current) return;

    const success = acquire("recorder", {
      onResult: (text, isFinal) => {
        if (isFinal) {
          setTranscript((prev) => (prev ? `${prev} ${text}` : text));
          setInterimTranscript("");
        } else {
          setInterimTranscript(text);
        }
      },
      onEnd: () => {
        setIsRecording(false);
        if (shouldRestartRef.current) {
          setTimeout(tryAcquire, 200);
        }
      },
      onError: (error) => {
        console.error("🎤 Recorder error:", error);
        if (error === "not-allowed") {
          setError("Permiso de micrófono denegado. Habilita el acceso en la configuración de tu navegador.");
          setIsRecording(false);
          shouldRestartRef.current = false;
        } else if (error === "no-speech") {
          // No speech detected — restart silently
          if (shouldRestartRef.current) {
            setTimeout(tryAcquire, 200);
          }
        }
      },
    });

    if (success) {
      setIsRecording(true);
      setError(null);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      setError("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    setError(null);
    setInterimTranscript("");
    shouldRestartRef.current = true;
    tryAcquire();
  }, [isSupported, tryAcquire]);

  const stopRecording = useCallback(() => {
    shouldRestartRef.current = false;
    release("recorder");
    setIsRecording(false);
    setInterimTranscript("");
  }, []);

  return {
    isRecording,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startRecording,
    stopRecording,
    clearTranscript,
  };
}
