import React from "react";
import { useNavigate } from "react-router";
import { Mic, StopCircle, Trash2 } from "lucide-react";
import { AccessibleButton } from "../../../shared/components/buttons/AccessibleButton";
import { PageLayout } from "../../../shared/components/layouts/PageLayout";
import { storage } from "@/lib/storage";
import { CARD_STYLES } from "@/styles/tailwind-constants";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

export function VoiceInputPage() {
  const navigate = useNavigate();
  const {
    isRecording,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startRecording,
    stopRecording,
    clearTranscript,
  } = useVoiceRecorder();

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleContinue = () => {
    if (transcript) {
      storage.set("voiceInput", transcript);
      navigate("/create/generating");
    }
  };

  const handleClear = () => {
    stopRecording();
    clearTranscript();
  };

  const displayText = transcript || interimTranscript;

  return (
    <PageLayout showNavigation={false}>
      <div>
        <h1 className="mb-3">Cuéntanos con tu voz</h1>
        <p className="text-muted-foreground">
          Describe qué actividades te gustaría incluir en tu rutina. Habla de
          forma natural y clara.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 space-y-8">
        <button
          onClick={handleToggleRecording}
          disabled={!isSupported}
          className={`w-40 h-40 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-destructive animate-pulse"
              : "bg-primary hover:opacity-90"
          } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={isRecording ? "Detener grabación" : "Comenzar grabación"}
          aria-pressed={isRecording}
        >
          {isRecording ? (
            <StopCircle className="w-20 h-20 text-white" aria-hidden="true" />
          ) : (
            <Mic className="w-20 h-20 text-white" aria-hidden="true" />
          )}
        </button>

        <div className="text-center">
          <h3
            className={
              isRecording ? "text-destructive" : "text-muted-foreground"
            }
          >
            {isRecording
              ? "Grabando... habla ahora"
              : "Toca para comenzar a grabar"}
          </h3>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {!isSupported && (
        <div className="bg-secondary p-4 rounded-2xl">
          <p className="text-muted-foreground text-sm">
            Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o
            Edge.
          </p>
        </div>
      )}

      {displayText && (
        <div className="bg-secondary p-6 rounded-2xl">
          <h4 className="mb-3">Escuchamos:</h4>
          <p className="text-foreground leading-relaxed">
            &ldquo;{displayText}
            {!transcript && interimTranscript ? "..." : ""}&rdquo;
          </p>
          {transcript && !isRecording && (
            <button
              onClick={handleClear}
              className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Borrar y volver a grabar
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className={`${CARD_STYLES.white} p-6 rounded-2xl border-2`}>
          <h4 className="mb-2">Consejos:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>Habla en un lugar tranquilo</li>
            <li>Menciona horarios si los tienes en mente</li>
            <li>Incluye cualquier preferencia especial</li>
          </ul>
        </div>

        {transcript && (
          <AccessibleButton
            onClick={handleContinue}
            variant="primary"
            fullWidth
          >
            Generar rutina
          </AccessibleButton>
        )}

        <AccessibleButton
          onClick={() => navigate("/create")}
          variant="outline"
          fullWidth
        >
          Volver
        </AccessibleButton>
      </div>
    </PageLayout>
  );
}
