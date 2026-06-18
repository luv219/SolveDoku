# SolveDoku Project Plan

## Overview

SolveDoku is a frontend-only Sudoku solver and game web app built with React, TypeScript, Vite, Tailwind CSS, and React Router. It demonstrates responsive UI design, strict TypeScript modeling, reusable component architecture, accessible interactions, local persistence, and classic Sudoku algorithms.

## Completed Features

- Landing page
- Solver page
- Play page
- How It Works page
- About page
- Interactive 9x9 Sudoku board
- Keyboard navigation
- Manual puzzle input
- Board validation
- Backtracking solver
- No-solution detection
- Multiple-solution warning
- Randomized solved board generation
- Unique-solution puzzle generation
- Difficulty levels: Easy, Medium, Hard, Expert
- Timer
- Mistake counter
- Hint limits
- Notes mode
- Wrong-cell highlighting
- Completion detection
- Show Solution
- Dark mode
- Theme persistence
- Play progress persistence
- Responsive layout
- Accessible status messages

## Core Algorithms

- `validateBoard`: detects invalid board shape, invalid values, and duplicate rows, columns, and boxes.
- `isValidMove`: checks whether a value can be placed while ignoring the current cell.
- `solveBoard`: solves a puzzle with recursive backtracking without mutating the input board.
- `countSolutions`: counts solutions and stops early at a configured limit.
- `generateSolvedBoard`: creates a randomized complete Sudoku board.
- `removeCellsByDifficulty`: removes clues while preserving a unique solution where practical.
- `generatePuzzle`: packages puzzle, solution, difficulty, and clue count.

## Component Architecture

- `Layout`: shared app frame.
- `Navbar`: route navigation and dark mode toggle.
- `Footer`: portfolio and stack summary.
- `Container`: responsive content width wrapper.
- `Button`: reusable button/link styling.
- `Card`: reusable content surface.
- `PageHeader`: consistent page headings.
- `MessageBox`: accessible status/error feedback.
- `SudokuBoard`: controlled board rendering, selection, notes, validation, and keyboard navigation.
- `SudokuCell`: individual cell display for values, notes, givens, selected state, related cells, solved cells, and invalid cells.

## Page Architecture

- `Home`: portfolio landing page with CTAs and engineering highlights.
- `Solver`: manual input, validation, solution counting, solving, clear/reset/example behavior.
- `Play`: generated puzzle game loop with timer, mistakes, notes, hints, check, reset, reveal, and persistence.
- `HowItWorks`: concise technical explanation of rules and algorithms.
- `About`: project purpose, stack, portfolio value, highlights, and placeholder links.

## Utility Architecture

- `boardUtils.ts`: board creation, cloning, shape validation, serialization, and parsing.
- `validator.ts`: row, column, box, value, and move validation.
- `solver.ts`: candidate lookup, backtracking solver, and solution counting.
- `generator.ts`: solved board generation and puzzle generation.
- `difficulty.ts`: difficulty configuration.
- `storage.ts`: safe localStorage helpers.

## State Approach

- Solver state is page-local and focused on manual puzzle input, validation, and solved output.
- Play state is page-local and persisted to localStorage for in-progress restoration.
- Theme state is managed with a small hook and persisted to localStorage.
- Algorithms stay pure and testable outside React components.

## Deployment Plan

SolveDoku builds to static assets in `dist`.

Recommended deployment targets:

- Vercel
- Netlify
- GitHub Pages

No environment variables are required.

## Known Limitations

- No automated test suite yet.
- Generator difficulty is clue-range based, not technique-rating based.
- Hints fill correct values but do not explain solving steps.
- No puzzle sharing or daily challenge yet.
- GitHub and live demo links are placeholders until deployment.

## Future Roadmap

- Automated tests for utilities and page interactions
- Daily challenge
- Step-by-step solving explanation
- Shareable puzzle links
- Puzzle import/export
- Candidate auto-fill
- PWA support
- Mobile app version
- Optional backend-backed accounts and leaderboard
