import { Routine } from "@/types";
import { buildVoicePrompt, buildAnswersPrompt } from "./prompts";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/server`;

interface GeminiResponse {
  text?: string;
  error?: string;
  details?: string;
}

interface GeminiTextResponse {
  title: string;
  activities: Array<{
    time: string;
    title: string;
    description: string;
  }>;
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(`${SERVER_URL}/gemini`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ prompt }),
  });

  const data: GeminiResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.details || data.error || "Error calling Gemini");
  }

  if (!data.text) {
    throw new Error("Empty response from Gemini");
  }

  return data.text;
}

function parseGeminiResponse(raw: string): GeminiTextResponse {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(cleaned);

  if (!parsed.title || !Array.isArray(parsed.activities)) {
    throw new Error("Invalid routine structure from Gemini");
  }

  return parsed;
}

function mapToRoutine(data: GeminiTextResponse): Routine {
  return {
    id: Date.now().toString(),
    title: data.title,
    date: new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    activities: data.activities.map((act, index) => ({
      id: (index + 1).toString(),
      time: act.time,
      title: act.title,
      description: act.description,
      completed: false,
    })),
    saved: false,
  };
}

export async function generateRoutineFromVoice(
  transcript: string
): Promise<Routine> {
  const prompt = buildVoicePrompt(transcript);
  const raw = await callGemini(prompt);
  const parsed = parseGeminiResponse(raw);
  return mapToRoutine(parsed);
}

export async function generateRoutineFromAnswers(
  answers: Record<string, string>
): Promise<Routine> {
  const prompt = buildAnswersPrompt(answers);
  const raw = await callGemini(prompt);
  const parsed = parseGeminiResponse(raw);
  return mapToRoutine(parsed);
}
