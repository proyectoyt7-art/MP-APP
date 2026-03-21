// ─────────────────────────────────────────────────────────────────────────────
// components/agente/useVoiceInput.js
// Custom hook for Web Speech API voice input.
// ─────────────────────────────────────────────────────────────────────────────
"use client"
import { useState, useRef, useEffect } from 'react';

export function useVoiceInput({ onResult, onError } = {}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const start = () => {
    if (!isSupported) {
      onError?.('Tu navegador no soporta dictado por voz.');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'es-CL';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      onResult?.(transcript, event.results[event.results.length - 1].isFinal);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        onError?.('Permiso de micrófono denegado.');
      } else if (event.error === 'no-speech') {
        onError?.('No se detectó voz. Intenta de nuevo.');
      } else {
        onError?.('Error de dictado. Intenta de nuevo.');
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return { isListening, start, stop, isSupported };
}
