import { Star, GitFork, Trash2 } from 'lucide-react';
import { languageColor } from '../lib/languageColors';

export function SavedRepoCard({ repo, onRemove }) {
    const handleRemove = (e) => {
        e.preventDefault();
        const savedRepos = JSON.parse(localStorage.getItem('saved_repos') || '[]');
        const filtered = savedRepos.filter(r => r.id !== repo.id);
        localStorage.setItem('saved_repos', JSON.stringify(filtered));
        window.dispatchEvent(new Event('repoSaved'));
        if (onRemove) onRemove();
    };

    return (
        <article className="relative h-full flex flex-col p-4 sm:p-5 rounded-[var(--radius-row)] border border-border bg-surface hover:border-muted/60 transition-colors">
            <div className="flex items-center gap-2.5 pr-10">
                <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                    loading="lazy"
                    className="w-6 h-6 rounded-full border border-border"
                />
                <h3 className="min-w-0 text-[16px] font-semibold truncate">
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-accent after:absolute after:inset-0 after:content-['']"
                    >
                        <span className="text-muted font-normal">{repo.owner.login}/</span>
                        {repo.name}
                    </a>
                </h3>
            </div>

            {repo.description && (
                <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">{repo.description}</p>
            )}

            <div className="mt-auto pt-4 flex items-center gap-x-4 gap-y-1 flex-wrap text-sm text-muted">
                {repo.language && (
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />
                        {repo.language}
                    </span>
                )}
                <span className="flex items-center gap-1 text-signal font-semibold" title="Stars">
                    <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                    {repo.stargazers_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-1" title="Forks">
                    <GitFork className="w-4 h-4" aria-hidden="true" />
                    {repo.forks_count.toLocaleString()}
                </span>
            </div>

            <button
                onClick={handleRemove}
                title="Remove from saved"
                aria-label={`Remove ${repo.full_name || repo.name} from saved`}
                className="absolute top-3 right-3 z-10 p-2 rounded-[var(--radius-control)] text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </article>
    );
}
