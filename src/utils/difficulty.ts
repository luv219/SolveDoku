import type { Difficulty, DifficultyConfig } from "../types/sudoku";

export const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "Easy",
    clueRange: {
      min: 40,
      max: 45,
    },
    hintLimit: 6,
    mistakeLimit: 5,
  },
  medium: {
    label: "Medium",
    clueRange: {
      min: 32,
      max: 39,
    },
    hintLimit: 5,
    mistakeLimit: 4,
  },
  hard: {
    label: "Hard",
    clueRange: {
      min: 26,
      max: 31,
    },
    hintLimit: 4,
    mistakeLimit: 3,
  },
  expert: {
    label: "Expert",
    clueRange: {
      min: 22,
      max: 25,
    },
    hintLimit: 3,
    mistakeLimit: 3,
  },
};
