import { Star, GitFork, Bookmark, BookmarkCheck } from 'lucide-react';
import { useState } from 'react';
import { languageColor } from '../lib/languageColors';
import { Avatar } from './Avatar';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    const plural = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'} ago`;
    if (diffDays < 365) return plural(Math.floor(diffDays / 30), 'month');
    return plural(Math.floor(diffDays / 365), 'year');
};

export function RepoCard({ repo }) {
    const [isSaved, setIsSaved] = useState(() => {
        const savedRepos = JSON.parse(localStorage.getItem('saved_repos') || '[]');
        return savedRepos.some(r => r.id === repo.id);
    });

    const handleSave = (e) => {
        e.preventDefault();
        const savedRepos = JSON.parse(localStorage.getItem('saved_repos') || '[]');

        if (isSaved) {
            const filtered = savedRepos.filter(r => r.id !== repo.id);
            localStorage.setItem('saved_repos', JSON.stringify(filtered));
            setIsSaved(false);
        } else {
            savedRepos.push(repo);
            localStorage.setItem('saved_repos', JSON.stringify(savedRepos));
            setIsSaved(true);
        }

        // Lets SavedRepos refresh without a page reload.
        window.dispatchEvent(new Event('repoSaved'));
    };

    return (
        <article className="group relative flex gap-4 p-4 sm:p-5 rounded-[var(--radius-row)] border border-border bg-surface hover:border-muted/60 transition-colors">
            <a
                href={`https://github.com/${repo.owner.login}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${repo.owner.login} on GitHub`}
                className="relative z-10 shrink-0 self-start rounded-[var(--radius-control)]"
            >
                <Avatar
                    src={repo.owner.avatar_url}
                    name={repo.owner.login}
                    className="w-10 h-10 rounded-[var(--radius-control)] border border-border"
                />
            </a>

            <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-semibold leading-snug pr-12">
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-accent break-words after:absolute after:inset-0 after:content-['']"
                    >
                        {repo.full_name}
                    </a>
                </h3>

                {repo.description && (
                    <p className="mt-1 text-muted text-[15px] leading-relaxed line-clamp-2 max-w-[75ch]">
                        {repo.description}
                    </p>
                )}

                <div className="mt-3 flex items-center gap-x-5 gap-y-1 flex-wrap text-sm text-muted">
                    {repo.language && (
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />
                            <span>{repo.language}</span>
                        </span>
                    )}

                    <span className="flex items-center gap-1 text-signal font-semibold" title="Stars">
                        <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                        <span>{repo.stargazers_count.toLocaleString()}</span>
                    </span>

                    <span className="flex items-center gap-1" title="Forks">
                        <GitFork className="w-4 h-4" aria-hidden="true" />
                        <span>{repo.forks_count.toLocaleString()}</span>
                    </span>

                    <span>Updated {formatDate(repo.updated_at)}</span>
                </div>
            </div>

            <button
                onClick={handleSave}
                aria-pressed={isSaved}
                title={isSaved ? 'Remove from saved' : 'Save repository'}
                className={`absolute top-3.5 right-3.5 z-10 p-2 rounded-[var(--radius-control)] border transition-colors ${
                    isSaved
                        ? 'bg-accent border-accent text-on-accent hover:bg-accent-hover'
                        : 'bg-surface border-border text-muted hover:text-foreground hover:border-muted'
                }`}
            >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span className="sr-only">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
        </article>
    );
}
