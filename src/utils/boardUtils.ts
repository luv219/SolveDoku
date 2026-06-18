import type { Board, CellValue } from "../types/sudoku";

const BOARD_SIZE = 9;
const VALID_VALUES = new Set<CellValue>([1, 2, 3, 4, 5, 6, 7, 8, 9, null]);

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array<CellValue>(BOARD_SIZE).fill(null)) as Board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]) as Board;
}

export function isBoardEmpty(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell === null));
}

export function boardToString(board: Board): string {
  if (!isValidBoardShape(board)) {
    throw new Error("Sudoku board must be a valid 9x9 grid before it can be serialized.");
  }

  return board.map((row) => row.map((cell) => cell ?? ".").join("")).join("");
}

export function stringToBoard(value: string): Board {
  const normalized = value.replace(/\s/g, "");

  if (normalized.length !== BOARD_SIZE * BOARD_SIZE) {
    throw new Error("Sudoku board string must contain exactly 81 characters.");
  }

  const cells = normalized.split("").map<CellValue>((character) => {
    if (character === "." || character === "0") {
      return null;
    }

    const parsed = Number(character);

    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 9) {
      return parsed as CellValue;
    }

    throw new Error("Sudoku board string can only contain digits 1-9, 0, dots, or whitespace.");
  });

  return Array.from({ length: BOARD_SIZE }, (_, rowIndex) =>
    cells.slice(rowIndex * BOARD_SIZE, rowIndex * BOARD_SIZE + BOARD_SIZE),
  ) as Board;
}

export function isValidBoardShape(board: unknown): board is Board {
  if (!Array.isArray(board) || board.length !== BOARD_SIZE) {
    return false;
  }

  return board.every(
    (row) => Array.isArray(row) && row.length === BOARD_SIZE && row.every((cell) => VALID_VALUES.has(cell as CellValue)),
  );
}
