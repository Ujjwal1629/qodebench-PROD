import { NextRequest, NextResponse } from 'next/server';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';
import { getOpenAIClient } from '@/lib/openai-client';
import { rateLimiter, getRateLimitIdentifier } from '@/lib/utils/rate-limiter';

/**
 * TTS Cache with proper memory management
 * - Time-based TTL
 * - Size-bounded
 * - LRU eviction
 */
interface CacheEntry {
  buffer: Buffer;
  createdAt: number;
  accessedAt: number;
  size: number;
}

class TTSCache {
  private cache = new Map<string, CacheEntry>();
  private readonly MAX_ENTRIES = 50; // Reduced from 100
  private readonly MAX_MEMORY_MB = 50; // Max 50MB cache
  private readonly TTL_MS = 30 * 60 * 1000; // 30 minutes TTL
  private currentMemory = 0;

  get(key: string): Buffer | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.createdAt > this.TTL_MS) {
      this.delete(key);
      return null;
    }

    // Update access time
    entry.accessedAt = Date.now();
    return entry.buffer;
  }

  set(key: string, buffer: Buffer): void {
    const size = buffer.length;

    // Don't cache very large audio files (over 1MB)
    if (size > 1024 * 1024) return;

    // Evict if needed
    while (
      (this.cache.size >= this.MAX_ENTRIES ||
        this.currentMemory + size > this.MAX_MEMORY_MB * 1024 * 1024) &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }

    this.cache.set(key, {
      buffer,
      createdAt: Date.now(),
      accessedAt: Date.now(),
      size,
    });
    this.currentMemory += size;
  }

  private delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentMemory -= entry.size;
      this.cache.delete(key);
    }
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessedAt < oldestTime) {
        oldestTime = entry.accessedAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  getStats() {
    return {
      entries: this.cache.size,
      memoryMB: Math.round(this.currentMemory / 1024 / 1024 * 100) / 100,
      maxMemoryMB: this.MAX_MEMORY_MB,
    };
  }
}

// Singleton cache instance
const ttsCache = new TTSCache();

export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    // Rate limiting
    const rateLimitResult = rateLimiter.checkAndRespond(
      getRateLimitIdentifier(user.id),
      'interview'
    );
    if (rateLimitResult) return rateLimitResult.response;

    const { text, voice = 'nova', speed = 1.0 } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Limit text length
    if (text.length > 2000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 2000 characters allowed' },
        { status: 413 }
      );
    }

    // Validate speed (OpenAI supports 0.25 to 4.0)
    const validSpeed = Math.max(0.25, Math.min(4.0, speed));

    // Check cache first
    const cacheKey = `${voice}:${validSpeed}:${text}`;
    const cachedAudio = ttsCache.get(cacheKey);
    if (cachedAudio) {
      return new NextResponse(new Uint8Array(cachedAudio), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': cachedAudio.length.toString(),
          'Cache-Control': 'public, max-age=3600', // 1 hour client cache
          'X-Cache': 'HIT',
        },
      });
    }

    // Initialize OpenAI client (singleton)
    const openai = getOpenAIClient();

    // Preprocess text for better pronunciation
    const processedText = preprocessTextForSpeech(text);

    // Generate speech with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const mp3 = await openai.audio.speech.create(
        {
          model: 'tts-1-hd',
          voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
          input: processedText,
          speed: validSpeed,
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      const buffer = Buffer.from(await mp3.arrayBuffer());

      // Cache short responses only
      if (text.length < 500) {
        ttsCache.set(cacheKey, buffer);
      }

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=3600',
          'X-Cache': 'MISS',
        },
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Text-to-speech request timed out' },
          { status: 504 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Text-to-speech error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

// Preprocess text for better pronunciation
function preprocessTextForSpeech(text: string): string {
  let processed = text;

  // Add pauses after punctuation for better pacing
  processed = processed.replace(/\. /g, '. ... ');
  processed = processed.replace(/\? /g, '? ... ');
  processed = processed.replace(/! /g, '! ... ');

  // Fix common technical term pronunciations
  const pronunciationMap: Record<string, string> = {
    'API': 'A P I',
    'APIs': 'A P Is',
    'URL': 'U R L',
    'URLs': 'U R Ls',
    'CSS': 'C S S',
    'HTML': 'H T M L',
    'SQL': 'S Q L',
    'JSON': 'J SON',
    'REST': 'REST',
    'CRUD': 'crud',
    'OAuth': 'O Auth',
    'JWT': 'J W T',
    'UI': 'U I',
    'UX': 'U X',
    'CI/CD': 'C I C D',
    'CDN': 'C D N',
    'DNS': 'D N S',
    'HTTP': 'H T T P',
    'HTTPS': 'H T T P S',
    'SSR': 'S S R',
    'CSR': 'C S R',
    'SSG': 'S S G',
    'ISR': 'I S R',
  };

  // Replace technical terms with better pronunciations
  Object.entries(pronunciationMap).forEach(([term, pronunciation]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'g');
    processed = processed.replace(regex, pronunciation);
  });

  return processed;
}
