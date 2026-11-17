import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

const QUERY = 'cli tool  language:rust  stars:>20000';

// Illustrative results for the example query, sorted by stars like the real search (counts rounded).
const PREVIEW = [
  { name: 'sharkdp/bat', desc: 'A cat(1) clone with wings: syntax highlighting and Git integration.', stars: 53, updated: 'this week' },
  { name: 'BurntSushi/ripgrep', desc: 'Recursively search directories for a regex pattern while respecting your gitignore.', stars: 52, updated: 'this week' },
  { name: 'sharkdp/fd', desc: 'A simple, fast and user-friendly alternative to find.', stars: 37, updated: 'last week' },
];

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Types the example query once, then reveals the results and counts their stars up.
function useLensSequence() {
  const skip = reducedMotion();
  const [typed, setTyped] = useState(skip ? QUERY.length : 0);
  const [progress, setProgress] = useState(skip ? 1 : 0);
  const done = typed >= QUERY.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 500 : 45);
    return () => clearTimeout(t);
  }, [typed, done]);

  useEffect(() => {
    if (!done || progress >= 1) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1100);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  return { text: QUERY.slice(0, typed), done, progress };
}

export function Hero() {
  usePageTitle('Home');
  const { login } = useAuth();
  const { text, done, progress } = useLensSequence();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-14 lg:gap-12 items-center">
        {/* Copy */}
        <div className="max-w-xl">
          <h1 className="text-[2.6rem] leading-[1.05] sm:text-6xl font-extrabold tracking-[-0.035em]">
            Find the repositories worth your time.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-[34ch]">
            Search GitHub by language, stars and activity, then keep the ones you want to come back to.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={login}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-[var(--radius-control)] bg-accent text-on-accent font-semibold hover:bg-accent-hover transition-colors"
            >
              <GithubIcon className="w-5 h-5" />
              Sign in with GitHub
            </button>
            <a
              href="#how-it-works"
              className="px-5 py-3 rounded-[var(--radius-control)] font-semibold text-foreground border border-border hover:bg-surface transition-colors"
            >
              How it works
            </a>
          </div>

          <p className="mt-6 text-sm text-muted">
            No GitHub account?{' '}
            <Link to="/register" className="text-accent font-medium hover:underline underline-offset-4">
              Sign up with email
            </Link>
          </p>
        </div>

        {/* The lens: a live example search */}
        <figure
          aria-label="Example search for popular Rust command-line tools"
          className="relative min-w-0"
        >
          {/* Lens ring */}
          <div
            aria-hidden="true"
            className="absolute -top-16 -left-10 w-48 h-48 rounded-full border-[10px] border-accent/15 pointer-events-none hidden lg:block"
          />

          <div className="relative rounded-[var(--radius-panel)] border border-border bg-surface shadow-[var(--shadow-float)] p-3 sm:p-4">
            <div className="flex items-center gap-3 px-4 h-14 rounded-[var(--radius-row)] border-2 border-accent bg-background">
              <Search className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
              <span className="min-w-0 font-mono text-sm sm:text-base text-foreground whitespace-pre overflow-hidden text-ellipsis">
                {text}
                {!done && <span className="caret text-accent">▍</span>}
              </span>
            </div>

            <ol className="mt-3 space-y-1.5 min-h-[17rem]">
              {!done &&
                PREVIEW.map((repo) => (
                  <li key={repo.name} aria-hidden="true" className="px-4 py-3.5 opacity-60">
                    <div className="h-4 w-40 rounded bg-border" />
                    <div className="mt-2.5 h-3 w-full max-w-sm rounded bg-border/70" />
                    <div className="mt-2.5 h-3 w-28 rounded bg-border/70" />
                  </li>
                ))}
              {done &&
                PREVIEW.map((repo, i) => (
                  <li
                    key={repo.name}
                    className="lens-row group px-4 py-3.5 rounded-[var(--radius-row)] transition-[transform,background-color,box-shadow] duration-200 hover:bg-background hover:scale-[1.02] hover:shadow-[0_0_0_2px_var(--accent)]"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-semibold text-foreground truncate">
                        <span className="text-muted font-normal">{repo.name.split('/')[0]}/</span>
                        {repo.name.split('/')[1]}
                      </span>
                      <span className="flex items-center justify-end gap-1 min-w-[4.5rem] text-signal font-semibold shrink-0">
                        <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                        {(repo.stars * progress).toFixed(1)}k
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted line-clamp-1">{repo.desc}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#dea584' }} />
                        Rust
                      </span>
                      <span>Updated {repo.updated}</span>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </figure>
      </div>
    </section>
  );
}
