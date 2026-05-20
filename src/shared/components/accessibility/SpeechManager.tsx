import React from 'react';
import { useSpeechManager } from '../../../hooks/useSpeechManager';

export function SpeechManager({ children }: { children: React.ReactNode }) {
  useSpeechManager();

  return <>{children}</>;
}
