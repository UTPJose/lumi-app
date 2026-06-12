import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { useRoutines } from "@/hooks/useRoutines";
import { storage } from "@/lib/storage";
import { CARD_STYLES } from "@/styles/tailwind-constants";
import {
  generateRoutineFromVoice,
  generateRoutineFromAnswers,
} from "@/services/geminiService";
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';

type GenerationStatus = "generating" | "connecting" | "analyzing" | "creating" | "error";

const STATUS_MESSAGES: Record<GenerationStatus, string> = {
  connecting: "Conectando con la IA...",
  analyzing: "Analizando tus preferencias...",
  creating: "Generando tu rutina personalizada...",
  generating: "Creando actividades...",
  error: "Ocurrió un error",
};

export function GeneratingPage() {
  const navigate = useNavigate();
  const { addRoutine } = useRoutines();
  const [status, setStatus] = useState<GenerationStatus>("connecting");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const generateRoutine = async () => {
    try {
      setStatus("connecting");
      setErrorMessage("");

      // Small delay to show connecting state
      await new Promise((r) => setTimeout(r, 800));

      const voiceInput = storage.get("voiceInput", "");
      const routineAnswers = storage.get("routineAnswers", {});

      setStatus("analyzing");
      await new Promise((r) => setTimeout(r, 500));

      let routine;

      if (voiceInput) {
        setStatus("creating");
        routine = await generateRoutineFromVoice(voiceInput);
        storage.delete("voiceInput");
      } else if (Object.keys(routineAnswers).length > 0) {
        setStatus("creating");
        routine = await generateRoutineFromAnswers(routineAnswers);
        storage.delete("routineAnswers");
      } else {
        throw new Error("No se encontraron datos para generar la rutina");
      }

      addRoutine(routine);
      navigate(`/routine/${routine.id}`);
    } catch (err) {
      console.error("Generation error:", err);
      const message =
        err instanceof Error ? err.message : "Error desconocido";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  useEffect(() => {
    generateRoutine();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-32 h-32 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-16 h-16 text-destructive" aria-hidden="true" />
          </div>

          <div>
            <h1 className="mb-4">No pudimos generar tu rutina</h1>
            <p className="text-muted-foreground text-xl">{errorMessage}</p>
          </div>

          <div className="space-y-4">
            <AccessibleButton
              onClick={handleRetry}
              variant="primary"
              fullWidth
              icon={RefreshCw}
            >
              Intentar de nuevo
            </AccessibleButton>

            <AccessibleButton
              onClick={() => navigate("/create")}
              variant="outline"
              fullWidth
            >
              Volver
            </AccessibleButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Sparkles
            className="w-16 h-16 text-primary-foreground"
            aria-hidden="true"
          />
        </div>

        <div>
          <h1 className="mb-4">Creando tu rutina...</h1>
          <p className="text-muted-foreground text-xl">
            {STATUS_MESSAGES[status]}
          </p>
        </div>

        <div className={`${CARD_STYLES.white} p-6 rounded-2xl`}>
          <div className="space-y-3">
            <div
              className={`flex items-center gap-3 text-sm ${
                status === "connecting" || status === "analyzing" || status === "creating"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  status === "connecting" ? "bg-primary animate-pulse" : "bg-primary"
                }`}
              />
              <span>Conectando con Vertex AI</span>
            </div>

            <div
              className={`flex items-center gap-3 text-sm ${
                status === "analyzing" || status === "creating"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  status === "analyzing" ? "bg-primary animate-pulse" : status === "creating" ? "bg-primary" : "bg-muted"
                }`}
              />
              <span>Analizando tus preferencias</span>
            </div>

            <div
              className={`flex items-center gap-3 text-sm ${
                status === "creating" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  status === "creating" ? "bg-primary animate-pulse" : "bg-muted"
                }`}
              />
              <span>Generando rutina personalizada</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm">
          Esto puede tomar unos segundos...
        </p>
      </div>
    </div>
  );
}
