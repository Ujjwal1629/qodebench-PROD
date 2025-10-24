'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start visualization
      visualize();

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendToTranscription(audioBlob);

        // Cleanup
        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateLevel = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setAudioLevel(average / 255); // Normalize to 0-1

      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  const sendToTranscription = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/interview/voice-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      onTranscript(data.text);
    } catch (err: any) {
      console.error('Transcription error:', err);
      setError('Failed to transcribe audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Voice Recorder</h3>
            <p className="text-sm text-muted-foreground">
              {isRecording
                ? 'Recording... Click stop when done'
                : isProcessing
                ? 'Processing your answer...'
                : 'Hold to record your answer'}
            </p>
          </div>
        </div>

        {/* Audio Level Visualization */}
        {isRecording && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-8 w-2 rounded-full transition-all duration-100',
                    audioLevel > i / 20 ? 'bg-blue-600' : 'bg-slate-200'
                  )}
                  style={{
                    height: audioLevel > i / 20 ? `${Math.min(32 + audioLevel * 40, 64)}px` : '8px',
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Audio level: {Math.round(audioLevel * 100)}%
            </p>
          </div>
        )}

        {/* Record Button */}
        <div className="flex justify-center pt-4">
          {!isRecording && !isProcessing && (
            <Button
              size="lg"
              className="w-full md:w-auto gap-2"
              onClick={startRecording}
              disabled={disabled}
            >
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button
              size="lg"
              variant="destructive"
              className="w-full md:w-auto gap-2"
              onClick={stopRecording}
            >
              <MicOff className="h-5 w-5" />
              Stop Recording
            </Button>
          )}

          {isProcessing && (
            <Button size="lg" disabled className="w-full md:w-auto gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Tips */}
        <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Speak clearly and at a normal pace</li>
            <li>Ensure you are in a quiet environment</li>
            <li>Keep your answer between 1-3 minutes</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
