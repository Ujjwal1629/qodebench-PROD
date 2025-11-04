import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

export function useSpeechRecognition({
  onResult,
  continuous = true,
  interimResults = true,
}: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    try {
      if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          toast.success('Listening... Speak now');
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');

          onResult(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);

          if (event.error === 'no-speech') {
            toast.error('No speech detected. Please try again.');
          } else if (event.error === 'not-allowed') {
            toast.error('Microphone access denied. Please allow microphone access.');
          } else {
            toast.error('Speech recognition error. Please try typing instead.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error('Could not start speech recognition');
      setIsListening(false);
    }
  }, [continuous, interimResults, onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info('Stopped listening');
    }
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
}
