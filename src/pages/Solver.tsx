import { useMemo, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Container from "../components/Container";
import MessageBox from "../components/MessageBox";
import PageHeader from "../components/PageHeader";
import SudokuBoard from "../components/SudokuBoard";
import { samplePuzzles } from "../data/samplePuzzles";
import type { Board, CellPosition, CellValue, SudokuMessage } from "../types/sudoku";
import { cloneBoard, createEmptyBoard, isBoardEmpty } from "../utils/boardUtils";
import { countSolutions, solveBoard } from "../utils/solver";
import { validateBoard } from "../utils/validator";

export default function Solver() {
  const emptyBoard = useMemo(() => createEmptyBoard(), []);
  const [board, setBoard] = useState<Board>(() => cloneBoard(emptyBoard));
  const [resetBoard, setResetBoard] = useState<Board>(() => cloneBoard(emptyBoard));
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [originalCells, setOriginalCells] = useState<CellPosition[]>([]);
  const [resetOriginalCells, setResetOriginalCells] = useState<CellPosition[]>([]);
  const [solvedCells, setSolvedCells] = useState<CellPosition[]>([]);
  const [solveStats, setSolveStats] = useState<SolveStats | null>(null);
  const [message, setMessage] = useState<SudokuMessage>({
    id: "solver-ready",
    text: "Select a cell, then type 1-9. Use arrow keys to move and Backspace or Delete to clear.",
    tone: "info",
  });
  const validationErrors = useMemo(() => validateBoard(board), [board]);

  function handleCellChange(position: CellPosition, value: CellValue) {
    if (isOriginalCell(position, originalCells)) {
      return;
    }

    const nextBoard = cloneBoard(board);
    nextBoard[position.row][position.column] = value;
    const nextErrors = validateBoard(nextBoard);

    setBoard(nextBoard);
    setSolvedCells([]);
    setSolveStats(null);
    setMessage(getValidationMessage(nextBoard, nextErrors));
  }

  function handleClear() {
    const nextBoard = createEmptyBoard();

    setBoard(nextBoard);
    setOriginalCells([]);
    setSolvedCells([]);
    setSolveStats(null);
    setSelectedCell(null);
    setMessage({
      id: "solver-clear",
      text: "Board cleared. Reset will restore the last loaded starting board.",
      tone: "info",
    });
  }

  function handleReset() {
    const nextBoard = cloneBoard(resetBoard);

    setBoard(nextBoard);
    setOriginalCells(resetOriginalCells);
    setSolvedCells([]);
    setSolveStats(null);
    setSelectedCell(null);
    setMessage({
      id: "solver-reset",
      text: isBoardEmpty(nextBoard) ? "Board reset to empty." : "Board reset to the last loaded puzzle.",
      tone: "success",
    });
  }

  function handleExamplePuzzle() {
    const nextBoard = cloneBoard(samplePuzzles.easy);
    const nextOriginalCells = getFilledCellPositions(nextBoard);

    setBoard(nextBoard);
    setResetBoard(cloneBoard(nextBoard));
    setOriginalCells(nextOriginalCells);
    setResetOriginalCells(nextOriginalCells);
    setSolvedCells([]);
    setSolveStats(null);
    setSelectedCell(null);
    setMessage({
      id: "solver-example",
      text: "Easy example loaded. Given cells are locked for now.",
      tone: "success",
    });
  }

  function handleSolve() {
    const currentErrors = validateBoard(board);

    if (isBoardEmpty(board)) {
      setSolveStats(null);
      setMessage({
        id: "solver-empty-submit",
        text: "Please enter a Sudoku puzzle first.",
        tone: "info",
      });
      return;
    }

    if (currentErrors.length > 0) {
      setSolveStats(null);
      setMessage({
        id: "solver-invalid-submit",
        text: "Please fix highlighted errors before solving.",
        tone: "error",
      });
      return;
    }

    const emptyCellsBeforeSolve = getEmptyCellPositions(board);
    const solutionCount = countSolutions(board, 2);

    if (solutionCount === 0) {
      setSolvedCells([]);
      setSolveStats({
        emptyCellsBeforeSolve: emptyCellsBeforeSolve.length,
        status: "No solution",
        isUnique: false,
      });
      setMessage({
        id: "solver-no-solution",
        text: "No valid solution exists for this puzzle.",
        tone: "error",
      });
      return;
    }

    if (solutionCount > 1) {
      setSolvedCells([]);
      setSolveStats({
        emptyCellsBeforeSolve: emptyCellsBeforeSolve.length,
        status: "Multiple solutions",
        isUnique: false,
      });
      setMessage({
        id: "solver-multiple-solutions",
        text: "This puzzle has multiple solutions.",
        tone: "warning",
      });
      return;
    }

    const solvedBoard = solveBoard(board);

    if (!solvedBoard) {
      setSolvedCells([]);
      setSolveStats({
        emptyCellsBeforeSolve: emptyCellsBeforeSolve.length,
        status: "No solution",
        isUnique: false,
      });
      setMessage({
        id: "solver-unexpected-no-solution",
        text: "No valid solution exists for this puzzle.",
        tone: "error",
      });
      return;
    }

    setBoard(solvedBoard);
    setSolvedCells(emptyCellsBeforeSolve);
    setSolveStats({
      emptyCellsBeforeSolve: emptyCellsBeforeSolve.length,
      status: "Solved",
      isUnique: true,
    });
    setSelectedCell(null);
    setMessage({
      id: "solver-success",
      text: "Puzzle solved successfully.",
      tone: "success",
    });
  }

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        eyebrow="Solver"
        title="Enter a puzzle and prepare it for solving."
        description="Enter values directly on the board, move with the keyboard, validate conflicts, and solve uniquely determined puzzles with the Phase 3 backtracking engine."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <Card>
          <SudokuBoard
            board={board}
            selectedCell={selectedCell}
            originalCells={originalCells}
            solvedCells={solvedCells}
            validationErrors={validationErrors}
            onCellSelect={setSelectedCell}
            onCellChange={handleCellChange}
          />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Solver Controls</h2>
          <div className="mt-4">
            <MessageBox
              message={message}
              onDismiss={() =>
                setMessage({
                  id: "solver-message-dismissed",
                  text: "Ready for your next action.",
                  tone: "info",
                })
              }
            />
          </div>
          {validationErrors.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-rose-700 dark:text-rose-200">
              {validationErrors.slice(0, 4).map((error, index) => (
                <li key={`${error.type}-${error.position.row}-${error.position.column}-${index}`}>
                  {error.message}
                </li>
              ))}
            </ul>
          ) : null}
          {solveStats ? (
            <dl className="mt-4 grid gap-2 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-950">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Empty cells</dt>
                <dd className="font-semibold text-slate-950 dark:text-white">{solveStats.emptyCellsBeforeSolve}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Status</dt>
                <dd className="font-semibold text-slate-950 dark:text-white">{solveStats.status}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Unique</dt>
                <dd className="font-semibold text-slate-950 dark:text-white">{solveStats.isUnique ? "Yes" : "No"}</dd>
              </div>
            </dl>
          ) : null}
          <div className="mt-5 grid gap-3">
            <Button type="button" onClick={handleSolve}>
              Solve
            </Button>
            <Button type="button" variant="secondary" onClick={handleClear}>
              Clear
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button type="button" variant="ghost" onClick={handleExamplePuzzle}>
              Example Puzzle
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}

interface SolveStats {
  emptyCellsBeforeSolve: number;
  status: "Solved" | "No solution" | "Multiple solutions";
  isUnique: boolean;
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

function isOriginalCell(position: CellPosition, originalCells: CellPosition[]): boolean {
  return originalCells.some((cell) => cell.row === position.row && cell.column === position.column);
}

function getValidationMessage(board: Board, errors: ReturnType<typeof validateBoard>): SudokuMessage {
  if (isBoardEmpty(board)) {
    return {
      id: "solver-empty",
      text: "Board is empty. Add values or load the example puzzle.",
      tone: "info",
    };
  }

  if (errors.length > 0) {
    return {
      id: "solver-invalid",
      text: "Validation found duplicate or invalid cells. Fix highlighted cells before solving later.",
      tone: "error",
    };
  }

  return {
    id: "solver-valid",
    text: "No conflicts detected.",
    tone: "success",
  };
}
