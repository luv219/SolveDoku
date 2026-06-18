import type { Board, CellPosition, CellValue, ValidationError } from "../types/sudoku";
const BOX_SIZE = 3;
const BOARD_SIZE = 9;
const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function validateBoard(board: Board): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!hasValidDimensions(board)) {
    return [
      {
        position: { row: 0, column: 0 },
        message: "Board must be a 9x9 grid containing only numbers 1-9 or empty cells.",
        type: "shape",
        affectedCells: [],
      },
    ];
  }

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const cell = board[row][column];

      if (!isCellValue(cell)) {
        errors.push({
          position: { row, column },
          message: "Cell value must be a number from 1-9 or empty.",
          type: "value",
          affectedCells: [{ row, column }],
        });
      }
    }
  }

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    errors.push(...findDuplicateErrors(getRowValues(board, row), "row", `Row ${row + 1} has duplicate values.`, row));
  }

  for (let column = 0; column < BOARD_SIZE; column += 1) {
    errors.push(
      ...findDuplicateErrors(getColumnValues(board, column), "column", `Column ${column + 1} has duplicate values.`, column),
    );
  }

  for (let startRow = 0; startRow < BOARD_SIZE; startRow += BOX_SIZE) {
    for (let startColumn = 0; startColumn < BOARD_SIZE; startColumn += BOX_SIZE) {
      errors.push(
        ...findDuplicateErrors(
          getBoxValues(board, startRow, startColumn),
          "box",
          `Box ${Math.floor(startRow / BOX_SIZE) + 1}-${Math.floor(startColumn / BOX_SIZE) + 1} has duplicate values.`,
          startRow,
          startColumn,
        ),
      );
    }
  }

  return errors;
}

export function isValidMove(board: Board, row: number, column: number, value: Exclude<CellValue, null>): boolean {
  if (!VALUES.includes(value) || row < 0 || row >= BOARD_SIZE || column < 0 || column >= BOARD_SIZE) {
    return false;
  }

  for (let currentColumn = 0; currentColumn < BOARD_SIZE; currentColumn += 1) {
    if (currentColumn !== column && board[row][currentColumn] === value) {
      return false;
    }
  }

  for (let currentRow = 0; currentRow < BOARD_SIZE; currentRow += 1) {
    if (currentRow !== row && board[currentRow][column] === value) {
      return false;
    }
  }

  const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const startColumn = Math.floor(column / BOX_SIZE) * BOX_SIZE;

  for (let currentRow = startRow; currentRow < startRow + BOX_SIZE; currentRow += 1) {
    for (let currentColumn = startColumn; currentColumn < startColumn + BOX_SIZE; currentColumn += 1) {
      const isCurrentCell = currentRow === row && currentColumn === column;

      if (!isCurrentCell && board[currentRow][currentColumn] === value) {
        return false;
      }
    }
  }

  return true;
}

export function getRowValues(board: Board, row: number): CellValue[] {
  return [...board[row]];
}

export function getColumnValues(board: Board, column: number): CellValue[] {
  return board.map((row) => row[column]);
}

export function getBoxValues(board: Board, row: number, column: number): CellValue[] {
  const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const startColumn = Math.floor(column / BOX_SIZE) * BOX_SIZE;
  const values: CellValue[] = [];

  for (let row = startRow; row < startRow + BOX_SIZE; row += 1) {
    for (let column = startColumn; column < startColumn + BOX_SIZE; column += 1) {
      values.push(board[row][column]);
    }
  }

  return values;
}

function isCellValue(value: unknown): value is CellValue {
  return value === null || VALUES.includes(value as Exclude<CellValue, null>);
}

function findDuplicateErrors(
  values: CellValue[],
  type: "row" | "column" | "box",
  message: string,
  primaryIndex: number,
  secondaryIndex = 0,
): ValidationError[] {
  const positionsByValue = new Map<Exclude<CellValue, null>, CellPosition[]>();

  values.forEach((value, index) => {
    if (value === null || !isCellValue(value)) {
      return;
    }

    const position = getPositionForValidationType(type, primaryIndex, secondaryIndex, index);
    const positions = positionsByValue.get(value) ?? [];
    positions.push(position);
    positionsByValue.set(value, positions);
  });

  return Array.from(positionsByValue.values())
    .filter((positions) => positions.length > 1)
    .map((affectedCells) => ({
      position: affectedCells[0],
      message,
      type,
      affectedCells,
    }));
}

function hasValidDimensions(board: unknown): board is Board {
  return (
    Array.isArray(board) &&
    board.length === BOARD_SIZE &&
    board.every((row) => Array.isArray(row) && row.length === BOARD_SIZE)
  );
}

function getPositionForValidationType(
  type: "row" | "column" | "box",
  primaryIndex: number,
  secondaryIndex: number,
  valueIndex: number,
): CellPosition {
  if (type === "row") {
    return { row: primaryIndex, column: valueIndex };
  }

  if (type === "column") {
    return { row: valueIndex, column: primaryIndex };
  }

  return {
    row: primaryIndex + Math.floor(valueIndex / BOX_SIZE),
    column: secondaryIndex + (valueIndex % BOX_SIZE),
  };
}
