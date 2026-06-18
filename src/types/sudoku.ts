export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null;

export type Board = [
  [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue],
];

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export interface DifficultyConfig {
  label: string;
  clueRange: {
    min: number;
    max: number;
  };
  hintLimit: number;
  mistakeLimit: number;
}

export interface GeneratedPuzzle {
  puzzle: Board;
  solution: Board;
  difficulty: Difficulty;
  clueCount: number;
}

export interface CellPosition {
  row: number;
  column: number;
}

export type GameStatus = "idle" | "playing" | "paused" | "completed" | "failed" | "revealed";

export type GameMode = "solver" | "play";

export interface ValidationError {
  position: CellPosition;
  message: string;
  type: "row" | "column" | "box" | "value" | "shape";
  affectedCells: CellPosition[];
}

export type CellNotes = Exclude<CellValue, null>[];
export type NotesBoard = CellNotes[][];

export interface SudokuMessage {
  id: string;
  text: string;
  tone: "info" | "success" | "warning" | "error";
}

export interface GameState {
  board: Board;
  initialBoard: Board;
  selectedCell: CellPosition | null;
  difficulty: Difficulty;
  status: GameStatus;
  mode: GameMode;
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
  notesMode: boolean;
  validationErrors: ValidationError[];
  message: SudokuMessage | null;
}
