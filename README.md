# SolveDoku

A polished, frontend-only Sudoku solver and game app built with React, TypeScript, Vite, Tailwind CSS, and React Router.

SolveDoku combines a clean responsive interface with real Sudoku algorithms: board validation, a recursive backtracking solver, solution counting, randomized puzzle generation, notes mode, hints, mistakes, timer, dark mode, and local progress persistence.

## Project Links

- Live demo: Coming soon
- GitHub repository: Coming soon
- Screenshots: Coming soon after deployment

## Portfolio Summary

Built a responsive Sudoku solver and game web app using React, TypeScript, Tailwind CSS, and Vite. Implemented board validation, a backtracking solver, unique-solution puzzle generation, notes mode, timer, hints, mistakes, localStorage persistence, dark mode, and responsive UI.

## Highlights

- Frontend-only React app with no backend and no database
- Strict TypeScript models for boards, cells, validation, generation, and game state
- Interactive 9x9 Sudoku board with keyboard navigation
- Solver page with validation, no-solution detection, and multiple-solution warning
- Play page with generated puzzles, timer, mistakes, notes, hints, reset, check, and solution reveal
- Unique-solution puzzle generation using solution counting
- Dark mode with persisted user preference
- Saved Play progress with safe localStorage recovery
- Responsive layout for mobile, tablet, and desktop
- Accessible status messages, cell labels, focus states, and disabled states

## Features

### Solver

- Manual puzzle input
- Arrow-key board navigation
- Backspace/Delete clearing
- Row, column, and 3x3 box validation
- Invalid cell highlighting
- Backtracking solve action
- No-solution feedback
- Multiple-solution warning
- Example puzzle loading
- Clear and reset controls

### Play Mode

- Random puzzle generation
- Difficulty levels: Easy, Medium, Hard, Expert
- Locked original/given cells
- Editable empty cells
- Timer
- Mistake counter and game-over state
- Notes mode with candidate rendering
- Limited hints by difficulty
- Check button with wrong-cell highlighting
- Show Solution action
- Completion detection
- Saved progress restore

### UX And Polish

- Responsive board scaling
- Mobile-friendly controls
- Dark mode toggle
- Persisted theme preference
- Accessible message system
- Portfolio-ready Home, How It Works, and About pages

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- localStorage for non-sensitive preferences and game progress

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page with CTAs and engineering highlights |
| `/solver` | Manual puzzle input, validation, solution counting, and solving |
| `/play` | Generated Sudoku gameplay with timer, notes, hints, and persistence |
| `/how-it-works` | Concise explanation of Sudoku rules and algorithms |
| `/about` | Project purpose, stack, portfolio value, and engineering highlights |

## Algorithms And Logic

- Board shape validation
- Duplicate detection for rows, columns, and boxes
- Valid move checking
- Recursive backtracking solver
- Early-stopping solution counter
- Randomized solved board generation
- Difficulty-based clue removal
- Unique-solution checking for generated puzzles
- Game-state checks for mistakes, hints, completion, and reveal state

## Getting Started

```bash
npm install
npm run dev
```

The app will run locally with Vite.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  components/   Shared UI and Sudoku board components
  data/         Sample puzzle data
  hooks/        Timer, theme, and keyboard behavior
  pages/        Route-level pages
  types/        Sudoku and app state types
  utils/        Board, validation, solver, generator, difficulty, and storage logic
```

Key files:

- `src/utils/validator.ts`: board validation and valid move checks
- `src/utils/solver.ts`: backtracking solver and solution counter
- `src/utils/generator.ts`: solved board and puzzle generation
- `src/pages/Solver.tsx`: solver workflow
- `src/pages/Play.tsx`: game workflow
- `src/hooks/useTimer.ts`: timer lifecycle
- `src/hooks/useTheme.ts`: dark mode preference
- `src/utils/storage.ts`: safe localStorage helpers

## Testing

Manual QA checklist: [TESTING.md](./TESTING.md)

Coverage areas:

- Routes and navigation
- Solver validation and solving
- Puzzle generation
- Play mode interactions
- Notes, hints, mistakes, timer, and completion
- Dark mode
- localStorage restore
- Mobile responsiveness
- Accessibility basics

## Deployment

Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

SolveDoku builds as a static site and can be deployed to:

- Vercel
- Netlify
- GitHub Pages

No environment variables are required.

## Current Limitations

- No automated test suite yet
- Difficulty is based on clue ranges, not human solving techniques
- Hints fill values but do not explain solving steps
- Screenshots and live demo links are pending deployment

## Future Improvements

- Automated unit and component tests
- Daily challenge
- Step-by-step solving explanation
- Puzzle import/export
- Shareable puzzle links
- Candidate auto-fill
- PWA support
- Mobile app version
- Optional backend-backed accounts and leaderboard
