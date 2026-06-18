# SolveDoku

SolveDoku is a responsive Sudoku solver and game web app built with React, TypeScript, Tailwind CSS, Vite, and React Router. It is frontend-only, uses no backend or database, and is designed as a portfolio-ready demonstration of UI architecture, state management, accessibility, and algorithmic problem solving.

## Live Demo

Coming soon.

## GitHub Repository

Coming soon.

## Screenshots

Screenshots will be added after deployment.

## Features

- Responsive landing page, Solver, Play, How It Works, and About pages
- Interactive 9x9 Sudoku board
- Keyboard navigation with arrow keys
- Manual puzzle input
- Row, column, and 3x3 box validation
- Backtracking solver
- No-solution detection
- Multiple-solution warning
- Randomized solved board generation
- Unique-solution puzzle generation
- Difficulty levels: Easy, Medium, Hard, Expert
- Play mode timer
- Mistake counter and game-over state
- Hint button with difficulty-based limits
- Notes mode with candidate rendering
- Check and Show Solution controls
- Wrong-cell highlighting
- Dark mode toggle
- Persisted theme preference
- Persisted Play progress with safe localStorage recovery
- Accessible status messages and focus states

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- localStorage for non-sensitive preferences and Play progress
- Frontend-only architecture

## Pages

- Home: product-style overview, CTAs, and engineering highlights
- Solver: manual board input, validation, solution counting, and solving
- Play: generated puzzle gameplay with timer, notes, hints, mistakes, and persistence
- How It Works: concise algorithm and feature explanation
- About: project purpose, stack, portfolio value, and engineering notes

## Algorithms

- Board shape validation
- Duplicate detection for rows, columns, and boxes
- Valid move checking
- Recursive backtracking solver
- Early-stopping solution counter
- Randomized solved board generation
- Difficulty-based clue removal
- Unique-solution checking for generated puzzles

## Local Setup

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

SolveDoku builds as a static site. Recommended hosts:

- Vercel
- Netlify
- GitHub Pages

No environment variables are required.

## Project Structure

```text
src/
  components/
  data/
  hooks/
  pages/
  types/
  utils/
```

Key files:

- `src/utils/validator.ts`: board validation
- `src/utils/solver.ts`: backtracking solver and solution counter
- `src/utils/generator.ts`: solved board and puzzle generation
- `src/pages/Solver.tsx`: solver workflow
- `src/pages/Play.tsx`: game workflow
- `src/hooks/useTimer.ts`: timer behavior
- `src/hooks/useTheme.ts`: dark mode preference
- `src/utils/storage.ts`: safe localStorage helpers

## Testing Checklist

See [TESTING.md](./TESTING.md) for the full manual QA checklist.

Core checks:

- All routes load
- Solver validates and solves valid puzzles
- Solver blocks empty, invalid, unsolvable, and multiple-solution cases correctly
- Play generates puzzles for every difficulty
- Play notes, hints, timer, mistakes, reset, check, completion, and solution reveal work
- Dark mode persists after reload
- Saved Play progress restores safely
- Mobile layout remains usable

## Future Improvements

- Automated unit and component tests
- Daily challenge
- Step-by-step solving explanation
- Puzzle import/export
- Shareable puzzle links
- Candidate auto-fill
- PWA support
- Mobile app version
- User accounts and leaderboard as optional future backend-backed features

## Portfolio Summary

Built a responsive Sudoku solver and game web app using React, TypeScript, Tailwind CSS, and Vite. Implemented board validation, a backtracking solver, unique-solution puzzle generation, notes mode, timer, hints, mistakes, localStorage persistence, dark mode, and responsive UI.
