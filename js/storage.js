// storage.js — localStorage wrapper with export/import and a pluggable backend for testing.

const KEY = "gym-spanish-v1";

// Injectable storage — defaults to localStorage in the browser, overridable in tests.
let backend = typeof localStorage !== "undefined" ? localStorage : null;

export function setBackend(b) {
  backend = b;
}

const DEFAULT_STATE = () => ({
  version: 1,
  srs: {},              // cardId -> { box, wrongTotal, correctTotal, lastSeen, lastWrongAt }
  daysCompleted: {},    // dayId -> ISO timestamp
  settings: {
    voiceURI: null,     // user's chosen TTS voice
    rate: 0.9,          // playback rate
  },
  history: [],          // {cardId, result: "correct"|"wrong", at: iso}
});

export function load() {
  if (!backend) return DEFAULT_STATE();
  const raw = backend.getItem(KEY);
  if (!raw) return DEFAULT_STATE();
  try {
    const parsed = JSON.parse(raw);
    // merge with defaults to survive schema evolution
    return { ...DEFAULT_STATE(), ...parsed, settings: { ...DEFAULT_STATE().settings, ...(parsed.settings || {}) } };
  } catch (e) {
    console.warn("Corrupt state — starting fresh", e);
    return DEFAULT_STATE();
  }
}

export function save(state) {
  if (!backend) return;
  backend.setItem(KEY, JSON.stringify(state));
}

export function reset() {
  if (!backend) return;
  backend.removeItem(KEY);
}

/** Export current state as a downloadable JSON blob (returns the JSON string). */
export function exportState() {
  return JSON.stringify(load(), null, 2);
}

/** Import state from a JSON string. Returns true on success. */
export function importState(json) {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed !== "object" || parsed === null) return false;
    // minimal shape check
    if (!parsed.srs || typeof parsed.srs !== "object") return false;
    save({ ...DEFAULT_STATE(), ...parsed });
    return true;
  } catch (e) {
    return false;
  }
}
