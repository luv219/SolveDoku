import { useEffect } from "react";
import type { CellPosition, CellValue } from "../types/sudoku";

interface UseKeyboardNavigationOptions {
  selectedCell: CellPosition | null;
  readonly?: boolean;
  canEditSelectedCell?: boolean;
  notesMode?: boolean;
  onCellSelect: (position: CellPosition) => void;
  onCellChange?: (position: CellPosition, value: CellValue) => void;
  onCellNoteToggle?: (position: CellPosition, value: Exclude<CellValue, null>) => void;
}

const BOARD_SIZE = 9;

export function useKeyboardNavigation({
  selectedCell,
  readonly = false,
  canEditSelectedCell = true,
  notesMode = false,
  onCellSelect,
  onCellChange,
  onCellNoteToggle,
}: UseKeyboardNavigationOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!selectedCell) {
        return;
      }

      const nextPosition = getNextPosition(selectedCell, event.key);

      if (nextPosition) {
        event.preventDefault();
        onCellSelect(nextPosition);
        return;
      }

      const value = getCellValueFromKey(event.key);

      if (value) {
        event.preventDefault();

        if (!readonly && canEditSelectedCell) {
          if (notesMode) {
            onCellNoteToggle?.(selectedCell, value);
          } else {
            onCellChange?.(selectedCell, value);
          }
        }

        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();

        if (!readonly && canEditSelectedCell) {
          onCellChange?.(selectedCell, null);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canEditSelectedCell, notesMode, onCellChange, onCellNoteToggle, onCellSelect, readonly, selectedCell]);
}

function getNextPosition(position: CellPosition, key: string): CellPosition | null {
  switch (key) {
    case "ArrowUp":
      return { ...position, row: Math.max(0, position.row - 1) };
    case "ArrowDown":
      return { ...position, row: Math.min(BOARD_SIZE - 1, position.row + 1) };
    case "ArrowLeft":
      return { ...position, column: Math.max(0, position.column - 1) };
    case "ArrowRight":
      return { ...position, column: Math.min(BOARD_SIZE - 1, position.column + 1) };
    default:
      return null;
  }
}

function getCellValueFromKey(key: string): Exclude<CellValue, null> | null {
  const normalizedKey = key.startsWith("Numpad") ? key.replace("Numpad", "") : key;
  const value = Number(normalizedKey);

  if (Number.isInteger(value) && value >= 1 && value <= 9) {
    return value as Exclude<CellValue, null>;
  }

  return null;
}
