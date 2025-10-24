// Browser-based text-to-speech utility using Web Speech API
// This works offline and doesn't require any API keys

export class BrowserSpeech {
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return this.synthesis !== null;
  }

  speak(text: string, options?: {
    rate?: number; // 0.1 to 10
    pitch?: number; // 0 to 2
    volume?: number; // 0 to 1
    voice?: string; // voice name
    onEnd?: () => void;
    onError?: (error: any) => void;
  }): void {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    // Preprocess text for better pronunciation
    const processedText = this.preprocessText(text);

    const utterance = new SpeechSynthesisUtterance(processedText);

    // Set options
    utterance.rate = options?.rate ?? 0.9; // Slightly slower for clarity
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;

    // Try to find a good voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = this.selectBestVoice(voices, options?.voice);
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Set up event listeners
    if (options?.onEnd) {
      utterance.onend = options.onEnd;
    }

    if (options?.onError) {
      utterance.onerror = options.onError;
    }

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  pause(): void {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synthesis?.speaking ?? false;
  }

  isPaused(): boolean {
    return this.synthesis?.paused ?? false;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() ?? [];
  }

  private selectBestVoice(voices: SpeechSynthesisVoice[], preferredName?: string): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;

    // If specific voice requested, try to find it
    if (preferredName) {
      const voice = voices.find(v => v.name.toLowerCase().includes(preferredName.toLowerCase()));
      if (voice) return voice;
    }

    // Try to find high-quality English voices
    const priorities = [
      // Google voices (high quality)
      'Google US English',
      'Google UK English Female',
      'Google UK English Male',
      // Microsoft voices
      'Microsoft Zira',
      'Microsoft David',
      // Apple voices
      'Samantha',
      'Alex',
      // Any English voice
      'en-US',
      'en-GB',
      'en',
    ];

    for (const priority of priorities) {
      const voice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes(priority) || v.lang.includes(priority))
      );
      if (voice) return voice;
    }

    // Fallback to first English voice
    return voices.find(v => v.lang.startsWith('en')) ?? voices[0];
  }

  private preprocessText(text: string): string {
    let processed = text;

    // Add pauses for better pacing (using commas which create natural pauses)
    processed = processed.replace(/\. /g, '. , ');
    processed = processed.replace(/\? /g, '? , ');
    processed = processed.replace(/! /g, '! , ');

    // Fix common technical term pronunciations
    const pronunciationMap: Record<string, string> = {
      'API': 'A P I',
      'APIs': 'A P I s',
      'URL': 'U R L',
      'URLs': 'U R L s',
      'CSS': 'C S S',
      'HTML': 'H T M L',
      'SQL': 'S Q L',
      'JSON': 'J SON',
      'OAuth': 'O Auth',
      'JWT': 'J W T',
      'UI': 'U I',
      'UX': 'U X',
      'CDN': 'C D N',
      'DNS': 'D N S',
      'HTTP': 'H T T P',
      'HTTPS': 'H T T P S',
      'REST': 'REST',
      'CRUD': 'crud',
      'CI/CD': 'C I C D',
    };

    // Replace technical terms with phonetic spellings
    Object.entries(pronunciationMap).forEach(([term, pronunciation]) => {
      const regex = new RegExp(`\\b${term}\\b`, 'g');
      processed = processed.replace(regex, pronunciation);
    });

    return processed;
  }
}

// Singleton instance
let browserSpeechInstance: BrowserSpeech | null = null;

export function getBrowserSpeech(): BrowserSpeech {
  if (!browserSpeechInstance) {
    browserSpeechInstance = new BrowserSpeech();
  }
  return browserSpeechInstance;
}
