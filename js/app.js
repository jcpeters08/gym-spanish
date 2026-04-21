// app.js — router, view rendering, glue for the whole app.

import {
  META, CARDS, DAYS, CHEAT_SHEET, ERROR_TRAPS, DRILLS,
  cardsByTags, cardsByDayUpTo, cardById, allTags,
} from "./data.js";
import { load, save, reset, exportState, importState } from "./storage.js";
import {
  newEntry, getEntry, grade, buildQueue, weakSpots, stats,
  completeDay, isDayComplete, MAX_BOX,
} from "./srs.js";
import { getVoices, pickDefaultVoice, speak, cancel as cancelSpeech, speakSequence } from "./tts.js";

// ---------------------------------------------------------------------------
// State + voice bootstrap
// ---------------------------------------------------------------------------

let STATE = load();
let VOICES = [];
let DEFAULT_VOICE = null;

getVoices().then((v) => {
  VOICES = v;
  DEFAULT_VOICE = pickDefaultVoice(v);
  if (!STATE.settings.voiceURI && DEFAULT_VOICE) {
    STATE.settings.voiceURI = DEFAULT_VOICE.voiceURI;
    save(STATE);
  }
  // Re-render if on settings page (voice list may not have been ready)
  if (location.hash.startsWith("#/settings")) route();
});

function persist() {
  save(STATE);
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const el = (html) => {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
};

/** Build a clickable phrase chip with TTS. */
function phrase(text) {
  const esc = String(text).replace(/"/g, "&quot;");
  return `<span class="phrase" data-phrase="${esc}">${text}</span>`;
}

/** Scroll to top on route change. */
function scrollTop() { window.scrollTo({ top: 0, behavior: "instant" }); }

/** Set the active nav link based on current hash. */
function setActiveNav(key) {
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const active = a.dataset.nav === key;
    a.classList.toggle("bg-emerald-600", active);
    a.classList.toggle("text-white", active);
  });
}

// ---------------------------------------------------------------------------
// Delegated event handlers
// ---------------------------------------------------------------------------

let currentPlayToken = 0;

document.addEventListener("click", async (e) => {
  const ph = e.target.closest("[data-phrase]");
  if (ph) {
    e.preventDefault();
    const text = ph.dataset.phrase;
    // Cancel any in-flight speech, then play
    cancelSpeech();
    const token = ++currentPlayToken;
    document.querySelectorAll(".phrase.playing").forEach((n) => n.classList.remove("playing"));
    ph.classList.add("playing");
    try {
      await speak(text, { voiceURI: STATE.settings.voiceURI, rate: STATE.settings.rate });
    } catch (err) {
      console.warn("TTS error:", err);
    } finally {
      if (token === currentPlayToken) ph.classList.remove("playing");
    }
    return;
  }
});

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

function route() {
  cancelSpeech();
  const hash = location.hash || "#/";
  const path = hash.slice(1); // after "#"
  const app = document.getElementById("app");

  if (path === "/" || path === "") {
    setActiveNav("home");
    app.replaceChildren(renderHome());
  } else if (path === "/days") {
    setActiveNav("days");
    app.replaceChildren(renderDaysIndex());
  } else if (path.startsWith("/day/")) {
    setActiveNav("days");
    const id = parseInt(path.split("/")[2], 10);
    app.replaceChildren(renderDay(id));
  } else if (path === "/cards") {
    setActiveNav("cards");
    app.replaceChildren(renderFlashcardsIndex());
  } else if (path.startsWith("/cards/")) {
    setActiveNav("cards");
    const slug = path.split("/")[2];
    app.replaceChildren(renderFlashcardSession(slug));
  } else if (path === "/weak") {
    setActiveNav("weak");
    app.replaceChildren(renderFlashcardSession("__weak__"));
  } else if (path === "/cheat") {
    setActiveNav("cheat");
    app.replaceChildren(renderCheatSheet());
  } else if (path === "/drills") {
    setActiveNav("drills");
    app.replaceChildren(renderDrills());
  } else if (path === "/settings") {
    setActiveNav("settings");
    app.replaceChildren(renderSettings());
  } else {
    app.replaceChildren(el(`<div class="p-8">Unknown route.</div>`));
  }
  scrollTop();
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

function renderHome() {
  const s = stats(STATE, CARDS);
  const daysDone = Object.keys(STATE.daysCompleted || {}).length;
  const progressPct = Math.round((s.seen / s.total) * 100);

  const dayPills = DAYS.map((d) => {
    const done = isDayComplete(STATE, d.id);
    return `
      <a href="#/day/${d.id}" class="block p-4 rounded-lg border transition
        ${done ? "border-emerald-600 bg-emerald-900/20 hover:bg-emerald-900/30"
               : "border-slate-800 hover:border-slate-600 hover:bg-slate-900"}">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-400">Day ${d.id}</div>
          <div class="text-lg">${done ? "✅" : "○"}</div>
        </div>
        <div class="font-semibold mt-1">${d.title}</div>
        <div class="text-sm text-slate-400 mt-1">${d.goal}</div>
      </a>
    `;
  }).join("");

  const wk = weakSpots(STATE, CARDS).length;
  const weakBlock = wk > 0
    ? `<a href="#/weak" class="inline-flex items-center gap-2 px-4 py-2 rounded bg-red-900/40 border border-red-700 hover:bg-red-900/60">
         <span>🎯</span><span>Drill ${wk} weak spot${wk === 1 ? "" : "s"}</span>
       </a>`
    : `<span class="inline-flex items-center gap-2 px-4 py-2 rounded bg-slate-900 border border-slate-800 text-slate-500">
         No weak spots yet — start reviewing
       </span>`;

  return el(`
    <section>
      <div class="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold">7-Day Gym Spanish Crash Course</h1>
          <p class="text-slate-400 mt-1">Mexican Spanish · 30 min/day · tap any phrase to hear it.</p>
        </div>
        <div class="flex gap-2">
          <a href="#/cards" class="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">Start reviewing</a>
          <a href="#/cheat" class="px-4 py-2 rounded border border-slate-700 hover:bg-slate-900">Cheat sheet</a>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4 mb-8">
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
          <div class="text-slate-400 text-sm">Days complete</div>
          <div class="text-2xl font-bold mt-1">${daysDone} / ${DAYS.length}</div>
        </div>
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
          <div class="text-slate-400 text-sm">Cards reviewed</div>
          <div class="text-2xl font-bold mt-1">${s.seen} / ${s.total}</div>
          <div class="text-xs text-slate-500 mt-1">${progressPct}% of the deck</div>
        </div>
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
          <div class="text-slate-400 text-sm">Mastered</div>
          <div class="text-2xl font-bold mt-1">${s.mastered} <span class="text-slate-500 text-sm font-normal">(box ${MAX_BOX})</span></div>
        </div>
      </div>

      <div class="mb-6">${weakBlock}</div>

      <h2 class="text-xl font-semibold mb-3">Your 7 days</h2>
      <div class="grid md:grid-cols-2 gap-3">${dayPills}</div>

      <details class="mt-8 p-4 rounded-lg border border-slate-800">
        <summary class="cursor-pointer font-semibold">Jonathan's 4 error traps (your diagnostic)</summary>
        <div class="mt-3 space-y-4">
          ${ERROR_TRAPS.map(t => `
            <div>
              <div class="font-semibold text-emerald-400">${t.title}</div>
              <div class="text-sm text-slate-300">${t.rule}</div>
              <div class="mt-2 space-y-1 text-sm">
                ${t.examples.map(ex => `
                  <div class="flex gap-2">
                    <span class="text-red-400 line-through">${ex.wrong}</span>
                    <span class="text-slate-500">→</span>
                    <span class="text-emerald-300">${phrase(ex.right)}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </details>
    </section>
  `);
}

function renderDaysIndex() {
  return el(`
    <section>
      <h1 class="text-2xl font-bold mb-4">7 Days</h1>
      <p class="text-slate-400 mb-6">Each day is 30 min: 5 warm-up · 15 new material · 10 application.</p>
      <div class="space-y-3">
        ${DAYS.map(d => {
          const done = isDayComplete(STATE, d.id);
          return `
            <a href="#/day/${d.id}" class="block p-4 rounded-lg border transition
              ${done ? "border-emerald-600 bg-emerald-900/20" : "border-slate-800 hover:border-slate-600"}">
              <div class="flex items-center justify-between">
                <div class="text-sm text-slate-400">Day ${d.id} ${done ? "· ✅" : ""}</div>
                <div class="text-xs text-slate-500">${cardsByTags(d.cardTags).length} cards</div>
              </div>
              <div class="text-lg font-semibold mt-1">${d.title}</div>
              <div class="text-sm text-slate-400 mt-1">${d.goal}</div>
            </a>
          `;
        }).join("")}
      </div>
    </section>
  `);
}

function renderDay(id) {
  const day = DAYS.find((d) => d.id === id);
  if (!day) return el(`<div>Day not found.</div>`);

  const cards = cardsByTags(day.cardTags);
  const done = isDayComplete(STATE, day.id);

  const vocabRows = cards.map(c => `
    <tr class="border-b border-slate-800 last:border-0">
      <td class="py-2 pr-3">${phrase(c.es)}</td>
      <td class="py-2 text-slate-400">${c.en}</td>
      ${c.notes ? `<td class="py-2 text-xs text-amber-400">${c.notes}</td>` : `<td></td>`}
    </tr>
  `).join("");

  const node = el(`
    <section>
      <div class="mb-6">
        <a href="#/days" class="text-sm text-slate-400 hover:text-slate-200">← All days</a>
        <h1 class="text-2xl font-bold mt-1">Day ${day.id} — ${day.title}</h1>
        <p class="text-slate-400 mt-1">${day.goal}</p>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
          <div class="text-xs text-slate-500 uppercase tracking-wide">Warm-up · 5 min</div>
          <div class="mt-2 text-sm">${day.warmup}</div>
        </div>
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
          <div class="text-xs text-slate-500 uppercase tracking-wide">New material · 15 min</div>
          <div class="mt-2 text-sm text-slate-300">${cards.length} phrases below — tap to hear each.</div>
        </div>
        <div class="p-4 rounded-lg border border-slate-800 bg-slate-900/50">
          <div class="text-xs text-slate-500 uppercase tracking-wide">Application · 10 min</div>
          <div class="mt-2 text-sm text-slate-300">See the application block below.</div>
        </div>
      </div>

      <h2 class="text-xl font-semibold mt-8 mb-3">Core vocab</h2>
      ${cards.length ? `
        <div class="flex gap-2 mb-3">
          <a href="#/cards/day-${day.id}" class="px-3 py-1.5 text-sm rounded bg-emerald-600 hover:bg-emerald-500 text-white">Drill these ${cards.length} cards</a>
        </div>
        <table class="w-full text-left text-sm">
          <thead class="text-slate-500">
            <tr><th class="pb-2 pr-3 font-medium">Spanish</th><th class="pb-2 font-medium">English</th><th></th></tr>
          </thead>
          <tbody>${vocabRows}</tbody>
        </table>
      ` : `<p class="text-slate-400">Day 7 is integration — go to the Drills tab and run Drill 9 (stress test).</p>`}

      <h2 class="text-xl font-semibold mt-8 mb-3">Application</h2>
      <div class="p-4 rounded-lg border border-slate-800 bg-slate-900/30 space-y-2">
        ${day.application.map(line => `<div class="text-sm leading-relaxed">${line}</div>`).join("")}
      </div>

      <div class="mt-8 flex justify-between items-center">
        <a href="#/day/${day.id - 1}" class="text-slate-400 hover:text-slate-200 ${day.id === 1 ? "invisible" : ""}">← Day ${day.id - 1}</a>
        <button id="toggle-done" class="px-4 py-2 rounded font-semibold
          ${done ? "bg-slate-800 hover:bg-slate-700" : "bg-emerald-600 hover:bg-emerald-500 text-white"}">
          ${done ? "Mark incomplete" : "Mark day complete"}
        </button>
        <a href="#/day/${day.id + 1}" class="text-slate-400 hover:text-slate-200 ${day.id === DAYS.length ? "invisible" : ""}">Day ${day.id + 1} →</a>
      </div>
    </section>
  `);

  node.querySelector("#toggle-done").addEventListener("click", () => {
    if (isDayComplete(STATE, day.id)) {
      const copy = { ...STATE.daysCompleted };
      delete copy[day.id];
      STATE = { ...STATE, daysCompleted: copy };
    } else {
      STATE = completeDay(STATE, day.id);
    }
    persist();
    route();
  });

  return node;
}

function renderFlashcardsIndex() {
  const tags = allTags();
  const deckButton = (label, href, count) => `
    <a href="${href}" class="block p-4 rounded-lg border border-slate-800 hover:border-slate-600 hover:bg-slate-900">
      <div class="font-semibold">${label}</div>
      <div class="text-sm text-slate-400 mt-1">${count} card${count === 1 ? "" : "s"}</div>
    </a>
  `;

  const byDay = DAYS.map(d => {
    const c = cardsByTags(d.cardTags).length;
    if (c === 0) return "";
    return deckButton(`Day ${d.id} — ${d.title}`, `#/cards/day-${d.id}`, c);
  }).join("");

  const byTag = tags.filter(t => t !== "error-trap" && t !== "grammar" && t !== "subjunctive" && t !== "fallback").map(t =>
    deckButton(`#${t}`, `#/cards/tag-${t}`, CARDS.filter(c => c.tags.includes(t)).length)
  ).join("");

  return el(`
    <section>
      <h1 class="text-2xl font-bold mb-2">Flashcards</h1>
      <p class="text-slate-400 mb-6">Your progress is saved between sessions. Mark "again" on anything you hesitate on — weak spots come back harder.</p>

      <h2 class="text-lg font-semibold mb-3">Quick decks</h2>
      <div class="grid md:grid-cols-3 gap-3 mb-8">
        ${deckButton("All cards", "#/cards/all", CARDS.length)}
        ${deckButton("Weak spots only", "#/weak", weakSpots(STATE, CARDS).length)}
        ${deckButton("Error-trap drills", "#/cards/tag-error-trap", CARDS.filter(c => c.tags.includes("error-trap")).length)}
      </div>

      <h2 class="text-lg font-semibold mb-3">By day</h2>
      <div class="grid md:grid-cols-2 gap-3 mb-8">${byDay}</div>

      <h2 class="text-lg font-semibold mb-3">By topic</h2>
      <div class="grid md:grid-cols-3 gap-3">${byTag}</div>
    </section>
  `);
}

function renderFlashcardSession(slug) {
  let pool, title;
  if (slug === "__weak__") {
    pool = weakSpots(STATE, CARDS);
    title = "Weak spots — drill your mistakes";
  } else if (slug === "all") {
    pool = [...CARDS];
    title = "All cards";
  } else if (slug.startsWith("day-")) {
    const n = parseInt(slug.slice(4), 10);
    const d = DAYS.find((x) => x.id === n);
    pool = d ? cardsByTags(d.cardTags) : [];
    title = `Day ${n} — ${d?.title || ""}`;
  } else if (slug.startsWith("tag-")) {
    const tag = slug.slice(4);
    pool = CARDS.filter((c) => c.tags.includes(tag));
    title = `#${tag}`;
  } else {
    pool = [];
    title = "(empty)";
  }

  if (pool.length === 0) {
    return el(`
      <section>
        <h1 class="text-2xl font-bold mb-2">${title}</h1>
        <p class="text-slate-400">Nothing to drill here yet. ${slug === "__weak__" ? "Answer a few cards wrong first, then come back." : ""}</p>
        <a href="#/cards" class="inline-block mt-4 px-3 py-1.5 rounded border border-slate-700 hover:bg-slate-900">← Back to decks</a>
      </section>
    `);
  }

  const queue = buildQueue(STATE, pool);
  let idx = 0;
  let flipped = false;
  let sessionStats = { correct: 0, wrong: 0 };

  const wrapper = el(`
    <section>
      <div class="flex items-center justify-between mb-4">
        <div>
          <a href="#/cards" class="text-sm text-slate-400 hover:text-slate-200">← Decks</a>
          <h1 class="text-2xl font-bold mt-1">${title}</h1>
        </div>
        <div class="text-sm text-slate-400 text-right">
          <div><span id="fc-pos">1</span> / ${queue.length}</div>
          <div id="fc-stats" class="text-xs mt-1">✓ 0 · ✗ 0</div>
        </div>
      </div>

      <div id="fc-card" class="min-h-[240px] rounded-xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none">
        <div id="fc-es" class="text-3xl font-semibold"></div>
        <div id="fc-en" class="text-xl text-emerald-300 mt-4 hidden"></div>
        <div id="fc-notes" class="text-xs text-amber-400 mt-3 hidden"></div>
        <div id="fc-box" class="text-xs text-slate-500 mt-4"></div>
        <div id="fc-hint" class="text-xs text-slate-500 mt-4">tap card (or space) to flip · 1/J = again · 2/K = got it · P = replay</div>
      </div>

      <div id="fc-actions" class="mt-4 flex gap-3 justify-center">
        <button id="fc-wrong" class="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold flex-1 md:flex-none">
          <div>Again</div><div class="text-xs opacity-80">(press 1 or J)</div>
        </button>
        <button id="fc-play" class="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold">
          <div>🔊 Play</div><div class="text-xs opacity-80">(press P)</div>
        </button>
        <button id="fc-correct" class="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex-1 md:flex-none">
          <div>Got it</div><div class="text-xs opacity-80">(press 2 or K)</div>
        </button>
      </div>

      <div id="fc-done" class="hidden mt-8 p-6 rounded-xl border border-emerald-700 bg-emerald-900/30 text-center">
        <div class="text-xl font-bold">Deck complete 🎉</div>
        <div class="mt-2 text-slate-300">Session: <span id="fc-final-correct">0</span> correct · <span id="fc-final-wrong">0</span> again.</div>
        <div class="mt-4 flex gap-3 justify-center">
          <a href="#/cards" class="px-4 py-2 rounded border border-slate-700 hover:bg-slate-900">Pick another deck</a>
          <a href="#/weak" class="px-4 py-2 rounded bg-red-900/40 border border-red-700 hover:bg-red-900/60">Drill weak spots</a>
        </div>
      </div>
    </section>
  `);

  const esNode = wrapper.querySelector("#fc-es");
  const enNode = wrapper.querySelector("#fc-en");
  const notesNode = wrapper.querySelector("#fc-notes");
  const boxNode = wrapper.querySelector("#fc-box");
  const hintNode = wrapper.querySelector("#fc-hint");
  const posNode = wrapper.querySelector("#fc-pos");
  const statsNode = wrapper.querySelector("#fc-stats");
  const cardNode = wrapper.querySelector("#fc-card");
  const actionsNode = wrapper.querySelector("#fc-actions");
  const doneNode = wrapper.querySelector("#fc-done");

  function renderCard() {
    if (idx >= queue.length) {
      wrapper.querySelector("#fc-final-correct").textContent = sessionStats.correct;
      wrapper.querySelector("#fc-final-wrong").textContent = sessionStats.wrong;
      cardNode.classList.add("hidden");
      actionsNode.classList.add("hidden");
      doneNode.classList.remove("hidden");
      return;
    }
    const card = queue[idx];
    const entry = getEntry(STATE, card.id);
    flipped = false;
    posNode.textContent = idx + 1;
    statsNode.textContent = `✓ ${sessionStats.correct} · ✗ ${sessionStats.wrong}`;
    esNode.innerHTML = phrase(card.es);
    enNode.textContent = card.en;
    enNode.classList.add("hidden");
    hintNode.classList.remove("hidden");
    if (card.notes) {
      notesNode.textContent = card.notes;
    } else {
      notesNode.textContent = "";
    }
    notesNode.classList.add("hidden");
    boxNode.textContent = `box ${entry.box}/${MAX_BOX} · wrong ${entry.wrongTotal} · right ${entry.correctTotal}`;
    // Auto-play on new card
    speak(card.es, { voiceURI: STATE.settings.voiceURI, rate: STATE.settings.rate }).catch(() => {});
  }

  function flip() {
    if (idx >= queue.length) return;
    flipped = true;
    enNode.classList.remove("hidden");
    hintNode.classList.add("hidden");
    const card = queue[idx];
    if (card.notes) notesNode.classList.remove("hidden");
  }

  function gradeCurrent(g) {
    if (idx >= queue.length) return;
    const card = queue[idx];
    STATE = grade(STATE, card.id, g);
    persist();
    if (g === "correct") sessionStats.correct += 1;
    else sessionStats.wrong += 1;
    idx += 1;
    renderCard();
  }

  cardNode.addEventListener("click", () => {
    if (!flipped) flip();
  });
  wrapper.querySelector("#fc-wrong").addEventListener("click", () => gradeCurrent("wrong"));
  wrapper.querySelector("#fc-correct").addEventListener("click", () => gradeCurrent("correct"));
  wrapper.querySelector("#fc-play").addEventListener("click", () => {
    const card = queue[idx];
    if (card) speak(card.es, { voiceURI: STATE.settings.voiceURI, rate: STATE.settings.rate }).catch(() => {});
  });

  // Keyboard shortcuts
  const keyHandler = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === " ") { e.preventDefault(); if (!flipped) flip(); }
    else if (e.key === "1" || e.key.toLowerCase() === "j") gradeCurrent("wrong");
    else if (e.key === "2" || e.key.toLowerCase() === "k") gradeCurrent("correct");
    else if (e.key.toLowerCase() === "p") {
      const card = queue[idx];
      if (card) speak(card.es, { voiceURI: STATE.settings.voiceURI, rate: STATE.settings.rate }).catch(() => {});
    }
  };
  document.addEventListener("keydown", keyHandler);
  // Clean up keyboard listener when user navigates away (one-shot)
  window.addEventListener("hashchange", () => document.removeEventListener("keydown", keyHandler), { once: true });

  renderCard();
  return wrapper;
}

function renderCheatSheet() {
  const sections = CHEAT_SHEET.map(s => `
    <section class="mb-6 ${s.highlight ? "p-4 rounded-lg border border-amber-700 bg-amber-900/20" : ""}">
      <h2 class="text-lg font-bold mb-2">${s.title}</h2>
      <table class="w-full text-left text-sm">
        <tbody>
          ${s.entries.map(e => `
            <tr class="border-b border-slate-800 last:border-0">
              <td class="py-1.5 pr-3">${phrase(e.es)}</td>
              <td class="py-1.5 text-slate-400">${e.en}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `).join("");

  const root = el(`
    <section>
      <div class="flex justify-between items-start mb-6 print-hide">
        <div>
          <h1 class="text-2xl font-bold">Cheat sheet</h1>
          <p class="text-slate-400 mt-1">Searchable. Tap any phrase to hear it.</p>
        </div>
        <div class="flex gap-2">
          <input id="cs-search" type="search" placeholder="Search..." class="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-sm" />
          <button id="cs-print" class="px-3 py-1.5 rounded border border-slate-700 hover:bg-slate-900 text-sm">Print</button>
        </div>
      </div>
      <div id="cs-body">${sections}</div>
    </section>
  `);

  root.querySelector("#cs-print").addEventListener("click", () => window.print());

  const search = root.querySelector("#cs-search");
  search.addEventListener("input", () => {
    const q = search.value.toLowerCase().trim();
    root.querySelectorAll("#cs-body section").forEach(sec => {
      const rows = sec.querySelectorAll("tbody tr");
      let anyVisible = false;
      rows.forEach(r => {
        const hit = q === "" || r.textContent.toLowerCase().includes(q);
        r.classList.toggle("hidden", !hit);
        if (hit) anyVisible = true;
      });
      sec.classList.toggle("hidden", !anyVisible);
    });
  });

  return root;
}

function renderDrills() {
  const list = DRILLS.map(d => {
    const lines = d.lines.map(l => `<li class="py-1">${phrase(l)}</li>`).join("");
    return `
      <section class="mb-6 p-4 rounded-lg border border-slate-800 bg-slate-900/30">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 class="text-lg font-bold">Drill ${d.id} — ${d.title}</h2>
            <p class="text-sm text-slate-400">${d.subtitle}</p>
          </div>
          <button data-drill="${d.id}" class="drill-play px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">
            ▶ Play all
          </button>
        </div>
        <ul class="mt-3 text-sm">${lines}</ul>
      </section>
    `;
  }).join("");

  const root = el(`
    <section>
      <h1 class="text-2xl font-bold mb-2">Audio drills</h1>
      <p class="text-slate-400 mb-6">Hit "Play all" for the full drill, or tap individual lines. Sequential playback uses a short pause between lines so you can shadow along.</p>
      <div class="mb-4 flex items-center gap-3 text-sm">
        <label class="flex items-center gap-2">
          Speed:
          <select id="drill-rate" class="bg-slate-900 border border-slate-800 rounded px-2 py-1">
            <option value="0.7">0.7× (slow)</option>
            <option value="0.85">0.85×</option>
            <option value="0.9" selected>0.9× (default)</option>
            <option value="1">1×</option>
          </select>
        </label>
        <button id="drill-stop" class="px-3 py-1.5 rounded border border-slate-700 hover:bg-slate-900">Stop</button>
      </div>
      ${list}
    </section>
  `);

  let cancelled = false;
  root.querySelector("#drill-stop").addEventListener("click", () => {
    cancelled = true;
    cancelSpeech();
  });
  const rateSel = root.querySelector("#drill-rate");

  root.querySelectorAll(".drill-play").forEach(btn => {
    btn.addEventListener("click", async () => {
      cancelled = false;
      cancelSpeech();
      const id = parseInt(btn.dataset.drill, 10);
      const d = DRILLS.find(x => x.id === id);
      if (!d) return;
      btn.textContent = "⏸ Playing...";
      btn.disabled = true;
      try {
        await speakSequence(d.lines, {
          voiceURI: STATE.settings.voiceURI,
          rate: parseFloat(rateSel.value),
          gap: 500,
          cancelled: () => cancelled,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        btn.textContent = "▶ Play all";
        btn.disabled = false;
      }
    });
  });

  return root;
}

function renderSettings() {
  const root = el(`
    <section>
      <h1 class="text-2xl font-bold mb-6">Settings</h1>

      <div class="space-y-6 max-w-2xl">
        <div class="p-4 rounded-lg border border-slate-800">
          <h2 class="font-semibold mb-2">Voice</h2>
          <p class="text-sm text-slate-400 mb-3">Pick the TTS voice used for Spanish playback. es-MX is preferred; es-US or other es-* are fine fallbacks.</p>
          <select id="voice" class="w-full bg-slate-900 border border-slate-800 rounded px-2 py-2"></select>
          <div class="mt-3 flex gap-2 items-center">
            <label class="text-sm">Rate:</label>
            <input id="rate" type="range" min="0.5" max="1.3" step="0.05" value="${STATE.settings.rate}" class="flex-1" />
            <span id="rate-val" class="text-sm w-12 text-right">${STATE.settings.rate}</span>
          </div>
          <button id="test-voice" class="mt-3 px-3 py-1.5 rounded border border-slate-700 hover:bg-slate-900 text-sm">Test this voice</button>
        </div>

        <div class="p-4 rounded-lg border border-slate-800">
          <h2 class="font-semibold mb-2">Export / Import progress</h2>
          <p class="text-sm text-slate-400 mb-3">Your SRS progress lives in this browser's localStorage. Export JSON to back it up or move to another device.</p>
          <div class="flex gap-2 flex-wrap">
            <button id="export" class="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-sm">Export JSON</button>
            <label class="px-3 py-1.5 rounded border border-slate-700 hover:bg-slate-900 text-sm cursor-pointer">
              Import JSON
              <input id="import-file" type="file" accept="application/json" class="hidden" />
            </label>
          </div>
          <textarea id="export-out" readonly class="hidden mt-3 w-full h-40 p-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs"></textarea>
        </div>

        <div class="p-4 rounded-lg border border-red-900/50">
          <h2 class="font-semibold mb-2 text-red-300">Reset progress</h2>
          <p class="text-sm text-slate-400 mb-3">Clears all SRS data, day completions, and settings. Irreversible.</p>
          <button id="reset" class="px-3 py-1.5 rounded bg-red-700 hover:bg-red-600 text-sm">Reset everything</button>
        </div>

        <div class="p-4 rounded-lg border border-slate-800 text-xs text-slate-500">
          <div>Version: ${META.version} · Generated: ${META.generated}</div>
          <div>Cards: ${CARDS.length} · Days: ${DAYS.length} · Drills: ${DRILLS.length}</div>
        </div>
      </div>
    </section>
  `);

  // Voice select
  const voiceSel = root.querySelector("#voice");
  const esVoices = VOICES.filter(v => (v.lang || "").toLowerCase().startsWith("es"));
  const others = VOICES.filter(v => !esVoices.includes(v));
  const opt = (v) => `<option value="${v.voiceURI}" ${STATE.settings.voiceURI === v.voiceURI ? "selected" : ""}>${v.name} (${v.lang})</option>`;
  voiceSel.innerHTML =
    `<optgroup label="Spanish voices">${esVoices.map(opt).join("") || '<option disabled>none detected</option>'}</optgroup>` +
    `<optgroup label="Other">${others.map(opt).join("")}</optgroup>`;
  voiceSel.addEventListener("change", () => {
    STATE.settings.voiceURI = voiceSel.value;
    persist();
  });

  // Rate slider
  const rate = root.querySelector("#rate");
  const rateVal = root.querySelector("#rate-val");
  rate.addEventListener("input", () => {
    STATE.settings.rate = parseFloat(rate.value);
    rateVal.textContent = STATE.settings.rate;
    persist();
  });

  root.querySelector("#test-voice").addEventListener("click", () => {
    speak("Buenos días, ¿cómo amaneciste? Listo para darle.", {
      voiceURI: STATE.settings.voiceURI,
      rate: STATE.settings.rate,
    }).catch(() => {});
  });

  // Export
  const exportOut = root.querySelector("#export-out");
  root.querySelector("#export").addEventListener("click", () => {
    const json = exportState();
    exportOut.value = json;
    exportOut.classList.remove("hidden");
    exportOut.select();
    // Also trigger a download
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gym-spanish-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import
  root.querySelector("#import-file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    if (importState(text)) {
      STATE = load();
      alert("Imported. Progress restored.");
      route();
    } else {
      alert("Couldn't parse that JSON. Is it a valid export?");
    }
  });

  // Reset
  root.querySelector("#reset").addEventListener("click", () => {
    if (confirm("Reset everything? This wipes all SRS progress and day completions.")) {
      reset();
      STATE = load();
      alert("Reset. Welcome back to day 1.");
      route();
    }
  });

  return root;
}
