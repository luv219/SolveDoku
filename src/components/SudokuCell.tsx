import type { CellNotes, CellValue } from "../types/sudoku";

interface SudokuCellProps {
  value: CellValue;
  notes?: CellNotes;
  row: number;
  column: number;
  isSelected?: boolean;
  isRelated?: boolean;
  isInvalid?: boolean;
  isOriginal?: boolean;
  isSolved?: boolean;
  readonly?: boolean;
  onSelect: () => void;
}

export default function SudokuCell({
  value,
  notes = [],
  row,
  column,
  isSelected = false,
  isRelated = false,
  isInvalid = false,
  isOriginal = false,
  isSolved = false,
  readonly = false,
  onSelect,
}: SudokuCellProps) {
  const borderClasses = [
    row % 3 === 0 ? "border-t-2 border-t-slate-900 dark:border-t-slate-100" : "border-t border-t-slate-300 dark:border-t-slate-700",
    column % 3 === 0
      ? "border-l-2 border-l-slate-900 dark:border-l-slate-100"
      : "border-l border-l-slate-300 dark:border-l-slate-700",
    row === 8 ? "border-b-2 border-b-slate-900 dark:border-b-slate-100" : "border-b border-b-slate-300 dark:border-b-slate-700",
    column === 8
      ? "border-r-2 border-r-slate-900 dark:border-r-slate-100"
      : "border-r border-r-slate-300 dark:border-r-slate-700",
  ].join(" ");
  const stateClasses = getStateClasses({ isSelected, isRelated, isInvalid, isOriginal, isSolved });

  const notesLabel = notes.length > 0 ? `, notes ${notes.join(", ")}` : "";

  return (
    <button
      type="button"
      aria-label={`Row ${row + 1}, column ${column + 1}${value ? `, value ${value}` : `, empty${notesLabel}`}`}
      aria-pressed={isSelected}
      disabled={readonly}
      onClick={onSelect}
      className={`flex aspect-square min-h-8 items-center justify-center text-lg font-semibold transition focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-600 sm:text-xl ${borderClasses} ${stateClasses}`}
    >
      {value ? (
        value
      ) : notes.length > 0 ? (
        <span className="grid h-full w-full grid-cols-3 grid-rows-3 p-1 text-[0.55rem] font-semibold leading-none sm:text-[0.65rem]">
          {Array.from({ length: 9 }, (_, index) => {
            const note = (index + 1) as Exclude<CellValue, null>;

            return (
              <span key={note} className="flex items-center justify-center">
                {notes.includes(note) ? note : ""}
              </span>
            );
          })}
        </span>
      ) : null}
    </button>
  );
}

interface CellState {
  isSelected: boolean;
  isRelated: boolean;
  isInvalid: boolean;
  isOriginal: boolean;
  isSolved: boolean;
}

function getStateClasses({ isSelected, isRelated, isInvalid, isOriginal, isSolved }: CellState): string {
  if (isInvalid && isSelected) {
    return "bg-rose-200 text-rose-950 dark:bg-rose-900 dark:text-rose-50";
  }

  if (isInvalid) {
    return "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100";
  }

  if (isSelected) {
    return "bg-emerald-200 text-emerald-950 dark:bg-emerald-800 dark:text-white";
  }

  if (isRelated) {
    return "bg-emerald-50 text-slate-950 dark:bg-slate-800 dark:text-slate-100";
  }

  if (isOriginal) {
    return "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white";
  }

  if (isSolved) {
    return "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-200";
  }

  return "bg-white text-emerald-800 hover:bg-emerald-50 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-slate-800";
}
