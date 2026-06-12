const ROUTINE_SCHEMA_INSTRUCTION = `Debes responder EXCLUSIVAMENTE con un objeto JSON válido con esta estructura exacta, sin texto adicional, sin markdown, sin backticks:

{
  "title": "título descriptivo de la rutina",
  "activities": [
    {
      "time": "HH:MM AM/PM",
      "title": "nombre de la actividad",
      "description": "descripción breve y motivadora de la actividad"
    }
  ]
}

Reglas para las actividades:
- Cada actividad debe tener un horario realista en formato 12 horas (ej: "7:00 AM", "2:30 PM")
- Incluye entre 5 y 8 actividades
- La rutina debe cubrir todo el día desde la mañana hasta la noche
- Cada título tiene máximo 40 caracteres
- Cada descripción tiene máximo 80 caracteres
- Todas las actividades deben ser en español
- Los horarios deben estar en orden cronológico`;

export function buildVoicePrompt(transcript: string): string {
  return `Eres un asistente personal de bienestar. El usuario te describió con su propia voz qué tipo de rutina diaria quiere.

Descripción del usuario: "${transcript}"

Genera una rutina diaria personalizada basada en lo que el usuario pidió. Interpreta sus preferencias de forma inteligente.

${ROUTINE_SCHEMA_INSTRUCTION}`;
}

export function buildAnswersPrompt(answers: Record<string, string>): string {
  const timeMap: Record<string, string> = {
    early: "temprano entre 6:00 AM y 8:00 AM",
    mid: "media mañana entre 8:00 AM y 10:00 AM",
    late: "más tarde entre 10:00 AM y 12:00 PM",
  };

  const energyMap: Record<string, string> = {
    high: "alta energía, actividades dinámicas y activas",
    moderate: "energía moderada, mix de actividades activas y tranquilas",
    low: "prefiere actividades tranquilas, relajadas y de baja intensidad",
  };

  const socialMap: Record<string, string> = {
    alone: "prefiere actividades solo/a, tiempo personal",
    mixed: "mix de actividades sociales y personales",
    social: "prefiere actividades con otras personas, en compañía",
  };

  const time = timeMap[answers.time] || "temprano";
  const energy = energyMap[answers.energy] || "energía moderada";
  const social = socialMap[answers.social] || "mixta";

  return `Eres un asistente personal de bienestar. El usuario respondió un cuestionario de preferencias:

- Horario de inicio preferido: ${time}
- Nivel de energía: ${energy}
- Preferencia social: ${social}

Genera una rutina diaria personalizada que se ajuste a estas preferencias.

${ROUTINE_SCHEMA_INSTRUCTION}`;
}
