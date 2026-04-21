// srs.js — Leitner-style spaced repetition with a "weak spots" view.
// Boxes: 0=new, 1=seen, 2=learning, 3=known, 4=mastered
// "wrong" demotes to box 0. "correct" promotes one box (max 4).
// "Weak spots" = cards you've gotten wrong at least once AND are currently in box 0–2.

export const MAX_BOX = 4;
export const MIN_BOX = 0;

/** Initialize a fresh SRS entry. */
export function newEntry() {
  return {
    box: 0,
    wrongTotal: 0,
    correctTotal: 0,
    lastSeen: null,
    lastWrongAt: null,
  };
}

/** Get the SRS entry for a card (creating it if absent). Pure — returns a fresh object. */
export function getEntry(state, cardId) {
  return { ...newEntry(), ...(state.srs[cardId] || {}) };
}

/**
 * Record a grade for a card. Mutates & returns a new state object.
 * grade: "correct" | "wrong"
 */
export function grade(state, cardId, gradeValue, now = new Date().toISOString()) {
  const existing = getEntry(state, cardId);
  const updated = { ...existing, lastSeen: now };

  if (gradeValue === "correct") {
    updated.correctTotal += 1;
    updated.box = Math.min(MAX_BOX, updated.box + 1);
  } else if (gradeValue === "wrong") {
    updated.wrongTotal += 1;
    updated.lastWrongAt = now;
    updated.box = MIN_BOX;
  } else {
    throw new Error(`Unknown grade: ${gradeValue}`);
  }

  const nextState = {
    ...state,
    srs: { ...state.srs, [cardId]: updated },
    history: [...(state.history || []), { cardId, result: gradeValue, at: now }],
  };
  return nextState;
}

/**
 * Build a review queue from a set of cards, ordered:
 *   1. Cards never seen (box-0 new cards, in original order)
 *   2. Cards last answered wrong (most recent first)
 *   3. Cards in lower boxes (seen, learning, known, mastered)
 *
 * This makes the deck always surface the weakest material first.
 */
export function buildQueue(state, cards) {
  const withMeta = cards.map((c) => ({ card: c, entry: getEntry(state, c.id) }));

  const neverSeen = withMeta.filter((x) => x.entry.lastSeen === null);
  const seen = withMeta.filter((x) => x.entry.lastSeen !== null);

  // Sort seen: lowest box first, then most-recently-wrong first
  seen.sort((a, b) => {
    if (a.entry.box !== b.entry.box) return a.entry.box - b.entry.box;
    const aw = a.entry.lastWrongAt || "";
    const bw = b.entry.lastWrongAt || "";
    return bw.localeCompare(aw);
  });

  return [...neverSeen, ...seen].map((x) => x.card);
}

/**
 * Weak-spots filter: cards that have been wrong at least once
 * AND are currently in box 0, 1, or 2. These are what the "Drill mistakes" mode trains on.
 */
export function weakSpots(state, cards) {
  return cards.filter((c) => {
    const e = getEntry(state, c.id);
    return e.wrongTotal > 0 && e.box <= 2;
  });
}

/** Aggregate stats across a set of cards. */
export function stats(state, cards) {
  const buckets = [0, 0, 0, 0, 0]; // count per box
  let seen = 0;
  let wrongTotal = 0;
  let correctTotal = 0;
  for (const c of cards) {
    const e = getEntry(state, c.id);
    buckets[e.box] += 1;
    if (e.lastSeen) seen += 1;
    wrongTotal += e.wrongTotal;
    correctTotal += e.correctTotal;
  }
  return {
    total: cards.length,
    seen,
    buckets,
    wrongTotal,
    correctTotal,
    mastered: buckets[MAX_BOX],
  };
}

/** Mark a day as completed (date ISO). Returns new state. */
export function completeDay(state, dayId, now = new Date().toISOString()) {
  return {
    ...state,
    daysCompleted: { ...state.daysCompleted, [dayId]: now },
  };
}

export function isDayComplete(state, dayId) {
  return !!state.daysCompleted?.[dayId];
}
