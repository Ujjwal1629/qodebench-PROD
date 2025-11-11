import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

// Cache for common phrases to reduce API calls
const ttsCache = new Map<string, Buffer>();

export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    // Initialize OpenAI client only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    const { text, voice = 'nova', speed = 1.0 } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Validate speed (OpenAI supports 0.25 to 4.0)
    const validSpeed = Math.max(0.25, Math.min(4.0, speed));

    // Check cache first
    const cacheKey = `${voice}:${validSpeed}:${text}`;
    if (ttsCache.has(cacheKey)) {
      const audio = ttsCache.get(cacheKey)!;
      return new NextResponse(new Uint8Array(audio), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audio.length.toString(),
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        },
      });
    }

    // Preprocess text for better pronunciation
    const processedText = preprocessTextForSpeech(text);

    // Generate speech with HD model for better quality
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd', // HD model for better quality and pronunciation
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: processedText,
      speed: validSpeed,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Cache responses (more aggressive caching for common phrases)
    if (text.length < 500) {
      ttsCache.set(cacheKey, buffer);
      // Limit cache size to 100 entries
      if (ttsCache.size > 100) {
        const firstKey = ttsCache.keys().next().value;
        if (firstKey) {
          ttsCache.delete(firstKey);
        }
      }
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: any) {
    console.error('Text-to-speech error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
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
