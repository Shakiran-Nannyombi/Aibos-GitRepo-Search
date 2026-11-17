import { Check, Star, SlidersHorizontal } from 'lucide-react';

function Chip({ children, active = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-control)] border text-sm ${
        active ? 'border-accent text-accent bg-accent/10' : 'border-border text-foreground bg-surface'
      }`}
    >
      {children}
    </span>
  );
}

const steps = [
  {
    title: 'Search the way you think',
    body: 'Type plain keywords or GitHub qualifiers. Results come straight from the GitHub search API, sorted by stars by default.',
    demo: (
      <div className="font-mono text-sm space-y-2">
        <div className="px-3 py-2 rounded-[var(--radius-control)] border border-border bg-surface">react table</div>
        <div className="px-3 py-2 rounded-[var(--radius-control)] border border-border bg-surface">
          state machine <span className="text-accent">language:typescript</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Narrow it down',
    body: 'Filter by language and minimum stars, then sort by stars, forks or recent activity to skip abandoned projects.',
    demo: (
      <div className="flex flex-wrap gap-2">
        <Chip><SlidersHorizontal className="w-3.5 h-3.5" /> Filters</Chip>
        <Chip active>TypeScript</Chip>
        <Chip active><Star className="w-3.5 h-3.5" /> 1,000+</Chip>
        <Chip>Recently updated</Chip>
      </div>
    ),
  },
  {
    title: 'Keep what matters',
    body: 'Save repositories to your own list, filter it by language, and see a breakdown of your GitHub activity on the analytics page.',
    demo: (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-3 py-2 rounded-[var(--radius-control)] border border-border bg-surface text-sm">
          <span className="font-medium">pmndrs/zustand</span>
          <span className="inline-flex items-center gap-1 text-accent font-medium">
            <Check className="w-4 h-4" /> Saved
          </span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden" aria-hidden="true">
          <span className="w-[46%]" style={{ background: '#3178c6' }} />
          <span className="w-[28%]" style={{ background: '#3572A5' }} />
          <span className="w-[16%]" style={{ background: '#dea584' }} />
          <span className="flex-1 bg-border" />
        </div>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-border bg-surface/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <h2 className="text-3xl md:text-[2.4rem] font-bold max-w-[22ch]">
          From a vague idea to a shortlist in three steps
        </h2>

        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col">
              <span className="text-sm font-semibold text-accent tabular-nums">Step {i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-muted leading-relaxed">{step.body}</p>
              <div className="mt-6 pt-6 border-t border-dashed border-border">{step.demo}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
