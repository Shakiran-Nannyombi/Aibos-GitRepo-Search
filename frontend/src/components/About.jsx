import { Github } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const REPO_URL = 'https://github.com/Shakiran-Nannyombi/Aibos-GitRepo-Search';
const AUTHOR_URL = 'https://github.com/Shakiran-Nannyombi';

const stack = [
  {
    area: 'Frontend',
    items: ['React 19', 'Vite', 'Tailwind CSS 4', 'React Router', 'GSAP', 'Vitest'],
    note: 'A single-page app deployed on Vercel. Theme, saved repositories and session live in the browser.',
  },
  {
    area: 'Backend',
    items: ['FastAPI', 'HTTPX', 'SQLAlchemy', 'SQLite', 'Pydantic', 'pytest'],
    note: 'An async API on Render that proxies GitHub search, handles OAuth and stores email accounts.',
  },
  {
    area: 'Auth',
    items: ['GitHub OAuth', 'JWT', 'Argon2 password hashing'],
    note: 'Sign in with GitHub for higher API rate limits, or create an email account and connect GitHub later.',
  },
];

export function About() {
  usePageTitle('About');

  return (
    <article className="max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em]">About Lens+Github</h1>
      <p className="mt-6 text-xl text-muted leading-relaxed max-w-[60ch]">
        Lens+Github is a focused front end for GitHub search. It turns a rough idea, such as
        "a table library for React" or "a fast Rust CLI", into a short list of maintained
        projects you can save and come back to.
      </p>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">How it&apos;s built</h2>
        <p className="mt-3 text-muted leading-relaxed max-w-[60ch]">
          I built this as a full-stack portfolio project. The repository is public, so you can
          read every part of it.
        </p>

        <dl className="mt-8 divide-y divide-border border-y border-border">
          {stack.map((s) => (
            <div key={s.area} className="py-6 grid sm:grid-cols-[9rem_1fr] gap-2 sm:gap-6">
              <dt className="font-semibold text-foreground">{s.area}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="px-2.5 py-1 rounded-[var(--radius-control)] border border-border bg-surface text-sm"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted leading-relaxed">{s.note}</p>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-[var(--radius-control)] bg-accent text-on-accent font-semibold hover:bg-accent-hover transition-colors"
        >
          <Github className="w-5 h-5" />
          Read the source
        </a>
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-[var(--radius-control)] border border-border font-semibold hover:bg-surface transition-colors"
        >
          More of my work
        </a>
      </div>
    </article>
  );
}
