import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseWhisperRecordingProps {
  onTranscript: (transcript: string) => void;
  continuous?: boolean;
}

/**
 * High-accuracy voice recording using OpenAI's Whisper API
 * Much more accurate than browser's speech recognition
 */
export function useWhisperRecording({
  onTranscript,
  continuous = false,
}: UseWhisperRecordingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const accumulatedTranscriptRef = useRef<string>('');

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // Only transcribe if there's actual audio data (> 1KB)
        if (audioBlob.size > 1000) {
          await transcribeAudio(audioBlob);
        }

        // Clean up
        audioChunksRef.current = [];
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      toast.success('🎤 Recording... Speak clearly');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      // Convert blob to file
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

      // Create form data
      const formData = new FormData();
      formData.append('audio', audioFile);

      // Send to Whisper API
      const response = await fetch('/api/interview/voice-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      const newTranscript = data.text || '';

      if (newTranscript.trim()) {
        if (continuous && accumulatedTranscriptRef.current) {
          // Append to existing transcript
          const combined = accumulatedTranscriptRef.current + ' ' + newTranscript;
          accumulatedTranscriptRef.current = combined;
          onTranscript(combined);
        } else {
          // Replace transcript
          accumulatedTranscriptRef.current = newTranscript;
          onTranscript(newTranscript);
        }
        toast.success('✓ Transcribed successfully');
      } else {
        toast.warning('No speech detected. Please try again.');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe audio. Please try again or type manually.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const clearTranscript = useCallback(() => {
    accumulatedTranscriptRef.current = '';
  }, []);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    clearTranscript,
  };
}
