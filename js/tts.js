// tts.js — browser Web Speech API wrapper for Mexican Spanish pronunciation.

let cachedVoices = null;

/** Load available voices (may be async on first call). */
export function getVoices() {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const v = window.speechSynthesis.getVoices();
    if (v && v.length) {
      cachedVoices = v;
      resolve(v);
      return;
    }
    // Chrome loads voices async — wait for the event
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      () => {
        cachedVoices = window.speechSynthesis.getVoices();
        resolve(cachedVoices);
      },
      { once: true }
    );
    // Fallback timeout — some browsers never fire voiceschanged
    setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices || []);
    }, 1000);
  });
}

/** Prefer es-MX, then es-US, then any es-*, then any. */
export function pickDefaultVoice(voices) {
  const esVoices = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("es"));
  const mx = esVoices.find((v) => (v.lang || "").toLowerCase() === "es-mx");
  if (mx) return mx;
  const us = esVoices.find((v) => (v.lang || "").toLowerCase() === "es-us");
  if (us) return us;
  if (esVoices.length) return esVoices[0];
  return voices[0] || null;
}

/**
 * Speak a single phrase.
 * options: { voiceURI, rate, pitch, onend, onerror }
 * Returns a promise that resolves when speech ends.
 */
export function speak(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("Web Speech API not supported"));
      return;
    }
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = options.rate ?? 0.9;
    u.pitch = options.pitch ?? 1;
    u.lang = "es-MX";

    if (options.voiceURI) {
      const voices = cachedVoices || synth.getVoices();
      const match = voices.find((v) => v.voiceURI === options.voiceURI);
      if (match) u.voice = match;
    }

    u.onend = () => resolve();
    u.onerror = (e) => reject(e.error || new Error("speech error"));
    synth.speak(u);
  });
}

/** Cancel any in-flight or queued speech. */
export function cancel() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

/** Speak a sequence of phrases with a gap between each. Returns promise. */
export async function speakSequence(lines, options = {}) {
  const gap = options.gap ?? 400; // ms between lines
  for (const line of lines) {
    if (options.cancelled && options.cancelled()) break;
    await speak(line, options);
    if (gap) await new Promise((r) => setTimeout(r, gap));
  }
}
