#!/usr/bin/env node
// Transcribe a session recording to a timestamped text file, for writing the
// AI_TESTING_CHAPTERS entry of a full-session video.
//
// Usage:
//   node scripts/transcribe.mjs "./public/Session 2.mp4"
//
// Output: <video>.transcript.txt — one paragraph per ~30s with [m:ss] stamps.
// Read it, note where each topic starts, and add the chapters to
// lib/course-content/ai-testing-videos.ts.
//
// Needs OPENAI_API_KEY in .env.local (Whisper API, ~$0.006/min of audio).
// Uses macOS built-in `afconvert` — no ffmpeg required.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

// Load .env.local without a dependency (same pattern as mux-upload.mjs).
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch {
  // no .env.local — rely on the real environment
}

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error('Usage: node scripts/transcribe.mjs <path-to-video-or-audio>');
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY. Add it to .env.local.');
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'transcribe-'));
const wav = path.join(tmp, 'audio.wav');
const m4a = path.join(tmp, 'audio.m4a');

// Two-step: afconvert can't downmix straight to low-bitrate AAC from video.
// 16kHz mono WAV first, then 24kbps AAC (~20MB for 2h — under Whisper's 25MB cap).
console.log('Extracting audio…');
execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16@16000', '--mix', '-o', wav, file]);
execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '24000', '-o', m4a, wav]);
fs.rmSync(wav);
const mb = fs.statSync(m4a).size / 1e6;
console.log(`Audio: ${mb.toFixed(1)} MB${mb > 25 ? ' — over Whisper 25MB limit, split the video first!' : ''}`);

console.log('Transcribing with Whisper (a 2h session takes ~5 minutes)…');
const form = new FormData();
form.append('file', await fs.openAsBlob(m4a, { type: 'audio/mp4' }), 'audio.m4a');
form.append('model', 'whisper-1');
form.append('response_format', 'verbose_json');
form.append('timestamp_granularities[]', 'segment');

const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
  body: form,
});
if (!res.ok) {
  console.error('Whisper API error', res.status, await res.text());
  process.exit(1);
}
const data = await res.json();

// One paragraph per ~30s bucket with a [m:ss] stamp at the start.
const lines = [];
let bucket = -1;
for (const seg of data.segments ?? []) {
  const b = Math.floor(seg.start / 30);
  const stamp = `${Math.floor(seg.start / 60)}:${String(Math.floor(seg.start % 60)).padStart(2, '0')}`;
  if (b !== bucket) {
    lines.push(`\n[${stamp}] `);
    bucket = b;
  }
  lines.push(seg.text.trim() + ' ');
}

const out = file.replace(/\.[^.]+$/, '') + '.transcript.txt';
fs.writeFileSync(out, lines.join(''));
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n✅ Done — ${Math.round((data.duration ?? 0) / 60)} min transcribed.`);
console.log(`   ${out}`);
console.log('\nRead the transcript, note where topics start, then add chapters to');
console.log('lib/course-content/ai-testing-videos.ts (AI_TESTING_CHAPTERS).');
