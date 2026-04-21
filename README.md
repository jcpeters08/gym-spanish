# 💪🇲🇽 Gym Spanish

A 7-day Spanish crash course for working with a Mexican personal trainer in Puerto Escondido.

Live site: **https://jcpeters08.github.io/gym-spanish/**

## What this is

Single-page static site that bundles everything from the crash course into one interactive app:

- **7-day plan** — warmups, new material, and application prompts per day
- **Flashcards with SRS** — Leitner-style spaced repetition, tap-to-hear pronunciation
- **Weak spots** — auto-filters to cards you've missed so you drill only what's hurting
- **Cheat sheet** — searchable one-pager, print-friendly
- **Audio drills** — sequential playback with speed control
- **Progress** — persists in `localStorage`; JSON export/import for backup

No build step, no dependencies. Tailwind via CDN, ES modules, Web Speech API.

## Local dev

```bash
# any static server works
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser — the module script requires a server, so use the command above for real use.

## Tests

```bash
node tests/test.js
```

Covers SRS grading logic, queue ordering, weak-spot filtering, storage round-trips, and content data integrity (no duplicate card IDs, every Day's `cardTags` resolve, every Drill has lines, etc.).

## Project layout

```
index.html           # shell — Tailwind CDN + module entry
css/styles.css       # phrase-chip, flip, print, progress-ring tweaks
js/
  app.js             # router + views
  data.js            # CARDS, DAYS, CHEAT_SHEET, DRILLS, ERROR_TRAPS — all content
  srs.js             # Leitner spaced repetition
  storage.js         # localStorage wrapper with injectable backend
  tts.js             # Web Speech API (es-MX voice preference)
tests/test.js        # node-based unit tests
```

Adding vocab: edit `js/data.js`, keep card IDs stable, reload. No rebuild.

## Notes

Built for Jonathan, April 2026, PXM Saturday trainer. Mexican Spanish (tú-form, MX idioms). Source notes live in the Obsidian vault under `🎯 Projects/🏋️ Personal Trainer/Spanish Crash Course/`.
