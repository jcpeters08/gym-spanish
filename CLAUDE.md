# CLAUDE.md — Gym Spanish

If you're a new Claude session opening this repo, read this first.

## What this is

7-day Spanish crash course as a single-page static web app. Built for Jonathan to work with a Mexican personal trainer in Puerto Escondido (April 2026 cohort). Mexican Spanish, tú-form, gym/training vocab.

Live: https://jcpeters08.github.io/gym-spanish/

## Architecture

```
index.html      → shell (Tailwind CDN, ES module entry)
css/styles.css  → phrase-chip, flip card, print, progress-ring tweaks
js/
  app.js        → router + views
  data.js       → CARDS, DAYS, CHEAT_SHEET, DRILLS, ERROR_TRAPS (all content)
  srs.js        → Leitner spaced repetition
  storage.js    → localStorage wrapper (injectable backend for tests)
  tts.js        → Web Speech API (es-MX voice preference)
tests/test.js   → node-based unit tests
```

No build step. No framework runtime. Tailwind via CDN.

## Critical conventions — DON'T BREAK

1. **Card IDs are stable.** Adding vocab = edit `js/data.js`, never renumber. Tests check no-duplicate-IDs.
2. **Mexican Spanish only** — tú-form, MX idioms. The trainer is in Puerto Escondido, not Spain.
3. **Storage backend is injectable** — `storage.js` accepts a custom backend for tests. Keeps unit tests deterministic.
4. **Content lives in `js/data.js`** — not split across files. One source for all CARDS, DAYS, DRILLS.

## Glossary

- **PXM** — Puerto Escondido (Oaxaca, MX) — Jonathan's gym + trainer location
- **SRS** — Spaced Repetition System (Leitner-style here)
- **Weak spots** — auto-filter showing only cards the user has missed recently
- **Error traps** — common pitfalls section in the data

## Operational pointers

- **Tests**: `node tests/test.js`
- **Local dev**: `python3 -m http.server 8000`, open `http://localhost:8000`
- **Source notes**: `~/Documents/Jonathan's Vault/🎯 Projects/🏋️ Personal Trainer/Spanish Crash Course/`
- **Audio**: Web Speech API. Prefers `es-MX` voice; falls back to any Spanish voice on systems without it.

## Where to look for more

- `README.md` — full project layout, vocab-adding flow, testing
- `git log --oneline -20`
- Vault notes under `Spanish Crash Course/`

## CLAUDE.md update workflow

On material changes, the active session proactively offers an update.
