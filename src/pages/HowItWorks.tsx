import Card from "../components/Card";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";

const sections = [
  {
    title: "Sudoku Rules",
    description:
      "A completed Sudoku board must place the numbers 1 through 9 in every row, every column, and every 3x3 box without duplicates.",
  },
  {
    title: "Board Validation",
    description:
      "The validator inspects rows, columns, boxes, and cell values to identify conflicts before solving or checking gameplay entries.",
  },
  {
    title: "Backtracking Solver",
    description:
      "The solver finds empty cells, tries valid candidates, and backtracks when a branch cannot produce a completed board.",
  },
  {
    title: "Puzzle Generator",
    description:
      "The generator creates a randomized solved board, removes clues based on difficulty, and preserves a unique solution where practical.",
  },
  {
    title: "Uniqueness Checker",
    description:
      "The solution counter stops early once multiple solutions are found, which keeps generated puzzles reliable and efficient.",
  },
  {
    title: "Game Mode Features",
    description:
      "Play mode layers timer state, mistakes, notes, hints, reset, check, and solution reveal behavior onto the same board system.",
  },
];

export default function HowItWorks() {
  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        eyebrow="How It Works"
        title="A clear path from rules to algorithms."
        description="SolveDoku will pair Sudoku gameplay with readable algorithm implementations, making the project useful both as a tool and as a technical portfolio piece."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{section.title}</h2>
            <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{section.description}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
