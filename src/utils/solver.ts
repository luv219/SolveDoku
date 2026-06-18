import type { Board, CellPosition, CellValue } from "../types/sudoku";
import { cloneBoard } from "./boardUtils";
import { isValidMove, validateBoard } from "./validator";

const BOARD_SIZE = 9;
const CANDIDATES: Exclude<CellValue, null>[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function solveBoard(board: Board): Board | null {
  if (validateBoard(board).length > 0) {
    return null;
  }

  const workingBoard = cloneBoard(board);

  return solveRecursive(workingBoard) ? workingBoard : null;
}

export function findEmptyCell(board: Board): CellPosition | null {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const column = board[row].findIndex((cell) => cell === null);

    if (column !== -1) {
      return { row, column };
    }
  }

  return null;
}

export function countSolutions(board: Board, limit = 2): number {
  if (limit <= 0 || validateBoard(board).length > 0) {
    return 0;
  }

  const workingBoard = cloneBoard(board);

  return countSolutionsRecursive(workingBoard, limit);
}

export function getCandidates(board: Board, row: number, column: number): Exclude<CellValue, null>[] {
  if (board[row][column] !== null) {
    return [];
  }

  return CANDIDATES.filter((value) => isValidMove(board, row, column, value));
}

function solveRecursive(board: Board): boolean {
  const emptyCell = findEmptyCell(board);

  if (!emptyCell) {
    return true;
  }

  for (const value of getCandidates(board, emptyCell.row, emptyCell.column)) {
    board[emptyCell.row][emptyCell.column] = value;

    if (solveRecursive(board)) {
      return true;
    }

    board[emptyCell.row][emptyCell.column] = null;
  }

  return false;
}

function countSolutionsRecursive(board: Board, limit: number): number {
  const emptyCell = findEmptyCell(board);

  if (!emptyCell) {
    return 1;
  }

  let solutionCount = 0;

  for (const value of getCandidates(board, emptyCell.row, emptyCell.column)) {
    board[emptyCell.row][emptyCell.column] = value;
    solutionCount += countSolutionsRecursive(board, limit - solutionCount);
    board[emptyCell.row][emptyCell.column] = null;

    if (solutionCount >= limit) {
      return solutionCount;
    }
  }

  return solutionCount;
}
