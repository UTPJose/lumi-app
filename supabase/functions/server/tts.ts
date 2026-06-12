import { Context } from "npm:hono";
import * as kv from "./kv_store.ts";

interface TTSRequest {
  text: string;
  language?: string;
  voice?: string;
  pitch?: number;
  rate?: number;
}

interface TTSResponse {
  audio: string;
  contentType: string;
}

function sha256Hash(text: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Simple hash generation for cache keys
  let hash = 0;
  let chr;
  for (let i = 0; i < data.length; i++) {
    chr = data[i];
    hash = ((hash << 5) - hash) + chr;
    hash = hash & hash;
  }
  return "tts_" + Math.abs(hash).toString(36);
}

async function callGoogleCloudTTS(
  text: string,
  language: string = "es-ES",
  voice: string = "es-ES-Neural2-C"
): Promise<string> {
  const apiKey = Deno.env.get("GOOGLE_TTS_KEY");
  if (!apiKey) {
    throw new Error("GOOGLE_TTS_KEY environment variable not set");
  }

  const requestBody = {
    input: { text },
    voice: {
      languageCode: language,
      name: voice,
    },
    audioConfig: {
      audioEncoding: "MP3",
      pitch: 0,
      speakingRate: 1.0,
    },
  };

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Cloud TTS error: ${response.statusText} - ${error}`);
  }

  const result = await response.json() as { audioContent: string };
  return result.audioContent;
}

export async function handleTTS(c: Context): Promise<Response> {
  try {
    const body = await c.req.json() as TTSRequest;
    const { text, language = "es-ES", voice = "es-ES-Neural2-C" } = body;

    // Validate input
    if (!text || text.trim().length === 0) {
      return c.json({ error: "Text is required and cannot be empty" }, 400);
    }

    if (text.length > 5000) {
      return c.json({ error: "Text exceeds maximum length of 5000 characters" }, 400);
    }

    // Generate cache key
    const cacheKey = sha256Hash(text + language + voice);

    // Check cache first
    const cached = await kv.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit for: ${cacheKey}`);
      return c.json({
        audio: cached.audio,
        contentType: "audio/mpeg",
        cached: true,
      });
    }

    // Call Google Cloud TTS API
    console.log(`📝 Synthesizing speech for: "${text.substring(0, 50)}..."`);
    const audioBase64 = await callGoogleCloudTTS(text, language, voice);

    // Cache the result
    const audioData = {
      audio: audioBase64,
      timestamp: new Date().toISOString(),
      language,
      voice,
      textLength: text.length,
    };

    await kv.set(cacheKey, audioData);
    console.log(`💾 Cached audio: ${cacheKey}`);

    return c.json({
      audio: audioBase64,
      contentType: "audio/mpeg",
      cached: false,
    });
  } catch (error) {
    console.error("TTS Error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json(
      {
        error: "Text-to-speech synthesis failed",
        details: message,
      },
      500
    );
  }
}
