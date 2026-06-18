import Card from "../components/Card";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";

export default function About() {
  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        eyebrow="About"
        title="A focused frontend project with algorithmic depth."
        description="SolveDoku is designed to show practical React architecture, strict TypeScript modeling, responsive UI craft, and readable algorithm planning."
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Project Purpose</h2>
          <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
            The app will help users solve and play Sudoku while keeping the implementation approachable,
            testable, and easy to explain.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Tech Stack</h2>
          <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
            React, TypeScript, Vite, Tailwind CSS, and React Router power a frontend-only app with no backend
            or database.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Portfolio Value</h2>
          <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
            SolveDoku gives room to demonstrate component design, routing, state modeling, algorithms,
            responsive layouts, and deployment discipline.
          </p>
        </Card>
      </div>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Key Engineering Highlights</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600 sm:grid-cols-2 dark:text-slate-300">
          <li>Strict TypeScript modeling for boards, messages, generation, and game state.</li>
          <li>Pure solver, validator, generator, and storage utilities.</li>
          <li>Keyboard-friendly interactive 9x9 board with notes and highlights.</li>
          <li>Frontend-only deployment model with no backend or database.</li>
        </ul>
      </section>
      <section className="mt-8 rounded-lg border border-dashed border-slate-300 p-6 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">GitHub and Live Demo</h2>
        <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">
          GitHub link: coming soon. Live demo: coming soon.
        </p>
      </section>
    </Container>
  );
}
