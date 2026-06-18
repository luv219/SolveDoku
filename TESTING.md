# SolveDoku Testing Checklist

## Routes

- `/` loads Home.
- `/solver` loads Solver.
- `/play` loads Play.
- `/how-it-works` loads How It Works.
- `/about` loads About.
- Navbar links navigate to every page.
- Home CTAs navigate to Play and Solver.
- Refreshing each route works in the Vite dev server.

## Solver Page

- Select cells by mouse or keyboard.
- Move selection with ArrowUp, ArrowDown, ArrowLeft, and ArrowRight.
- Enter values 1-9.
- Backspace/Delete clears editable cells.
- Row duplicates are highlighted and reported.
- Column duplicates are highlighted and reported.
- 3x3 box duplicates are highlighted and reported.
- Empty board shows “Please enter a Sudoku puzzle first.”
- Example Puzzle loads givens and locks original cells.
- Clear empties the board.
- Reset restores the last loaded puzzle or empty board.
- Valid example puzzle solves successfully.
- Solved cells are styled differently from original givens.
- Invalid boards block solving.
- Unsolvable boards show no-solution feedback.
- Multiple-solution boards show warning feedback.

## Play Page

- Difficulty selector generates Easy, Medium, Hard, and Expert puzzles.
- New Game creates a fresh puzzle.
- Original cells are locked.
- Editable cells accept values.
- Notes mode toggles candidates without replacing cell values.
- Entering a value clears notes for that cell.
- Timer starts for a new game.
- Reset restores the current puzzle and resets timer, notes, hints, mistakes, and status.
- Wrong value entry increments mistakes.
- Mistake limit triggers game-over state.
- Hint fills an empty editable cell.
- Hint limit is respected.
- Check reports empty cells.
- Check reports and highlights wrong editable cells.
- Correct completion stops the timer and marks the game completed.
- Show Solution reveals the answer, stops the timer, and disables editing.
- Clear Saved Game removes persisted Play progress.

## Validation And Algorithms

- `validateBoard` detects invalid shapes.
- `validateBoard` detects invalid cell values.
- `validateBoard` detects duplicate rows, columns, and boxes.
- `isValidMove` ignores the current cell.
- `solveBoard` does not mutate the input board.
- `countSolutions` stops at the requested limit.
- `generateSolvedBoard` returns a full valid board.
- `generatePuzzle` returns a puzzle with one solution where practical.
- `removeCellsByDifficulty` does not mutate the solved board.

## Dark Mode

- Dark mode toggle changes the theme.
- Theme preference persists after reload.
- Navbar, footer, cards, buttons, messages, board, and cells remain readable in dark mode.

## localStorage

- Selected difficulty persists.
- In-progress Play game restores after reload.
- Invalid saved game data does not crash the app.
- Clear Saved Game removes saved progress.

## Responsive Design

- Board remains usable at mobile widths.
- Buttons wrap without overlapping.
- Navbar wraps cleanly on mobile.
- Solver and Play side panels stack cleanly on smaller screens.
- Text remains readable on mobile, tablet, and desktop.

## Accessibility

- Keyboard navigation works on the board.
- Focus rings are visible.
- Buttons have accessible names.
- Disabled buttons are visibly disabled.
- Sudoku cells announce row, column, values, and notes.
- Status and error messages are announced with `status` or `alert` roles.
