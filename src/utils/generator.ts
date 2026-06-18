import type { Board, CellPosition, CellValue, Difficulty, GeneratedPuzzle } from "../types/sudoku";
import { cloneBoard, createEmptyBoard } from "./boardUtils";
import { difficultyConfig } from "./difficulty";
import { countSolutions } from "./solver";
import { isValidMove } from "./validator";

const BOARD_SIZE = 9;
const MAX_GENERATION_ATTEMPTS = 8;
const VALUES: Exclude<CellValue, null>[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function generatePuzzle(difficulty: Difficulty): GeneratedPuzzle {
  let bestPuzzle: GeneratedPuzzle | null = null;

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const solution = generateSolvedBoard();
    const puzzle = removeCellsByDifficulty(solution, difficulty);
    const clueCount = countClues(puzzle);
    const generatedPuzzle = {
      puzzle,
      solution,
      difficulty,
      clueCount,
    };

    if (!bestPuzzle || clueCount < bestPuzzle.clueCount) {
      bestPuzzle = generatedPuzzle;
    }

    const { min, max } = difficultyConfig[difficulty].clueRange;

    if (clueCount >= min && clueCount <= max) {
      return generatedPuzzle;
    }
  }

  if (!bestPuzzle) {
    throw new Error("Unable to generate a Sudoku puzzle.");
  }

  return bestPuzzle;
}

export function generateSolvedBoard(): Board {
  const board = createEmptyBoard();

  if (!fillBoard(board)) {
    throw new Error("Unable to generate a solved Sudoku board.");
  }

  return board;
}

export function removeCellsByDifficulty(solvedBoard: Board, difficulty: Difficulty): Board {
  const puzzle = cloneBoard(solvedBoard);
  const targetClueCount = getRandomInteger(
    difficultyConfig[difficulty].clueRange.min,
    difficultyConfig[difficulty].clueRange.max,
  );
  const positions = shuffle(getAllPositions());
  let clueCount = BOARD_SIZE * BOARD_SIZE;

  for (const position of positions) {
    if (clueCount <= targetClueCount) {
      break;
    }

    const previousValue = puzzle[position.row][position.column];
    puzzle[position.row][position.column] = null;

    if (countSolutions(puzzle, 2) === 1) {
      clueCount -= 1;
    } else {
      puzzle[position.row][position.column] = previousValue;
    }
  }

  return puzzle;
}

function fillBoard(board: Board): boolean {
  const emptyCell = findEmptyCell(board);

  if (!emptyCell) {
    return true;
  }

  for (const value of shuffle(VALUES)) {
    if (!isValidMove(board, emptyCell.row, emptyCell.column, value)) {
      continue;
    }

    board[emptyCell.row][emptyCell.column] = value;

    if (fillBoard(board)) {
      return true;
    }

    board[emptyCell.row][emptyCell.column] = null;
  }

  return false;
}

function findEmptyCell(board: Board): CellPosition | null {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      if (board[row][column] === null) {
        return { row, column };
      }
    }
  }

  return null;
}

function getAllPositions(): CellPosition[] {
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, column) => ({ row, column })),
  ).flat();
}

function countClues(board: Board): number {
  return board.reduce((total, row) => total + row.filter((cell) => cell !== null).length, 0);
}

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomInteger(0, index);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
