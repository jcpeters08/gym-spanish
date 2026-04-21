// test.js — minimal Node test harness for the Gym Spanish app
// Run with:  node tests/test.js
//
// No external deps — just node:assert. Covers:
//   - srs.js logic (grading, queue ordering, weak spots, stats, day completion)
//   - storage.js round-trip with an injected in-memory backend
//   - data.js shape integrity (unique ids, required fields, tag resolution)

import assert from "node:assert/strict";

import {
  MAX_BOX,
  MIN_BOX,
  newEntry,
  getEntry,
  grade,
  buildQueue,
  weakSpots,
  stats,
  completeDay,
  isDayComplete,
} from "../js/srs.js";

import {
  setBackend,
  load,
  save,
  reset,
  exportState,
  importState,
} from "../js/storage.js";

import {
  CARDS,
  DAYS,
  DRILLS,
  CHEAT_SHEET,
  ERROR_TRAPS,
  cardsByTags,
  cardsByDayUpTo,
  cardById,
  allTags,
} from "../js/data.js";

// ---------------------------------------------------------------------------
// Tiny harness
// ---------------------------------------------------------------------------

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

function freshState() {
  return {
    version: 1,
    srs: {},
    daysCompleted: {},
    settings: { voiceURI: null, rate: 0.9 },
    history: [],
  };
}

// In-memory Map-like backend for storage tests
function memoryBackend() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    _dump: () => Object.fromEntries(m),
  };
}

// ---------------------------------------------------------------------------
// SRS tests
// ---------------------------------------------------------------------------

test("srs: newEntry has expected defaults", () => {
  const e = newEntry();
  assert.equal(e.box, 0);
  assert.equal(e.wrongTotal, 0);
  assert.equal(e.correctTotal, 0);
  assert.equal(e.lastSeen, null);
  assert.equal(e.lastWrongAt, null);
});

test("srs: getEntry returns defaults for unknown card", () => {
  const s = freshState();
  const e = getEntry(s, "ghost");
  assert.equal(e.box, 0);
  assert.equal(e.lastSeen, null);
});

test("srs: grade(correct) promotes by one box and increments correctTotal", () => {
  let s = freshState();
  s = grade(s, "b01", "correct", "2026-04-21T10:00:00Z");
  assert.equal(s.srs.b01.box, 1);
  assert.equal(s.srs.b01.correctTotal, 1);
  assert.equal(s.srs.b01.lastSeen, "2026-04-21T10:00:00Z");
  assert.equal(s.srs.b01.wrongTotal, 0);
});

test("srs: grade(correct) caps at MAX_BOX", () => {
  let s = freshState();
  for (let i = 0; i < MAX_BOX + 3; i++) {
    s = grade(s, "b01", "correct", `2026-04-21T10:0${i}:00Z`);
  }
  assert.equal(s.srs.b01.box, MAX_BOX);
  assert.equal(s.srs.b01.correctTotal, MAX_BOX + 3);
});

test("srs: grade(wrong) drops to MIN_BOX and bumps wrongTotal", () => {
  let s = freshState();
  s = grade(s, "b01", "correct", "2026-04-21T10:00:00Z");
  s = grade(s, "b01", "correct", "2026-04-21T10:01:00Z");
  assert.equal(s.srs.b01.box, 2);
  s = grade(s, "b01", "wrong", "2026-04-21T10:02:00Z");
  assert.equal(s.srs.b01.box, MIN_BOX);
  assert.equal(s.srs.b01.wrongTotal, 1);
  assert.equal(s.srs.b01.lastWrongAt, "2026-04-21T10:02:00Z");
});

test("srs: grade() appends to history", () => {
  let s = freshState();
  s = grade(s, "b01", "correct", "2026-04-21T10:00:00Z");
  s = grade(s, "b02", "wrong", "2026-04-21T10:01:00Z");
  assert.equal(s.history.length, 2);
  assert.deepEqual(s.history[0], { cardId: "b01", result: "correct", at: "2026-04-21T10:00:00Z" });
  assert.deepEqual(s.history[1], { cardId: "b02", result: "wrong", at: "2026-04-21T10:01:00Z" });
});

test("srs: grade() throws on unknown grade value", () => {
  const s = freshState();
  assert.throws(() => grade(s, "b01", "maybe"), /Unknown grade/);
});

test("srs: grade() is immutable — does not mutate input state", () => {
  const s = freshState();
  const before = JSON.stringify(s);
  grade(s, "b01", "correct", "2026-04-21T10:00:00Z");
  assert.equal(JSON.stringify(s), before);
});

test("srs: buildQueue puts never-seen cards first", () => {
  const cards = [
    { id: "a", es: "a" },
    { id: "b", es: "b" },
    { id: "c", es: "c" },
  ];
  let s = freshState();
  s = grade(s, "a", "correct", "2026-04-21T10:00:00Z");
  const q = buildQueue(s, cards);
  // "a" is seen, "b" and "c" never seen — they should come first
  assert.equal(q[0].id, "b");
  assert.equal(q[1].id, "c");
  assert.equal(q[2].id, "a");
});

test("srs: buildQueue sorts seen cards by box ASC", () => {
  const cards = [
    { id: "low", es: "low" },
    { id: "mid", es: "mid" },
    { id: "high", es: "high" },
  ];
  let s = freshState();
  // low → box 1, mid → box 2, high → box 3
  s = grade(s, "low", "correct", "2026-04-21T10:00:00Z");
  s = grade(s, "mid", "correct", "2026-04-21T10:01:00Z");
  s = grade(s, "mid", "correct", "2026-04-21T10:02:00Z");
  s = grade(s, "high", "correct", "2026-04-21T10:03:00Z");
  s = grade(s, "high", "correct", "2026-04-21T10:04:00Z");
  s = grade(s, "high", "correct", "2026-04-21T10:05:00Z");
  const q = buildQueue(s, cards);
  assert.equal(q[0].id, "low");
  assert.equal(q[1].id, "mid");
  assert.equal(q[2].id, "high");
});

test("srs: buildQueue tie-breaks same-box by lastWrongAt DESC", () => {
  const cards = [
    { id: "older", es: "older" },
    { id: "newer", es: "newer" },
  ];
  let s = freshState();
  // both end up in box 0, but "newer" was wrong more recently
  s = grade(s, "older", "wrong", "2026-04-21T10:00:00Z");
  s = grade(s, "newer", "wrong", "2026-04-21T11:00:00Z");
  const q = buildQueue(s, cards);
  assert.equal(q[0].id, "newer");
  assert.equal(q[1].id, "older");
});

test("srs: weakSpots includes wrong cards in boxes 0-2", () => {
  const cards = [
    { id: "a", es: "a" },
    { id: "b", es: "b" },
    { id: "c", es: "c" },
    { id: "d", es: "d" },
  ];
  let s = freshState();
  // a: never wrong → excluded
  s = grade(s, "a", "correct", "2026-04-21T10:00:00Z");
  // b: wrong, box 0 → included
  s = grade(s, "b", "wrong", "2026-04-21T10:00:00Z");
  // c: wrong once, then promoted to box 2 → included (box <= 2)
  s = grade(s, "c", "wrong", "2026-04-21T10:00:00Z");
  s = grade(s, "c", "correct", "2026-04-21T10:01:00Z");
  s = grade(s, "c", "correct", "2026-04-21T10:02:00Z");
  // d: wrong, then promoted to box 3 → excluded
  s = grade(s, "d", "wrong", "2026-04-21T10:00:00Z");
  s = grade(s, "d", "correct", "2026-04-21T10:01:00Z");
  s = grade(s, "d", "correct", "2026-04-21T10:02:00Z");
  s = grade(s, "d", "correct", "2026-04-21T10:03:00Z");

  const w = weakSpots(s, cards).map((c) => c.id).sort();
  assert.deepEqual(w, ["b", "c"]);
});

test("srs: stats aggregates box buckets and totals", () => {
  const cards = [
    { id: "a", es: "a" },
    { id: "b", es: "b" },
    { id: "c", es: "c" },
  ];
  let s = freshState();
  s = grade(s, "a", "correct", "2026-04-21T10:00:00Z"); // box 1
  s = grade(s, "b", "wrong", "2026-04-21T10:00:00Z");   // box 0
  // c: never seen
  const st = stats(s, cards);
  assert.equal(st.total, 3);
  assert.equal(st.seen, 2);
  assert.equal(st.buckets[0], 2); // b and c both in box 0
  assert.equal(st.buckets[1], 1); // a
  assert.equal(st.correctTotal, 1);
  assert.equal(st.wrongTotal, 1);
  assert.equal(st.mastered, 0);
});

test("srs: completeDay and isDayComplete", () => {
  let s = freshState();
  assert.equal(isDayComplete(s, 1), false);
  s = completeDay(s, 1, "2026-04-21T11:00:00Z");
  assert.equal(isDayComplete(s, 1), true);
  assert.equal(s.daysCompleted[1], "2026-04-21T11:00:00Z");
});

// ---------------------------------------------------------------------------
// Storage tests (using injected in-memory backend)
// ---------------------------------------------------------------------------

test("storage: load() returns defaults when backend is empty", () => {
  setBackend(memoryBackend());
  const s = load();
  assert.equal(s.version, 1);
  assert.deepEqual(s.srs, {});
  assert.deepEqual(s.daysCompleted, {});
  assert.equal(s.settings.rate, 0.9);
});

test("storage: save() + load() round-trip", () => {
  setBackend(memoryBackend());
  const s = {
    version: 1,
    srs: { b01: { box: 2, wrongTotal: 1, correctTotal: 3, lastSeen: "t", lastWrongAt: "t0" } },
    daysCompleted: { 1: "t" },
    settings: { voiceURI: "es-MX-voice", rate: 1 },
    history: [{ cardId: "b01", result: "correct", at: "t" }],
  };
  save(s);
  const back = load();
  assert.deepEqual(back, s);
});

test("storage: load() merges partial saved state with defaults", () => {
  const b = memoryBackend();
  setBackend(b);
  // write a state that's missing settings.rate and history
  b.setItem("gym-spanish-v1", JSON.stringify({ version: 1, srs: { a: { box: 1 } } }));
  const s = load();
  assert.equal(s.settings.rate, 0.9); // default preserved
  assert.deepEqual(s.srs, { a: { box: 1 } });
  assert.deepEqual(s.history, []);
});

test("storage: load() falls back to defaults on corrupt JSON", () => {
  const b = memoryBackend();
  setBackend(b);
  b.setItem("gym-spanish-v1", "not-valid-json{{{");
  const s = load();
  assert.equal(s.version, 1);
  assert.deepEqual(s.srs, {});
});

test("storage: reset() clears saved data", () => {
  setBackend(memoryBackend());
  save({ ...freshState(), srs: { a: { box: 3 } } });
  reset();
  const s = load();
  assert.deepEqual(s.srs, {});
});

test("storage: exportState returns JSON string matching load()", () => {
  setBackend(memoryBackend());
  save({ ...freshState(), srs: { a: { box: 1 } } });
  const json = exportState();
  const parsed = JSON.parse(json);
  assert.deepEqual(parsed.srs, { a: { box: 1 } });
});

test("storage: importState accepts valid JSON", () => {
  setBackend(memoryBackend());
  const json = JSON.stringify({ version: 1, srs: { b: { box: 2 } }, daysCompleted: {}, settings: {}, history: [] });
  const ok = importState(json);
  assert.equal(ok, true);
  assert.deepEqual(load().srs, { b: { box: 2 } });
});

test("storage: importState rejects invalid JSON", () => {
  setBackend(memoryBackend());
  assert.equal(importState("garbage"), false);
  assert.equal(importState("null"), false);
  assert.equal(importState('{"no_srs": true}'), false); // missing required srs
});

test("storage: importState rejects non-object top-level JSON", () => {
  setBackend(memoryBackend());
  assert.equal(importState("[]"), false);
  // parses to array; arrays are typeof "object" but srs is missing → rejected at shape check
  assert.equal(importState('"just-a-string"'), false);
});

// ---------------------------------------------------------------------------
// Data integrity tests
// ---------------------------------------------------------------------------

test("data: CARDS have unique IDs", () => {
  const ids = CARDS.map((c) => c.id);
  const set = new Set(ids);
  if (set.size !== ids.length) {
    // Find the dupes for a useful error
    const seen = new Set();
    const dupes = [];
    for (const id of ids) {
      if (seen.has(id)) dupes.push(id);
      seen.add(id);
    }
    assert.fail(`Duplicate card IDs: ${dupes.join(", ")}`);
  }
});

test("data: CARDS have required fields", () => {
  for (const c of CARDS) {
    assert.ok(typeof c.id === "string" && c.id.length, `card missing id: ${JSON.stringify(c)}`);
    assert.ok(typeof c.es === "string" && c.es.length, `card ${c.id} missing es`);
    assert.ok(typeof c.en === "string" && c.en.length, `card ${c.id} missing en`);
    assert.ok(Array.isArray(c.tags) && c.tags.length, `card ${c.id} missing tags`);
    assert.ok(Number.isInteger(c.day) && c.day >= 1 && c.day <= 7, `card ${c.id} has invalid day: ${c.day}`);
  }
});

test("data: every DAY has required fields", () => {
  for (const d of DAYS) {
    assert.ok(Number.isInteger(d.id), `day missing id`);
    assert.ok(typeof d.title === "string" && d.title.length);
    assert.ok(typeof d.goal === "string" && d.goal.length);
    assert.ok(Array.isArray(d.cardTags));
    assert.ok(Array.isArray(d.application));
  }
});

test("data: every non-Day-7 day's cardTags resolve to >=1 card", () => {
  for (const d of DAYS) {
    if (d.cardTags.length === 0) continue; // Day 7 is integration-only by design
    const matched = cardsByTags(d.cardTags);
    assert.ok(matched.length > 0, `Day ${d.id} cardTags ${JSON.stringify(d.cardTags)} match 0 cards`);
  }
});

test("data: every DRILL has a non-empty lines array", () => {
  for (const d of DRILLS) {
    assert.ok(Number.isInteger(d.id));
    assert.ok(typeof d.title === "string" && d.title.length);
    assert.ok(Array.isArray(d.lines) && d.lines.length > 0, `Drill ${d.id} has no lines`);
    for (const line of d.lines) {
      assert.ok(typeof line === "string" && line.length, `Drill ${d.id} has an empty line`);
    }
  }
});

test("data: CHEAT_SHEET sections are well-formed", () => {
  assert.ok(CHEAT_SHEET.length > 0);
  for (const section of CHEAT_SHEET) {
    assert.ok(typeof section.title === "string" && section.title.length);
    assert.ok(Array.isArray(section.entries) && section.entries.length > 0);
    for (const entry of section.entries) {
      assert.ok(typeof entry.es === "string" && entry.es.length, `${section.title}: missing es`);
      assert.ok(typeof entry.en === "string" && entry.en.length, `${section.title}: missing en`);
    }
  }
});

test("data: ERROR_TRAPS well-formed", () => {
  assert.ok(ERROR_TRAPS.length > 0);
  for (const t of ERROR_TRAPS) {
    assert.ok(typeof t.title === "string");
    assert.ok(typeof t.rule === "string");
    assert.ok(Array.isArray(t.examples) && t.examples.length > 0);
    for (const ex of t.examples) {
      assert.ok(typeof ex.wrong === "string");
      assert.ok(typeof ex.right === "string");
    }
  }
});

test("data: cardsByDayUpTo(N) monotonically grows", () => {
  let prev = 0;
  for (let d = 1; d <= 7; d++) {
    const n = cardsByDayUpTo(d).length;
    assert.ok(n >= prev, `Day ${d} count ${n} < prev ${prev}`);
    prev = n;
  }
  // Final count should equal total cards
  assert.equal(cardsByDayUpTo(7).length, CARDS.length);
});

test("data: cardById finds cards, returns undefined for missing", () => {
  assert.ok(cardById("b01"));
  assert.equal(cardById("this-does-not-exist"), undefined);
});

test("data: allTags returns sorted unique strings", () => {
  const tags = allTags();
  assert.ok(tags.length > 0);
  const sorted = [...tags].sort();
  assert.deepEqual(tags, sorted);
  assert.equal(new Set(tags).size, tags.length);
});

test("data: cardsByTags with empty array returns []", () => {
  assert.deepEqual(cardsByTags([]), []);
  assert.deepEqual(cardsByTags(null), []);
});

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

let pass = 0;
let fail = 0;
const failures = [];

for (const t of tests) {
  try {
    await t.fn();
    pass++;
    process.stdout.write(".");
  } catch (e) {
    fail++;
    failures.push({ name: t.name, error: e });
    process.stdout.write("F");
  }
}

process.stdout.write("\n\n");

if (failures.length) {
  for (const f of failures) {
    console.error(`✗ ${f.name}`);
    console.error(`  ${f.error.message}`);
    if (f.error.stack) {
      const lines = f.error.stack.split("\n").slice(1, 4);
      for (const line of lines) console.error(`  ${line.trim()}`);
    }
    console.error();
  }
}

console.log(`${pass}/${tests.length} passing${fail ? ` · ${fail} failing` : ""}`);

if (fail) process.exit(1);
