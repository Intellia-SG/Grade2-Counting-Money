/**
 * Money Quest Adventure — ElevenLabs Audio Pre-Generator
 * ──────────────────────────────────────────────────────
 * Run once with internet to download all narration MP3s:
 *   npm run generate-audio
 *
 * After running, the app works completely OFFLINE using local files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

// ─── Config ──────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const OUT_DIR   = path.join(ROOT, 'public', 'audio');
const MAP_FILE  = path.join(ROOT, 'src', 'utils', 'audioMap.js');

// Load API key from .env
const envPath = path.join(ROOT, '.env');
let API_KEY = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/VITE_ELEVENLABS_API_KEY\s*=\s*(.+)/);
  if (match) API_KEY = match[1].trim();
}
if (!API_KEY) {
  console.error('❌  No VITE_ELEVENLABS_API_KEY found in .env');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice – warm, friendly teacher voice
const MODEL_ID = 'eleven_multilingual_v2';

// ─── All Narration Texts ─────────────────────────────────────────────────────
// Every static line of narration across all 5 phases.
// Dynamic lines (with question text / scores) use Web Speech as fallback.

const NARRATIONS = [
  // Intro
  { id: 'intro_1',    style: 'encouragement', text: "Welcome to Money Quest Adventure!" },
  { id: 'intro_2',    style: 'statement',     text: "Let's help Emma and her friends restore the Lost Treasure Market of Numeralia by mastering the magic of money." },
  { id: 'intro_3',    style: 'question',      text: "Are you ready to join the quest and become a Master Treasurer?" },
  { id: 'intro_4',    style: 'encouragement', text: "Let's get started on our learning journey!" },

  // Wonder – discover
  { id: 'wonder_d1',  style: 'encouragement', text: "Wow! That is a wonderful discovery!" },
  { id: 'wonder_d2',  style: 'statement',     text: "Every coin and note has a special value that helps us trade and buy things in the market." },

  // Story – slide 0
  { id: 'story_0a',   style: 'statement',     text: "Emma discovers the broken marketplace in Numeralia." },
  { id: 'story_0b',   style: 'statement',     text: "A mysterious spell has scattered all the coins and notes, and the shopkeepers cannot buy or sell anything." },
  { id: 'story_0c',   style: 'question',      text: "Can Emma help them restore the market? Let's find out!" },
  // Story – slide 1
  { id: 'story_1a',   style: 'statement',     text: "Emma enters the Coin Forest, where the Coin Creatures have lost their values!" },
  { id: 'story_1b',   style: 'statement',     text: "Priya and Liam help Emma identify the sizes, colors, and values of Pennies, Nickels, Dimes, and Quarters." },
  { id: 'story_1c',   style: 'emphasis',      text: "Knowing our coins is the first step to unlocking the forest!" },
  // Story – slide 2
  { id: 'story_2a',   style: 'statement',     text: "Emma hears a splash! It's the Counting Stream, where coins float in mathematical patterns." },
  { id: 'story_2b',   style: 'statement',     text: "We skip-count by fives, tens, and twenty-fives to find the total value in our treasure bag." },
  { id: 'story_2c',   style: 'emphasis',      text: "Counting coins quickly helps us shop faster!" },
  // Story – slide 3
  { id: 'story_3a',   style: 'statement',     text: "Emma climbs the Note Mountains, where giant banknotes flutter from the castle towers." },
  { id: 'story_3b',   style: 'statement',     text: "Sarah the Treasurer shows Emma how to identify paper money: ones, fives, tens, and twenties." },
  { id: 'story_3c',   style: 'emphasis',      text: "Notes are used for larger values, so we don't have to carry heavy bags of coins!" },
  // Story – slide 4
  { id: 'story_4a',   style: 'statement',     text: "Emma reaches the Mixing Valley, where ancient gates are sealed with coin and note locks." },
  { id: 'story_4b',   style: 'statement',     text: "We must combine coins and notes together to make the exact target amounts." },
  { id: 'story_4c',   style: 'emphasis',      text: "There are many different ways to make the same value!" },
  // Story – slide 5
  { id: 'story_5a',   style: 'statement',     text: "Emma stands before the Comparison Bridge. Two paths lie ahead, but only one is safe to cross." },
  { id: 'story_5b',   style: 'statement',     text: "We must compare the money in the wallets and cross the bridge with the greater value." },
  { id: 'story_5c',   style: 'emphasis',      text: "Always look closely at values before making a decision!" },
  // Story – slide 6
  { id: 'story_6a',   style: 'statement',     text: "The Shopping Festival returns! The marketplace is alive with colorful stalls and shops." },
  { id: 'story_6b',   style: 'statement',     text: "Mike the Market Master guides Emma to select items, add up their prices, and pay the exact amount." },
  { id: 'story_6c',   style: 'emphasis',      text: "Paying the exact price is what makes a great shopper!" },
  // Story – slide 7
  { id: 'story_7a',   style: 'statement',     text: "Finally, Emma reaches the Word Problem Castle, operating the magical cash register." },
  { id: 'story_7b',   style: 'statement',     text: "We solve real-world shopping riddles and calculate the correct change to give back to the shoppers." },
  { id: 'story_7c',   style: 'celebration',   text: "With the register working, the Treasure Market spell is broken! Emma and her friends celebrate!" },

  // Simulate
  { id: 'sim_s1a',    style: 'instruction',   text: "Welcome to the Coin Workshop! Inspect pennies, nickels, dimes, and quarters." },
  { id: 'sim_s1b',    style: 'statement',     text: "Tap to flip the coins, see their front and back, and drop them on the scale to see their values!" },
  { id: 'sim_s2a',    style: 'instruction',   text: "Welcome to the Banknote Castle! Inspect paper banknotes." },
  { id: 'sim_s2b',    style: 'statement',     text: "Tap the glowing hotspots to discover portraits, security seals, and details of each note!" },
  { id: 'sim_s3a',    style: 'instruction',   text: "Welcome to the Counting Stream! Catch coins as they float by." },
  { id: 'sim_s3b',    style: 'statement',     text: "Put them in the treasure bag to skip-count and feed the Enchanted Piggy Bank!" },
  { id: 'sim_done',   style: 'celebration',   text: "Fantastic job! You've completed all the simulations! Now let's play the game!" },

  // Play
  { id: 'play_inst',  style: 'statement',     text: "Read the question, look at the coins or notes, and choose the correct answer." },
  { id: 'play_wrong', style: 'thinking',      text: "That's okay! Take a close look and try again. You can do it!" },

  // World intros
  { id: 'world_0',    style: 'celebration',   text: "Welcome to Coin Forest!" },
  { id: 'world_1',    style: 'celebration',   text: "Welcome to Counting Stream!" },
  { id: 'world_2',    style: 'celebration',   text: "Welcome to Note Mountains!" },
  { id: 'world_3',    style: 'celebration',   text: "Welcome to Shopping Festival!" },
  { id: 'world_4',    style: 'celebration',   text: "Welcome to Treasure Checkout!" },

  // World completes
  { id: 'done_0',     style: 'celebration',   text: "Great job! You finished the Coin Forest!" },
  { id: 'done_1',     style: 'celebration',   text: "Great job! You finished the Counting Stream!" },
  { id: 'done_2',     style: 'celebration',   text: "Great job! You finished the Note Mountains!" },
  { id: 'done_3',     style: 'celebration',   text: "Great job! You finished the Shopping Festival!" },
  { id: 'done_4',     style: 'celebration',   text: "Great job! You finished the Treasure Checkout!" },

  // Streaks
  { id: 'streak_3',   style: 'encouragement', text: "3 in a row! You are on fire!" },
  { id: 'streak_6',   style: 'encouragement', text: "6 in a row! You are on fire!" },
  { id: 'streak_9',   style: 'encouragement', text: "9 in a row! You are on fire!" },
  { id: 'streak_12',  style: 'encouragement', text: "12 in a row! You are on fire!" },

  // Reflect
  { id: 'ref_intro',  style: 'question',      text: "You have restored the Treasure Market! What is the most important thing you learned about money?" },
  { id: 'ref_cor',    style: 'encouragement', text: "Excellent reflection! That is a very useful money skill." },
  { id: 'ref_conf',   style: 'question',      text: "How confident do you feel now about counting money and making change?" },
  { id: 'ref_cert',   style: 'celebration',   text: "Congratulations! You are officially a Master Treasurer of Numeralia!" },

  // Coin creature speeches (SimulatePhase Station 1)
  { id: 'coin_penny',   style: 'encouragement', text: "Hi! I am Penny Pete. I am made of copper and worth 1 cent. Abraham Lincoln is on my front!" },
  { id: 'coin_nickel',  style: 'encouragement', text: "Hello! I am Nickel Nick. I am worth 5 cents. I am silver-colored and Thomas Jefferson is on my front!" },
  { id: 'coin_dime',    style: 'encouragement', text: "Hey there! I am Dime Dana. I am the smallest coin in size, but I am worth 10 cents! Franklin Roosevelt is on my front." },
  { id: 'coin_quarter', style: 'encouragement', text: "Greetings! I am Quarter Quinn. I am the largest coin here, worth 25 cents. George Washington is on my front!" },
];

// ─── ElevenLabs voice settings per style ─────────────────────────────────────
function voiceSettings(style) {
  switch (style) {
    case 'celebration':
    case 'encouragement': return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'question':      return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis':      return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
    case 'thinking':      return { stability: 0.28, similarity_boost: 0.60, style: 0.30, use_speaker_boost: true };
    case 'instruction':   return { stability: 0.22, similarity_boost: 0.58, style: 0.45, use_speaker_boost: true };
    default:              return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
  }
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────
function fetchBuffer(url, options) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, options, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve({ status: res.statusCode, headers: res.headers, buffer: buf });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ─── Generate one audio file ──────────────────────────────────────────────────
async function generateOne(item) {
  const outPath = path.join(OUT_DIR, `${item.id}.mp3`);

  if (fs.existsSync(outPath)) {
    const stat = fs.statSync(outPath);
    if (stat.size > 1000) {
      process.stdout.write(`  ⏭  [SKIP] ${item.id}\n`);
      return `/audio/${item.id}.mp3`;
    }
  }

  const body = JSON.stringify({
    text: item.text,
    model_id: MODEL_ID,
    voice_settings: voiceSettings(item.style),
  });

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const result = await fetchBuffer(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
      'Content-Length': Buffer.byteLength(body),
    },
    body,
  });

  if (result.status !== 200) {
    const msg = result.buffer.toString('utf8').slice(0, 300);
    throw new Error(`HTTP ${result.status}: ${msg}`);
  }

  fs.writeFileSync(outPath, result.buffer);
  process.stdout.write(`  ✅  [DONE] ${item.id}  (${Math.round(result.buffer.length / 1024)} KB)\n`);
  return `/audio/${item.id}.mp3`;
}

// ─── Build audioMap.js ────────────────────────────────────────────────────────
function buildAudioMap(mapping) {
  const entries = Object.entries(mapping)
    .map(([text, path]) => `  ${JSON.stringify(text)}: ${JSON.stringify(path)},`)
    .join('\n');

  return `// ─── Auto-generated by scripts/generateAudio.mjs ───────────────────────────
// Re-run \`npm run generate-audio\` to refresh.
// Maps narration text → local /audio/*.mp3 path for fully offline playback.

export const audioMap = {
${entries}
};
`;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🎙  Money Quest — ElevenLabs Audio Generator');
  console.log('════════════════════════════════════════════');
  console.log(`  Voice:  Alice (${VOICE_ID})`);
  console.log(`  Model:  ${MODEL_ID}`);
  console.log(`  Lines:  ${NARRATIONS.length}`);
  console.log(`  Output: public/audio/\n`);

  // Ensure output directory exists
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Load existing audioMap if present
  let existingMap = {};
  if (fs.existsSync(MAP_FILE)) {
    try {
      const content = fs.readFileSync(MAP_FILE, 'utf8');
      const matches = [...content.matchAll(/"([^"]+)":\s*"([^"]+)"/g)];
      for (const [, k, v] of matches) existingMap[k] = v;
    } catch {}
  }

  const newMap = { ...existingMap };
  let ok = 0, skipped = 0, failed = 0;

  for (const item of NARRATIONS) {
    try {
      const audioPath = await generateOne(item);
      newMap[item.text] = audioPath;
      if (fs.existsSync(path.join(ROOT, 'public', audioPath))) {
        const stat = fs.statSync(path.join(ROOT, 'public', audioPath));
        if (stat.size > 1000 && audioPath === `/audio/${item.id}.mp3`) {
          process.stdout.write('');
          if (existingMap[item.text] === audioPath) skipped++;
          else ok++;
        }
      }
      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 350));
    } catch (err) {
      console.error(`  ❌  [FAIL] ${item.id}: ${err.message}`);
      failed++;
    }
  }

  // Write updated audioMap
  fs.writeFileSync(MAP_FILE, buildAudioMap(newMap));

  console.log('\n════════════════════════════════════════════');
  console.log(`  ✅  Generated: ${ok}`);
  console.log(`  ⏭  Skipped:   ${skipped}`);
  console.log(`  ❌  Failed:    ${failed}`);
  console.log(`\n  audioMap.js written to src/utils/`);
  console.log('  Your app is now ready for OFFLINE narration! 🎉\n');
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err.message);
  process.exit(1);
});
