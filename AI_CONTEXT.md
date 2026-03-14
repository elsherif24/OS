# AI_CONTEXT.md — Project Reference (Not for Humans)

> This file is a machine-readable project summary for AI assistants. It is NOT documentation for humans. See `GUIDE.md` for human instructions.

## Project Overview

- **Name:** OS Course Review
- **Purpose:** A static quiz/revision website for an Operating Systems course. Students practice questions filtered by chapter, source, type, and solved status.
- **Hosting:** GitHub Pages (no backend, no database, no build tools)
- **Tech Stack:** Pure HTML + CSS + JavaScript (vanilla, no frameworks)
- **User Data:** All user data stored in `localStorage` (solved question IDs, theme preference, filter preferences)

## File Structure

```
OS/
├── index.html              # Single-page app: home screen, quiz screen, settings modal
├── AI_CONTEXT.md           # This file (AI reference)
├── GUIDE.md                # Human guide for adding/editing questions
├── css/
│   └── style.css           # All styles, CSS variables for dark/light theming, responsive
├── js/
│   ├── app.js              # Main application logic (screens, quiz engine, events, UI)
│   ├── storage.js          # localStorage abstraction (solved, theme, prefs, import/export)
│   └── questions/
│       ├── ch01.js          # Chapter 01 questions (has sample data)
│       ├── ch02.js          # Chapter 02 questions (empty template)
│       ├── ch03.js          # Chapter 03 questions (empty template)
│       ├── ch04.js          # Chapter 04 questions (empty template)
│       ├── ch05.js          # Chapter 05 questions (empty template)
│       ├── ch06.js          # Chapter 06 questions (empty template)
│       ├── ch07.js          # Chapter 07 questions (empty template)
│       ├── ch08.js          # Chapter 08 questions (empty template)
│       ├── ch09.js          # Chapter 09 questions (empty template)
│       └── ch10.js          # Chapter 10 questions (empty template)
└── images/                  # Directory for figure question images
```

## Architecture

### Screens (all in `index.html`, toggled via `.active` class)

1. **Home Screen (`#home-screen`)** — Preference selection: chapters, sources, types, filters (include solved, randomize). Shows matching question count. "Start" button.
2. **Quiz Screen (`#quiz-screen`)** — One question at a time. Top bar with back button, progress (e.g. "3 / 45"), progress bar. Question card with meta badges, question text, optional figure image, choices or reveal button. Prev/Next navigation. Keyboard nav (Arrow keys, A/D, Space/Enter).
3. **Settings Modal (`#settings-modal`)** — Theme toggle (dark/light), export/import JSON, reset progress per chapter or all.

### Question Data Model

Each question is a JS object pushed into `window.ALL_QUESTIONS`:

```js
{
  id: 'ch01_mcq_001',        // Unique ID: ch{NN}_{type}_{NNN}
  chapter: 1,                 // Integer 1-10
  source: 'testbank',         // 'testbank' | 'student'
  type: 'mcq',                // 'mcq' | 'tf' | 'list' | 'define' | 'fill'
  question: 'Question text',  // String
  choices: ['A', 'B', 'C'],   // Array (mcq/tf) or null (list/define/fill)
  answer: 0,                  // Index for mcq/tf, string for define/fill, array of strings for list
  hint: 'Explanation text',   // String or null — shown after answering mcq/tf only
  figure: null                // null or 'images/filename.png'
}
```

**Figure questions:** Use any normal `type` value (mcq, tf, list, etc.) and set the `figure` field to an image path. The figure is displayed above the question text.

**Hint field (MCQ/TF only):** Optional `hint` field. If set to a string, a yellow-themed hint box appears after the user answers. If `null`, no hint is shown. Only applies to `mcq` and `tf` types.

### Question Type Behavior

| Type     | Interaction                                          | Answer Format             | Solved/Wrong Logic                              |
|----------|------------------------------------------------------|---------------------------|-------------------------------------------------|
| `mcq`    | Click a choice → green if correct, red if wrong, optional hint shown | `number` (0-based index)  | Auto: correct → solved, incorrect → wrong       |
| `tf`     | Same as MCQ with choices `['True', 'False']`, optional hint shown    | `number` (0 or 1)         | Auto: correct → solved, incorrect → wrong       |
| `list`   | Click "Reveal Answer" → shows bullet list → self-assess             | `string[]`                | User clicks "Got it Right" (→ solved) or "Got it Wrong" (→ wrong) |
| `define` | Click "Reveal Answer" → shows text → self-assess                   | `string`                  | User clicks "Got it Right" (→ solved) or "Got it Wrong" (→ wrong) |
| `fill`   | Click "Reveal Answer" → shows text → self-assess                   | `string`                  | User clicks "Got it Right" (→ solved) or "Got it Wrong" (→ wrong) |

### Solved/Wrong Tracking

- **Solved** = user answered correctly (MCQ/TF) or self-assessed as "Got it Right" (list/define/fill)
- **Wrong** = user answered incorrectly (MCQ/TF) or self-assessed as "Got it Wrong" (list/define/fill)
- Marking solved automatically removes from wrong, and vice versa (mutually exclusive)
- A question can be: unsolved (neither), solved, or wrong — never both

### Home Screen Filters

| Filter           | Behavior                                                     |
|------------------|--------------------------------------------------------------|
| Include Solved   | Shows all questions including ones already marked solved     |
| Only Wrong       | Shows only questions the user previously got wrong           |
| Randomize Order  | Shuffles question order each session                         |

- "Include Solved" and "Only Wrong" are mutually exclusive — checking one unchecks the other

### localStorage Keys

| Key                      | Contents                                    |
|--------------------------|---------------------------------------------|
| `os_review_solved`       | JSON array of solved question ID strings    |
| `os_review_wrong`        | JSON array of wrong question ID strings     |
| `os_review_theme`        | `'dark'` or `'light'`                       |
| `os_review_preferences`  | JSON object of last-used filter preferences |

### Key Modules

- **`Storage` (storage.js):** IIFE module. Methods: `getSolved`, `markSolved`, `unmarkSolved`, `isSolved`, `resetChapterSolved`, `resetAllSolved`, `getSolvedCount`, `getSolvedCountForChapter`, `getWrong`, `markWrong`, `unmarkWrong`, `isWrong`, `resetChapterWrong`, `resetAllWrong`, `getWrongCount`, `getWrongCountForChapter`, `resetChapter` (both), `resetAll` (both), `getTheme`, `setTheme`, `toggleTheme`, `getPreferences`, `setPreferences`, `exportData`, `importData`. Marking solved auto-removes from wrong and vice versa.
- **`App` (app.js):** IIFE module. Handles DOM caching, event binding, screen switching, preference gathering/restoring, question filtering (including "Only Wrong" mode), quiz rendering, self-assessment flow for reveal-type questions, toast notifications. Entry point: `App.init()` on `DOMContentLoaded`.

### Theming

- CSS variables in `:root` (dark default) and `[data-theme="light"]`
- Theme is applied by setting `data-theme` attribute on `<html>`
- Persisted via `localStorage`

### Responsive Design

- Mobile-first with breakpoints at `600px` and `380px`
- Flexible chip/checkbox grid wraps naturally
- Cards and modals adapt padding/sizing
- Touch-friendly button sizes (min 40px tap targets)

## ID Convention

Question IDs follow the pattern: `ch{NN}_{type}_{NNN}`

- `NN` = zero-padded chapter number (01-10)
- `type` = question type (mcq, tf, list, define, fill)
- `NNN` = zero-padded sequential number within that chapter+type combo

Examples: `ch01_mcq_001`, `ch03_tf_002`, `ch07_list_005`

## Adding New Chapters

If more than 10 chapters are needed:
1. Create `js/questions/ch11.js` (follow existing template)
2. Add `<script src="js/questions/ch11.js"></script>` in `index.html` before `storage.js`
3. Update `TOTAL_CHAPTERS` constant in `app.js`

## Notes

- No build step required — just serve the files
- All question files are loaded via `<script>` tags in `index.html`
- Questions auto-register into `window.ALL_QUESTIONS` via IIFE push pattern
- Each chapter file is self-contained and can be edited independently
- The solved state auto-saves on answer (MCQ/TF) or reveal (list/define/fill)