# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build locally
npm run lint      # ESLint check
```

No test suite is configured.

## Architecture

FitFlow is a mobile-first React PWA — a single-page app constrained to 480px max-width, portrait orientation. It uses React Router v7 for three pages (`/home`, `/exercises`, `/profile`) with a persistent `BottomNav` outside the router outlet.

**State:** All app state lives in `src/store/AppContext.jsx` via a single React Context. State is persisted to `localStorage` under the key `fitflow_state` with a `DATA_VERSION` guard — incrementing `DATA_VERSION` resets all stored data to defaults. The context exposes everything flat plus `updateState(partial)` for shallow-merge updates. Components consume state with the `useApp()` hook.

**Data model:**
- `muscleScores` — `{ pecho, espalda, brazos, hombros, pierna, core }` each 0–100. Drives `BodyMap` colors and `AIMessage` suggestions.
- `weekHistory` — array of `{ fecha: 'YYYY-MM-DD', duracionMin, calorias }` entries. `WeekStats` filters to the current Monday–Sunday window.
- `plan` — array of planned exercises (structure TBD, currently unused).

**Business logic formulas:**
- Duration (min) = `series × reps × secPerRep / 60`
- Calories = `series × reps × calPerRep`
- `muscleScores` color thresholds: green ≥ 60, yellow ≥ 35, red < 35, gray = 0

**Exercise data:** `src/data/exercises.js` exports 12 exercises with `{ id, name, muscle, category, description, secPerRep, calPerRep, icon }`. `muscle` values are the same keys used in `muscleScores`. `muscleGroups` array is exported separately and used to initialize default scores.

**BodyMap:** Uses `react-muscle-highlighter` (`Body` component). Maps internal `slug` names (e.g. `chest`, `quadriceps`) to the 6 app muscle keys. Renders front+back SVGs on the card front; flips to a bar chart of muscle scores on the back.

**AIMessage:** Finds the muscle with the lowest non-zero score and generates a motivational suggestion. If all scores are 0, shows a generic start message.

## Styling

All CSS variables are defined in `src/styles/global.css`. Every component has a co-located `.css` file (CSS Modules-style, but imported as plain CSS). Key variables:

```
--bg-primary: #0a0a0f    --accent: #7c6aff
--bg-card: #16161f       --radius-md: 16px
--font-title: Syne       --font-body: DM Sans
--nav-height: 68px
```

The app shell is capped at 480px and centered; `page-content` scrolls internally with the bottom nav height as padding so content is never hidden behind it.

## PWA

`vite-plugin-pwa` with Workbox handles service worker generation. The manifest and icons are configured in `vite.config.js`. Google Fonts are cached with `CacheFirst`. The SW auto-updates (`registerType: 'autoUpdate'`).

## Implementation status

- `ExerciseCard` — stub, renders name only
- `PlanSummary` — stub, not yet created
- Exercises page, Profile editing, and plan-building logic are shells awaiting implementation
