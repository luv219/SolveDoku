import { useMemo } from "react";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import type { Board, CellPosition, CellValue, NotesBoard, ValidationError } from "../types/sudoku";
import { createEmptyBoard } from "../utils/boardUtils";
import SudokuCell from "./SudokuCell";

interface SudokuBoardProps {
  board?: Board;
  notes?: NotesBoard;
  selectedCell: CellPosition | null;
  originalCells?: CellPosition[];
  solvedCells?: CellPosition[];
  validationErrors?: ValidationError[];
  readonly?: boolean;
  notesMode?: boolean;
  onCellSelect: (position: CellPosition) => void;
  onCellChange?: (position: CellPosition, value: CellValue) => void;
  onCellNoteToggle?: (position: CellPosition, value: Exclude<CellValue, null>) => void;
}

export default function SudokuBoard({
  board = createEmptyBoard(),
  notes = createEmptyNotesBoard(),
  selectedCell,
  originalCells = [],
  solvedCells = [],
  validationErrors = [],
  readonly = false,
  notesMode = false,
  onCellSelect,
  onCellChange,
  onCellNoteToggle,
}: SudokuBoardProps) {
  const originalCellKeys = useMemo(() => new Set(originalCells.map(getCellKey)), [originalCells]);
  const solvedCellKeys = useMemo(() => new Set(solvedCells.map(getCellKey)), [solvedCells]);
  const invalidCellKeys = useMemo(
    () => new Set(validationErrors.flatMap((error) => error.affectedCells.map(getCellKey))),
    [validationErrors],
  );
  const canEditSelectedCell = selectedCell ? !originalCellKeys.has(getCellKey(selectedCell)) : false;

  useKeyboardNavigation({
    selectedCell,
    readonly,
    notesMode,
    canEditSelectedCell,
    onCellSelect,
    onCellChange,
    onCellNoteToggle,
  });

  return (
    <div className="mx-auto w-full max-w-[34rem]">
      <div className="grid grid-cols-9 overflow-hidden rounded-md border-2 border-slate-900 bg-slate-200 shadow-soft dark:border-slate-100 dark:bg-slate-800">
        {board.map((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <SudokuCell
              key={`${rowIndex}-${columnIndex}`}
              value={cell}
              notes={notes[rowIndex]?.[columnIndex] ?? []}
              row={rowIndex}
              column={columnIndex}
              isSelected={isSameCell(selectedCell, rowIndex, columnIndex)}
              isRelated={isRelatedCell(selectedCell, rowIndex, columnIndex)}
              isInvalid={invalidCellKeys.has(getCellKey({ row: rowIndex, column: columnIndex }))}
              isOriginal={originalCellKeys.has(getCellKey({ row: rowIndex, column: columnIndex }))}
              isSolved={solvedCellKeys.has(getCellKey({ row: rowIndex, column: columnIndex }))}
              readonly={readonly}
              onSelect={() => onCellSelect({ row: rowIndex, column: columnIndex })}
            />
          )),
        )}
      </div>
    </div>
  );
}

function createEmptyNotesBoard(): NotesBoard {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []));
}

function getCellKey(position: CellPosition): string {
  return `${position.row}-${position.column}`;
}

function isSameCell(position: CellPosition | null, row: number, column: number): boolean {
  return position?.row === row && position.column === column;
}

function isRelatedCell(position: CellPosition | null, row: number, column: number): boolean {
  if (!position || isSameCell(position, row, column)) {
    return false;
  }

  const sameRow = position.row === row;
  const sameColumn = position.column === column;
  const sameBox = Math.floor(position.row / 3) === Math.floor(row / 3) && Math.floor(position.column / 3) === Math.floor(column / 3);

  return sameRow || sameColumn || sameBox;
}
