// ──────────────────────────────────────────────────────────────────────────────
// Audio Engine — Money Quest Adventure
//
// Priority for every narration line:
//   1. Local pre-generated MP3 from audioMap.js  ← fully offline after generation
//   2. ElevenLabs API (direct, using VITE_ELEVENLABS_API_KEY from .env)
//   3. Browser Web Speech Synthesis              ← zero-setup fallback
// ──────────────────────────────────────────────────────────────────────────────

import { audioMap } from './audioMap.js';

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice – friendly teacher voice
const MODEL_ID = 'eleven_multilingual_v2';

let currentPlayId = 0;
let isSpeaking = false;
let currentAudio = null;

// In-flight ElevenLabs fetch cache (avoids duplicate network requests)
const fetchCache = new Map();

// ─── Voice settings per narration style ──────────────────────────────────────
const VOICE_SETTINGS = {
  celebration:  { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement:{ stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:     { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:     { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:     { stability: 0.28, similarity_boost: 0.60, style: 0.30, use_speaker_boost: true },
  instruction:  { stability: 0.22, similarity_boost: 0.58, style: 0.45, use_speaker_boost: true },
  statement:    { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// ─── Web Speech fallback config per style ─────────────────────────────────────
const SPEECH_CONFIG = {
  celebration:  { rate: 0.95, pitch: 1.35, volume: 1.0 },
  encouragement:{ rate: 0.92, pitch: 1.30, volume: 1.0 },
  question:     { rate: 0.82, pitch: 1.25, volume: 0.98 },
  emphasis:     { rate: 0.78, pitch: 1.18, volume: 0.98 },
  thinking:     { rate: 0.85, pitch: 1.05, volume: 0.92 },
  instruction:  { rate: 0.85, pitch: 1.15, volume: 0.95 },
  statement:    { rate: 0.88, pitch: 1.12, volume: 0.95 },
};

// ─── Get audio URL for a text ─────────────────────────────────────────────────
export async function getAudioUrl(text, style = 'statement') {
  if (!text || !text.trim()) return null;

  // 1. Check pre-generated local file first (works offline)
  if (audioMap && audioMap[text]) {
    return audioMap[text];
  }

  // 2. Try ElevenLabs live API
  const cacheKey = `${text}__${style}`;
  if (fetchCache.has(cacheKey)) return fetchCache.get(cacheKey);

  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) return null; // No key → fall through to Web Speech

  const promise = (async () => {
    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: MODEL_ID,
            voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement,
          }),
        }
      );
      if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      fetchCache.delete(cacheKey); // remove failed entry so next call retries
      return null;
    }
  })();

  fetchCache.set(cacheKey, promise);
  return promise;
}

// ─── Speak one segment ────────────────────────────────────────────────────────
export function speak(text, enabled = true, style = 'statement') {
  return new Promise(async (resolve) => {
    if (!enabled || !text?.trim()) { resolve(); return; }

    currentPlayId++;
    const myId = currentPlayId;

    // Stop anything currently playing
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (currentAudio) { 
      currentAudio.pause(); 
      currentAudio.currentTime = 0; 
      currentAudio.src = '';
      currentAudio = null; 
    }

    isSpeaking = true;

    try {
      const url = await getAudioUrl(text, style);

      if (myId !== currentPlayId) { isSpeaking = false; resolve(); return; } // superseded

      if (url) {
        const audio = new Audio(url);
        currentAudio = audio;
        audio.onended = () => { if (myId === currentPlayId) { isSpeaking = false; currentAudio = null; } resolve(); };
        audio.onerror = () => { webSpeechFallback(text, style, resolve, myId); };
        try {
          await audio.play();
        } catch {
          webSpeechFallback(text, style, resolve, myId);
        }
        return;
      }
    } catch { /* fall through */ }

    // 3. Web Speech fallback
    webSpeechFallback(text, style, resolve, myId);
  });
}

function webSpeechFallback(text, style, resolve, playId) {
  if (!window.speechSynthesis) { isSpeaking = false; resolve(); return; }
  
  window.speechSynthesis.cancel();

  const cfg = SPEECH_CONFIG[style] || SPEECH_CONFIG.statement;
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate   = cfg.rate;
  utt.pitch  = cfg.pitch;
  utt.volume = cfg.volume;

  utt.onend  = () => { if (!playId || playId === currentPlayId) { isSpeaking = false; } resolve(); };
  utt.onerror= () => { if (!playId || playId === currentPlayId) { isSpeaking = false; } resolve(); };

  // Short delay ensures Chrome SpeechSynthesis engine purges previous utterance queue
  setTimeout(() => {
    if (!playId || playId === currentPlayId) {
      window.speechSynthesis.speak(utt);
    } else {
      resolve();
    }
  }, 20);
}

// ─── Narration segment helpers ────────────────────────────────────────────────
export const seg       = (text, style = 'statement', pause = 400) => ({ text, style, pause });
export const say       = (text, pause = 0) => seg(text, 'statement', pause);
export const ask       = (text, pause = 0) => seg(text, 'question', pause);
export const cheer     = (text, pause = 0) => seg(text, 'encouragement', pause);
export const emphasize = (text, pause = 0) => seg(text, 'emphasis', pause);
export const think     = (text, pause = 0) => seg(text, 'thinking', pause);
export const celebrate = (text, pause = 0) => seg(text, 'celebration', pause);
export const instruct  = (text, pause = 0) => seg(text, 'instruction', pause);
export const pause     = (ms = 0)          => seg('', 'statement', ms);

// ─── Preload upcoming segments ────────────────────────────────────────────────
export function preloadNarration(segments = []) {
  segments.forEach(s => { if (s.text?.trim()) getAudioUrl(s.text, s.style).catch(() => {}); });
}

// ─── Narrate a sequence of segments ──────────────────────────────────────────
let activeQueueId = null;

export function narrate(segments, enabled = true) {
  const queueId = Symbol('queue');
  activeQueueId = queueId;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (activeQueueId === queueId) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (currentAudio) { 
        currentAudio.pause(); 
        currentAudio.currentTime = 0; 
        currentAudio.src = '';
        currentAudio = null; 
      }
      isSpeaking = false;
      activeQueueId = null;
    }
  };

  const promise = (async () => {
    if (!enabled || !segments?.length) return;

    for (let i = 0; i < segments.length; i++) {
      if (cancelled || activeQueueId !== queueId) return;

      const seg = segments[i];

      // Pre-fetch next segment in background
      if (i + 1 < segments.length && segments[i + 1].text?.trim()) {
        getAudioUrl(segments[i + 1].text, segments[i + 1].style).catch(() => {});
      }

      if (seg.text?.trim()) {
        await speak(seg.text, true, seg.style);
      }

      if (seg.pause > 0 && !cancelled && activeQueueId === queueId) {
        await new Promise(r => setTimeout(r, seg.pause));
      }
    }
  })();

  return { cancel, promise };
}

// ─── Stop everything ──────────────────────────────────────────────────────────
export function stopNarration() {
  currentPlayId++;
  activeQueueId = null;
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (currentAudio) { 
    currentAudio.pause(); 
    currentAudio.currentTime = 0; 
    currentAudio.src = '';
    currentAudio = null; 
  }
  isSpeaking = false;
}

// ─── Sound Effects (Web Audio API) ───────────────────────────────────────────
let audioCtx = null;
function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function tone(freq, dur = 180) {
  try {
    const c = ctx();
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.18, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur / 1000);
    osc.connect(gain); gain.connect(c.destination);
    osc.start(); osc.stop(c.currentTime + dur / 1000);
  } catch { /* silent fail */ }
}

export const sounds = {
  correct: () => { tone(523, 100); setTimeout(() => tone(659, 100), 100); setTimeout(() => tone(784, 160), 200); },
  wrong:   () => { tone(220, 260); },
  badge:   () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 140), i * 110)); },
  click:   () => tone(440, 55),
  streak:  () => { tone(880, 80); setTimeout(() => tone(1100, 120), 80); },
  ching:   () => { tone(987, 70); setTimeout(() => tone(1318, 110), 60); },
};
