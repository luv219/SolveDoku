import Button from "../components/Button";
import Card from "../components/Card";
import Container from "../components/Container";

const features = [
  {
    title: "Sudoku Solver",
    description: "Enter a puzzle, validate conflicts, detect solution count, and solve with backtracking.",
  },
  {
    title: "Game Mode",
    description: "Play generated puzzles with timer, mistakes, notes, hints, reset, and solution reveal.",
  },
  {
    title: "Difficulty Levels",
    description: "Easy, Medium, Hard, and Expert levels will guide both puzzle generation and limits.",
  },
  {
    title: "Smart Validation",
    description: "Validation will flag row, column, and box conflicts without interrupting the flow.",
  },
  {
    title: "Hints and Notes",
    description: "Use limited hints and candidate notes without replacing the actual cell value.",
  },
  {
    title: "Responsive Design",
    description: "The app shell is built for phones, tablets, and desktop portfolio review.",
  },
];

const highlights = [
  "Pure TypeScript solver, validator, and generator utilities",
  "Unique-solution puzzle generation with difficulty clue ranges",
  "Keyboard-first board input with responsive mobile scaling",
  "Local persistence for theme preference and Play progress",
];

export default function Home() {
  return (
    <>
      <section className="bg-white py-12 sm:py-16 lg:py-20 dark:bg-slate-950">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Portfolio Sudoku App</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl dark:text-white">
              Solve, play, and understand Sudoku in one focused web app.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              SolveDoku is a React and TypeScript showcase with structured routing, reusable UI,
              backtracking solve logic, unique puzzle generation, and a polished play mode.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/play">Start Playing</Button>
              <Button to="/solver" variant="secondary">
                Solve Puzzle
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 9 }, (_, index) => (
                <div
                  key={index}
                  className="flex aspect-square items-center justify-center rounded-md bg-white text-2xl font-bold text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-300"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{feature.title}</h2>
                <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Why It Stands Out</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
                A portfolio project with real product and algorithm depth.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
