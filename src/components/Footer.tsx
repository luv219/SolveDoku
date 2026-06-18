import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <Container className="flex flex-col gap-2 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
        <p>Copyright 2026 SolveDoku. Built as a frontend portfolio project.</p>
        <p>React, TypeScript, Vite, Tailwind CSS, and React Router.</p>
      </Container>
    </footer>
  );
}
