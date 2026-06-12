declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface ManagerCallbacks {
  onResult: (text: string, isFinal: boolean) => void;
  onEnd: () => void;
  onError: (error: string) => void;
}

type OwnerId = 'assistant' | 'recorder';

let recognition: any = null;
let currentOwner: OwnerId | null = null;
let currentCallbacks: ManagerCallbacks | null = null;

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}

function stopRecognition() {
  if (recognition) {
    try {
      recognition.abort();
    } catch {
      // ignore
    }
    recognition.onstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    recognition = null;
  }
}

export function acquire(
  ownerId: OwnerId,
  callbacks: ManagerCallbacks
): boolean {
  const SpeechRecognition = getSpeechRecognition();
  if (!SpeechRecognition) return false;

  // Already owned by someone else — stop it first
  if (currentOwner && currentOwner !== ownerId) {
    stopRecognition();
    currentOwner = null;
    currentCallbacks = null;
  }

  // Already owned by same owner — reject
  if (currentOwner === ownerId) {
    return false;
  }

  // Create new instance
  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = 'es-ES';
  rec.maxAlternatives = 1;

  rec.onstart = () => {
    currentOwner = ownerId;
  };

  rec.onresult = (event: any) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const isFinal = event.results[i].isFinal;
      callbacks.onResult(transcript, isFinal);
    }
  };

  rec.onerror = (event: any) => {
    callbacks.onError(event.error);
  };

  rec.onend = () => {
    recognition = null;
    currentOwner = null;
    callbacks.onEnd();
  };

  try {
    rec.start();
    recognition = rec;
    currentOwner = ownerId;
    currentCallbacks = callbacks;
    return true;
  } catch {
    recognition = null;
    currentOwner = null;
    currentCallbacks = null;
    return false;
  }
}

export function release(ownerId: OwnerId) {
  if (currentOwner === ownerId) {
    stopRecognition();
    currentOwner = null;
    currentCallbacks = null;
  }
}

export function isOwned(): boolean {
  return currentOwner !== null;
}

export function getOwner(): OwnerId | null {
  return currentOwner;
}
