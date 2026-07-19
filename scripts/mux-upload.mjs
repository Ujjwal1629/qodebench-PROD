#!/usr/bin/env node
// Upload a local video clip to Mux and print its Playback ID.
//
// Usage:
//   node scripts/mux-upload.mjs ./path/to/session3.mp4
//
// Needs MUX_TOKEN_ID and MUX_TOKEN_SECRET in the environment (or .env.local).
// Set MUX_SIGNED=1 to create the asset with a SIGNED playback policy (recommended
// for the paid course — pairs with the /api/courses/video-token signing route).
// Otherwise the playback policy is PUBLIC (fine for quick testing).

import fs from 'node:fs';
import path from 'node:path';
import Mux from '@mux/mux-node';

// Load .env.local without a dependency: parse KEY=VALUE lines.
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
if (!file) {
  console.error('Usage: node scripts/mux-upload.mjs <path-to-video>');
  process.exit(1);
}
if (!fs.existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}
if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  console.error('Missing MUX_TOKEN_ID / MUX_TOKEN_SECRET. Add them to .env.local.');
  process.exit(1);
}

const signed = process.env.MUX_SIGNED === '1';
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

async function main() {
  console.log(`Creating direct upload (${signed ? 'signed' : 'public'} playback)…`);
  const upload = await mux.video.uploads.create({
    cors_origin: '*',
    new_asset_settings: {
      playback_policy: [signed ? 'signed' : 'public'],
      video_quality: 'basic', // cheapest tier (free input); fine for lecture clips
    },
  });

  const bytes = fs.readFileSync(file);
  console.log(`Uploading ${(bytes.length / 1e6).toFixed(1)} MB…`);
  const res = await fetch(upload.url, { method: 'PUT', body: bytes });
  if (!res.ok) {
    console.error(`Upload PUT failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  // Poll the upload until Mux has created the asset, then the asset until ready.
  process.stdout.write('Processing');
  let assetId;
  for (let i = 0; i < 60 && !assetId; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const u = await mux.video.uploads.retrieve(upload.id);
    assetId = u.asset_id;
    process.stdout.write('.');
  }
  if (!assetId) {
    console.log('\nAsset not created yet. Check the Mux dashboard in a minute.');
    process.exit(0);
  }

  // Full-session recordings can take a while to process — poll up to 30 minutes.
  let asset = await mux.video.assets.retrieve(assetId);
  for (let i = 0; i < 360 && asset.status !== 'ready'; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    asset = await mux.video.assets.retrieve(assetId);
    process.stdout.write('.');
    if (asset.status === 'errored') {
      console.error('\nMux failed to process the asset:', asset.errors);
      process.exit(1);
    }
  }

  const playbackId = asset.playback_ids?.[0]?.id;
  if (asset.status !== 'ready') {
    console.log(`\n\n⏳ Upload finished, but the asset is still "${asset.status}".`);
    console.log('   It will become playable once Mux finishes processing (check the dashboard).');
  } else {
    console.log('\n\n✅ Done — asset is ready to play.');
  }
  console.log(`   Asset ID:    ${assetId}`);
  console.log(`   Playback ID: ${playbackId}`);
  console.log(`   Policy:      ${signed ? 'signed' : 'public'}`);
  console.log('\nAdd this line to lib/course-content/ai-testing-videos.ts:');
  console.log(`   "EXACT SESSION TITLE": "${playbackId}",`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
