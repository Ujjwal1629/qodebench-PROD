import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from './use-debounce';

interface AutoSaveOptions {
  sessionId: string;
  stage: string;
  data: any;
  currentQuestionIndex?: number;
  uiState?: any;
  enabled?: boolean;
  debounceMs?: number;
}

interface AutoSaveResult {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  saveNow: () => Promise<void>;
}

/**
 * Custom hook for auto-saving interview progress
 * - Automatically saves data after debounce period
 * - Provides manual save function
 * - Tracks saving state and errors
 */
export function useInterviewAutoSave({
  sessionId,
  stage,
  data,
  currentQuestionIndex,
  uiState,
  enabled = true,
  debounceMs = 3000, // Auto-save after 3 seconds of inactivity
}: AutoSaveOptions): AutoSaveResult {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use debounce to avoid excessive API calls
  const debouncedData = useDebounce(data, debounceMs);

  // Track if this is the initial mount to avoid saving on first render
  const isFirstRender = useRef(true);

  // Function to perform the actual save
  const performSave = useCallback(async () => {
    if (!enabled || !sessionId || !stage) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/interview/autosave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          stage,
          data,
          currentQuestionIndex,
          uiState,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Auto-save failed');
      }

      const result = await response.json();
      setLastSaved(new Date(result.savedAt));
    } catch (err: any) {
      console.error('Auto-save error:', err);
      setError(err.message || 'Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  }, [sessionId, stage, data, currentQuestionIndex, uiState, enabled]);

  // Auto-save when debounced data changes (after user stops typing)
  useEffect(() => {
    // Skip auto-save on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only save if data is not empty/null
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return;
    }

    performSave();
  }, [debouncedData, performSave]);

  // Manual save function (for explicit saves like "Save Draft" button)
  const saveNow = useCallback(async () => {
    await performSave();
  }, [performSave]);

  // Save on component unmount (when user navigates away)
  useEffect(() => {
    return () => {
      // Use beacon API for reliable save on page unload
      if (enabled && sessionId && stage && data) {
        const payload = JSON.stringify({
          sessionId,
          stage,
          data,
          currentQuestionIndex,
          uiState,
        });

        // Try sendBeacon first (more reliable for unload)
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/interview/autosave', blob);
        } else {
          // Fallback to sync fetch (less reliable)
          fetch('/api/interview/autosave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(console.error);
        }
      }
    };
  }, [sessionId, stage, data, currentQuestionIndex, uiState, enabled]);

  return {
    isSaving,
    lastSaved,
    error,
    saveNow,
  };
}
