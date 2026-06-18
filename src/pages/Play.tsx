import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Container from "../components/Container";
import MessageBox from "../components/MessageBox";
import PageHeader from "../components/PageHeader";
import SudokuBoard from "../components/SudokuBoard";
import { useTimer } from "../hooks/useTimer";
import type {
  Board,
  CellPosition,
  CellValue,
  Difficulty,
  GameStatus,
  GeneratedPuzzle,
  NotesBoard,
  SudokuMessage,
  ValidationError,
} from "../types/sudoku";
import { cloneBoard, isValidBoardShape } from "../utils/boardUtils";
import { difficultyConfig } from "../utils/difficulty";
import { generatePuzzle } from "../utils/generator";
import { readStorageValue, removeStorageValue, writeStorageValue } from "../utils/storage";

const difficulties = Object.keys(difficultyConfig) as Difficulty[];
const GAME_STORAGE_KEY = "solvedoku-play-game";
const DIFFICULTY_STORAGE_KEY = "solvedoku-selected-difficulty";

export default function Play() {
  const timer = useTimer();
  const [initialState] = useState(() => getInitialPlayState());
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(initialState.selectedDifficulty);
  const [generatedPuzzle, setGeneratedPuzzle] = useState<GeneratedPuzzle>(initialState.generatedPuzzle);
  const [board, setBoard] = useState<Board>(() => cloneBoard(initialState.board));
  const [notes, setNotes] = useState<NotesBoard>(() => cloneNotesBoard(initialState.notes));
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [hintsUsed, setHintsUsed] = useState(initialState.hintsUsed);
  const [mistakes, setMistakes] = useState(initialState.mistakes);
  const [wrongCells, setWrongCells] = useState<CellPosition[]>(initialState.wrongCells);
  const [revealedSolutionCells, setRevealedSolutionCells] = useState<CellPosition[]>(initialState.revealedSolutionCells);
  const [notesMode, setNotesMode] = useState(initialState.notesMode);
  const [gameStatus, setGameStatus] = useState<GameStatus>(initialState.gameStatus);
  const [shouldPersistGame, setShouldPersistGame] = useState(true);
  const [message, setMessage] = useState<SudokuMessage>({
    id: initialState.wasRestored ? "play-restored" : "play-ready",
    text: initialState.wasRestored
      ? "Saved game restored. Continue playing or start a new puzzle."
      : "A new puzzle is ready. Fill cells, use notes, or check your progress.",
    tone: "info",
  });
  const originalCells = useMemo(() => getFilledCellPositions(generatedPuzzle.puzzle), [generatedPuzzle.puzzle]);
  const editableCells = useMemo(() => getEmptyCellPositions(generatedPuzzle.puzzle), [generatedPuzzle.puzzle]);
  const validationErrors = useMemo(() => createMistakeErrors(wrongCells), [wrongCells]);
  const config = difficultyConfig[selectedDifficulty];
  const isLocked = gameStatus === "completed" || gameStatus === "failed" || gameStatus === "revealed";

  useEffect(() => {
    if (gameStatus === "playing") {
      timer.start(initialState.elapsedSeconds);
    } else {
      timer.reset(initialState.elapsedSeconds);
    }
    // Initialize from restored state once. Timer methods are stable callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    writeStorageValue(DIFFICULTY_STORAGE_KEY, selectedDifficulty);
  }, [selectedDifficulty]);

  useEffect(() => {
    if (!shouldPersistGame) {
      return;
    }

    writeStorageValue(GAME_STORAGE_KEY, {
      generatedPuzzle,
      board,
      notes,
      selectedDifficulty,
      mistakes,
      hintsUsed,
      wrongCells,
      revealedSolutionCells,
      notesMode,
      gameStatus,
      elapsedSeconds: timer.elapsedSeconds,
    } satisfies SavedPlayState);
  }, [
    board,
    gameStatus,
    generatedPuzzle,
    hintsUsed,
    mistakes,
    notes,
    notesMode,
    revealedSolutionCells,
    selectedDifficulty,
    shouldPersistGame,
    timer.elapsedSeconds,
    wrongCells,
  ]);

  function handleDifficultyChange(difficulty: Difficulty) {
    setSelectedDifficulty(difficulty);
    loadNewPuzzle(difficulty);
  }

  function handleNewGame() {
    removeStorageValue(GAME_STORAGE_KEY);
    loadNewPuzzle(selectedDifficulty);
  }

  function handleClearSavedGame() {
    removeStorageValue(GAME_STORAGE_KEY);
    setShouldPersistGame(false);
    setMessage({
      id: "play-save-cleared",
      text: "Saved game cleared. Current board is still playable.",
      tone: "info",
    });
  }

  function handleReset() {
    setBoard(cloneBoard(generatedPuzzle.puzzle));
    setNotes(createEmptyNotesBoard());
    setSelectedCell(null);
    setHintsUsed(0);
    setMistakes(0);
    setWrongCells([]);
    setRevealedSolutionCells([]);
    setNotesMode(false);
    setGameStatus("playing");
    setShouldPersistGame(true);
    timer.start();
    setMessage({
      id: "play-reset",
      text: "Puzzle reset. Timer, hints, mistakes, and notes were cleared.",
      tone: "info",
    });
  }

  function handleCellChange(position: CellPosition, value: CellValue) {
    if (isLocked || isOriginalCell(position, originalCells)) {
      return;
    }

    const nextBoard = cloneBoard(board);
    nextBoard[position.row][position.column] = value;

    setBoard(nextBoard);
    setWrongCells((current) => current.filter((cell) => !isSameCell(cell, position)));
    setRevealedSolutionCells((current) => current.filter((cell) => !isSameCell(cell, position)));

    if (value !== null) {
      clearNotesAt(position);
      handleValueResult(nextBoard, position, value);
    } else {
      setMessage({
        id: "play-cell-cleared",
        text: "Cell cleared.",
        tone: "info",
      });
    }
  }

  function handleNoteToggle(position: CellPosition, value: Exclude<CellValue, null>) {
    if (isLocked || isOriginalCell(position, originalCells) || board[position.row][position.column] !== null) {
      return;
    }

    setNotes((currentNotes) => {
      const nextNotes = cloneNotesBoard(currentNotes);
      const cellNotes = nextNotes[position.row][position.column];
      nextNotes[position.row][position.column] = cellNotes.includes(value)
        ? cellNotes.filter((note) => note !== value)
        : [...cellNotes, value].sort((first, second) => first - second);
      return nextNotes;
    });
  }

  function handleValueResult(nextBoard: Board, position: CellPosition, value: Exclude<CellValue, null>) {
    const correctValue = generatedPuzzle.solution[position.row][position.column];

    if (value !== correctValue) {
      const nextMistakes = mistakes + 1;

      setMistakes(nextMistakes);
      setWrongCells((current) => addUniqueCell(current, position));

      if (nextMistakes >= config.mistakeLimit) {
        setGameStatus("failed");
        timer.pause();
        setMessage({
          id: "play-failed",
          text: "Game over. Mistake limit reached.",
          tone: "error",
        });
      } else {
        setMessage({
          id: "play-wrong-entry",
          text: `That value is incorrect. Mistakes: ${nextMistakes} / ${config.mistakeLimit}.`,
          tone: "error",
        });
      }

      return;
    }

    evaluateBoardAfterEntry(nextBoard);
  }

  function evaluateBoardAfterEntry(nextBoard: Board) {
    const emptyCells = getEmptyCellPositions(nextBoard);
    const incorrectCells = getMistakeCells(nextBoard, generatedPuzzle.solution, originalCells);

    if (emptyCells.length === 0 && incorrectCells.length === 0) {
      setGameStatus("completed");
      setWrongCells([]);
      timer.pause();
      setMessage({
        id: "play-completed",
        text: "Puzzle completed successfully.",
        tone: "success",
      });
      return;
    }

    if (emptyCells.length === 0 && incorrectCells.length > 0) {
      setWrongCells(incorrectCells);
      setMessage({
        id: "play-full-incorrect",
        text: "The board is full, but some values are incorrect.",
        tone: "warning",
      });
      return;
    }

    setMessage({
      id: "play-correct-entry",
      text: "Good entry.",
      tone: "success",
    });
  }

  function handleCheck() {
    if (gameStatus === "failed") {
      setMessage({
        id: "play-check-failed",
        text: "Game over. Start a new puzzle or reset this one.",
        tone: "error",
      });
      return;
    }

    const emptyCells = getEmptyCellPositions(board);
    const mistakesFound = getMistakeCells(board, generatedPuzzle.solution, originalCells);

    setWrongCells(mistakesFound);

    if (mistakesFound.length > 0) {
      setMessage({
        id: "play-check-mistakes",
        text: `${mistakesFound.length} wrong ${mistakesFound.length === 1 ? "value" : "values"} found.`,
        tone: "error",
      });
      return;
    }

    if (emptyCells.length > 0) {
      setMessage({
        id: "play-check-incomplete",
        text: `${emptyCells.length} empty ${emptyCells.length === 1 ? "cell remains" : "cells remain"}. No wrong values found.`,
        tone: "info",
      });
      return;
    }

    setGameStatus("completed");
    timer.pause();
    setMessage({
      id: "play-check-complete",
      text: "Puzzle complete. Nice solve.",
      tone: "success",
    });
  }

  function handleHint() {
    if (isLocked) {
      setMessage({
        id: "play-hint-locked",
        text: "Hints are unavailable after the game has ended.",
        tone: "warning",
      });
      return;
    }

    if (hintsUsed >= config.hintLimit) {
      setMessage({
        id: "play-hint-limit",
        text: "Hint limit reached for this difficulty.",
        tone: "warning",
      });
      return;
    }

    const hintCell = editableCells.find((position) => board[position.row][position.column] === null);

    if (!hintCell) {
      setMessage({
        id: "play-hint-none",
        text: "No empty editable cells remain.",
        tone: "info",
      });
      return;
    }

    const nextBoard = cloneBoard(board);
    nextBoard[hintCell.row][hintCell.column] = generatedPuzzle.solution[hintCell.row][hintCell.column];

    setBoard(nextBoard);
    clearNotesAt(hintCell);
    setHintsUsed((count) => count + 1);
    setWrongCells((current) => current.filter((cell) => !isSameCell(cell, hintCell)));
    setRevealedSolutionCells((current) => addUniqueCell(current, hintCell));
    setSelectedCell(hintCell);
    setMessage({
      id: "play-hint-used",
      text: `Hint filled row ${hintCell.row + 1}, column ${hintCell.column + 1}.`,
      tone: "info",
    });
    evaluateBoardAfterEntry(nextBoard);
  }

  function handleShowSolution() {
    setBoard(cloneBoard(generatedPuzzle.solution));
    setNotes(createEmptyNotesBoard());
    setWrongCells([]);
    setRevealedSolutionCells(editableCells);
    setSelectedCell(null);
    setGameStatus("revealed");
    timer.pause();
    setMessage({
      id: "play-solution-revealed",
      text: "Solution revealed. Editing is disabled for this puzzle.",
      tone: "warning",
    });
  }

  function loadNewPuzzle(difficulty: Difficulty) {
    let nextPuzzle: GeneratedPuzzle;

    try {
      nextPuzzle = generatePuzzle(difficulty);
    } catch {
      setMessage({
        id: "play-generation-failed",
        text: "Puzzle generation failed. Please try again.",
        tone: "error",
      });
      return;
    }

    setGeneratedPuzzle(nextPuzzle);
    setBoard(cloneBoard(nextPuzzle.puzzle));
    setNotes(createEmptyNotesBoard());
    setSelectedCell(null);
    setHintsUsed(0);
    setMistakes(0);
    setWrongCells([]);
    setRevealedSolutionCells([]);
    setNotesMode(false);
    setGameStatus("playing");
    setShouldPersistGame(true);
    timer.start();
    setMessage({
      id: "play-new-game",
      text: `${difficultyConfig[difficulty].label} puzzle generated with ${nextPuzzle.clueCount} clues.`,
      tone: "success",
    });
  }

  function clearNotesAt(position: CellPosition) {
    setNotes((currentNotes) => {
      const nextNotes = cloneNotesBoard(currentNotes);
      nextNotes[position.row][position.column] = [];
      return nextNotes;
    });
  }

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Play"
        title="Play a generated Sudoku puzzle."
        description="Play a generated puzzle with a live timer, mistake limit, notes mode, hints, progress checks, and completion detection."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)_18rem] lg:items-start">
        <Card>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Game Setup</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                aria-pressed={selectedDifficulty === difficulty}
                aria-label={`Start a ${difficultyConfig[difficulty].label} puzzle`}
                onClick={() => handleDifficultyChange(difficulty)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                  selectedDifficulty === difficulty
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                }`}
              >
                {difficultyConfig[difficulty].label}
              </button>
            ))}
          </div>
          <dl className="mt-6 grid gap-3 text-sm">
            <Stat label="Timer" value={timer.formattedTime} />
            <Stat label="Status" value={getStatusLabel(gameStatus)} />
            <Stat label="Difficulty" value={config.label} />
            <Stat label="Clues" value={generatedPuzzle.clueCount.toString()} />
            <Stat label="Hints" value={`${hintsUsed} / ${config.hintLimit}`} />
            <Stat label="Mistakes" value={`${mistakes} / ${config.mistakeLimit}`} />
          </dl>
        </Card>

        <Card>
          <SudokuBoard
            board={board}
            notes={notes}
            selectedCell={selectedCell}
            originalCells={originalCells}
            solvedCells={revealedSolutionCells}
            validationErrors={validationErrors}
            readonly={isLocked}
            notesMode={notesMode}
            onCellSelect={setSelectedCell}
            onCellChange={handleCellChange}
            onCellNoteToggle={handleNoteToggle}
          />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Game Controls</h2>
          <div className="mt-4">
            <MessageBox
              message={message}
              onDismiss={() =>
                setMessage({
                  id: "play-message-dismissed",
                  text: "Keep playing. Status updates will appear here.",
                  tone: "info",
                })
              }
            />
          </div>
          <div className="mt-5 grid gap-3">
            <Button type="button" aria-label="Start a new generated Sudoku game" onClick={handleNewGame}>
              New Game
            </Button>
            <Button type="button" variant="secondary" aria-label="Reset the current Sudoku puzzle" onClick={handleReset}>
              Reset
            </Button>
            <Button
              type="button"
              variant="secondary"
              aria-label="Use a hint"
              disabled={isLocked || hintsUsed >= config.hintLimit}
              onClick={handleHint}
            >
              Hint
            </Button>
            <Button
              type="button"
              variant="secondary"
              aria-label="Check current puzzle progress"
              disabled={gameStatus === "revealed"}
              onClick={handleCheck}
            >
              Check
            </Button>
            <Button
              type="button"
              variant={notesMode ? "primary" : "secondary"}
              aria-label={notesMode ? "Turn notes mode off" : "Turn notes mode on"}
              disabled={isLocked}
              onClick={() => setNotesMode((enabled) => !enabled)}
            >
              Notes {notesMode ? "On" : "Off"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              aria-label="Reveal the Sudoku solution"
              disabled={gameStatus === "revealed"}
              onClick={handleShowSolution}
            >
              Show Solution
            </Button>
            <Button type="button" variant="ghost" aria-label="Clear saved Sudoku game progress" onClick={handleClearSavedGame}>
              Clear Saved Game
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}

interface SavedPlayState {
  generatedPuzzle: GeneratedPuzzle;
  board: Board;
  notes: NotesBoard;
  selectedDifficulty: Difficulty;
  mistakes: number;
  hintsUsed: number;
  wrongCells: CellPosition[];
  revealedSolutionCells: CellPosition[];
  notesMode: boolean;
  gameStatus: GameStatus;
  elapsedSeconds: number;
}

interface InitialPlayState extends SavedPlayState {
  wasRestored: boolean;
}

function getInitialPlayState(): InitialPlayState {
  const savedState = readStorageValue(GAME_STORAGE_KEY, isSavedPlayState);

  if (savedState) {
    return {
      ...savedState,
      wasRestored: true,
    };
  }

  const savedDifficulty = readStorageValue(DIFFICULTY_STORAGE_KEY, isDifficulty) ?? "easy";
  const generatedPuzzle = safeGeneratePuzzle(savedDifficulty);

  return {
    generatedPuzzle,
    board: cloneBoard(generatedPuzzle.puzzle),
    notes: createEmptyNotesBoard(),
    selectedDifficulty: savedDifficulty,
    mistakes: 0,
    hintsUsed: 0,
    wrongCells: [],
    revealedSolutionCells: [],
    notesMode: false,
    gameStatus: "playing",
    elapsedSeconds: 0,
    wasRestored: false,
  };
}

function safeGeneratePuzzle(difficulty: Difficulty): GeneratedPuzzle {
  try {
    return generatePuzzle(difficulty);
  } catch {
    return generatePuzzle("easy");
  }
}

function isSavedPlayState(value: unknown): value is SavedPlayState {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isGeneratedPuzzle(value.generatedPuzzle) &&
    isValidBoardShape(value.board) &&
    isNotesBoard(value.notes) &&
    isDifficulty(value.selectedDifficulty) &&
    isNonNegativeNumber(value.mistakes) &&
    isNonNegativeNumber(value.hintsUsed) &&
    isCellPositionArray(value.wrongCells) &&
    isCellPositionArray(value.revealedSolutionCells) &&
    typeof value.notesMode === "boolean" &&
    isGameStatus(value.gameStatus) &&
    isNonNegativeNumber(value.elapsedSeconds)
  );
}

function isGeneratedPuzzle(value: unknown): value is GeneratedPuzzle {
  return (
    isRecord(value) &&
    isValidBoardShape(value.puzzle) &&
    isValidBoardShape(value.solution) &&
    isDifficulty(value.difficulty) &&
    isNonNegativeNumber(value.clueCount)
  );
}

function isNotesBoard(value: unknown): value is NotesBoard {
  return (
    Array.isArray(value) &&
    value.length === 9 &&
    value.every(
      (row) =>
        Array.isArray(row) &&
        row.length === 9 &&
        row.every(
          (notes) =>
            Array.isArray(notes) &&
            notes.every((note) => Number.isInteger(note) && note >= 1 && note <= 9),
        ),
    )
  );
}

function isCellPositionArray(value: unknown): value is CellPosition[] {
  return Array.isArray(value) && value.every(isCellPosition);
}

function isCellPosition(value: unknown): value is CellPosition {
  if (!isRecord(value)) {
    return false;
  }

  const { row, column } = value;

  return (
    typeof row === "number" &&
    Number.isInteger(row) &&
    row >= 0 &&
    row < 9 &&
    typeof column === "number" &&
    Number.isInteger(column) &&
    column >= 0 &&
    column < 9
  );
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard" || value === "expert";
}

function isGameStatus(value: unknown): value is GameStatus {
  return (
    value === "idle" ||
    value === "playing" ||
    value === "paused" ||
    value === "completed" ||
    value === "failed" ||
    value === "revealed"
  );
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-slate-100 px-3 py-2 dark:bg-slate-800">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-semibold text-slate-950 dark:text-white">{value}</dd>
    </div>
  );
}

function createEmptyNotesBoard(): NotesBoard {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []));
}

function cloneNotesBoard(notes: NotesBoard): NotesBoard {
  return notes.map((row) => row.map((cellNotes) => [...cellNotes]));
}

function getFilledCellPositions(board: Board): CellPosition[] {
  return board.flatMap((row, rowIndex) =>
    row.flatMap((cell, columnIndex) => (cell === null ? [] : [{ row: rowIndex, column: columnIndex }])),
  );
}

function getEmptyCellPositions(board: Board): CellPosition[] {
  return board.flatMap((row, rowIndex) =>
    row.flatMap((cell, columnIndex) => (cell === null ? [{ row: rowIndex, column: columnIndex }] : [])),
  );
}

function getMistakeCells(board: Board, solution: Board, originalCells: CellPosition[]): CellPosition[] {
  return board.flatMap((row, rowIndex) =>
    row.flatMap((cell, columnIndex) => {
      const position = { row: rowIndex, column: columnIndex };

      if (cell === null || isOriginalCell(position, originalCells)) {
        return [];
      }

      return cell === solution[rowIndex][columnIndex] ? [] : [position];
    }),
  );
}

function createMistakeErrors(cells: CellPosition[]): ValidationError[] {
  return cells.map((position) => ({
    position,
    message: `Row ${position.row + 1}, column ${position.column + 1} does not match the solution.`,
    type: "value",
    affectedCells: [position],
  }));
}

function isOriginalCell(position: CellPosition, originalCells: CellPosition[]): boolean {
  return originalCells.some((cell) => isSameCell(cell, position));
}

function isSameCell(first: CellPosition, second: CellPosition): boolean {
  return first.row === second.row && first.column === second.column;
}

function addUniqueCell(cells: CellPosition[], cell: CellPosition): CellPosition[] {
  return cells.some((current) => isSameCell(current, cell)) ? cells : [...cells, cell];
}

function getStatusLabel(status: GameStatus): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "failed":
      return "Game Over";
    case "revealed":
      return "Revealed";
    case "paused":
      return "Paused";
    case "idle":
      return "Ready";
    case "playing":
    default:
      return "Playing";
  }
}
