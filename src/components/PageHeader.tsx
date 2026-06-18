interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{eyebrow}</p> : null}
      <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
    </header>
  );
}
