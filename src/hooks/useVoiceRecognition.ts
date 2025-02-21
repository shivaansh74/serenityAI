import { useState, useCallback } from 'react';
import VoiceRecognitionService from '../services/VoiceRecognitionService';

interface UseVoiceRecognitionProps {
  onResult: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export const useVoiceRecognition = ({ onResult, onError }: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    setError(null);
    setIsListening(true);

    VoiceRecognitionService.startListening(
      (text, isFinal) => {
        onResult(text, isFinal);
      },
      (error) => {
        setError(error);
        setIsListening(false);
        if (onError) {
          onError(error);
        }
      }
    );
  }, [onResult, onError]);

  const stopListening = useCallback(() => {
    VoiceRecognitionService.stopListening();
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    error,
    isSupported: VoiceRecognitionService.isSupported(),
    startListening,
    stopListening,
    toggleListening,
  };
}; 