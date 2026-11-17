import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { useAuth } from '../contexts/AuthContext';

const AUTHOR_URL = 'https://github.com/Shakiran-Nannyombi';

export function Footer() {
  const { user } = useAuth();
  const links = user
    ? [
        { to: '/dashboard', label: 'Search' },
        { to: '/saved', label: 'Saved' },
        { to: '/analytics', label: 'Analytics' },
        { to: '/about', label: 'About' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/login', label: 'Sign in' },
      ];

  return (
    <footer className="mt-auto border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="md:mr-auto">
          <p className="font-bold tracking-tight text-foreground">Lens+Github</p>
          <p className="text-sm text-muted mt-1">
            Built by{' '}
            <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent underline underline-offset-4 decoration-border">
              Shakiran Nannyombi
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-muted hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="p-2 rounded-[var(--radius-control)] border border-border text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <GithubIcon className="w-[18px] h-[18px]" />
          </a>
          <a
            href="mailto:devkiran256@gmail.com"
            aria-label="Email"
            className="p-2 rounded-[var(--radius-control)] border border-border text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <Mail className="w-[18px] h-[18px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
