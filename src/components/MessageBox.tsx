import type { SudokuMessage } from "../types/sudoku";

interface MessageBoxProps {
  message: SudokuMessage;
  onDismiss?: () => void;
}

const toneClasses: Record<SudokuMessage["tone"], string> = {
  info: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  error: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200",
};

export default function MessageBox({ message, onDismiss }: MessageBoxProps) {
  return (
    <div
      role={message.tone === "error" ? "alert" : "status"}
      aria-live={message.tone === "error" ? "assertive" : "polite"}
      className={`flex items-start justify-between gap-3 rounded-md border px-3 py-2 text-sm ${toneClasses[message.tone]}`}
    >
      <p>{message.text}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-sm px-1 font-semibold opacity-80 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          aria-label="Dismiss message"
        >
          x
        </button>
      ) : null}
    </div>
  );
}
