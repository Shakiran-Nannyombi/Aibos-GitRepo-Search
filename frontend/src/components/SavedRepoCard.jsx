import { Star, GitFork, ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';

const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
};

export function SavedRepoCard({ repo, onRemove }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleRemove = (e) => {
        e.preventDefault();
        const savedRepos = JSON.parse(localStorage.getItem('saved_repos') || '[]');
        const filtered = savedRepos.filter(r => r.id !== repo.id);
        localStorage.setItem('saved_repos', JSON.stringify(filtered));
        window.dispatchEvent(new Event('repoSaved'));
        if (onRemove) onRemove();
    };

    return (
        <div
            className="group relative p-4 rounded-xl border transition-all duration-200 flex flex-col min-h-[250px] bg-card border-border hover:shadow-md hover:border-muted"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Remove Button */}
            <button
                onClick={handleRemove}
                className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-200 shadow-sm
                          ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} bg-red-500 text-white hover:bg-red-600`}
                title="Remove from saved"
            >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Repo Info */}
            <div className="flex flex-col h-full">
                {/* Owner Info */}
                <div className="flex items-center gap-2 mb-3">
                    <img
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        className="w-6 h-6 rounded-full border border-border shadow-sm"
                    />
                    <span className="text-xs text-muted font-medium truncate">
                        {repo.owner.login}
                    </span>
                </div>

                {/* Repo Name */}
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-foreground hover:text-accent transition-colors mb-2 line-clamp-1 text-base leading-tight"
                >
                    {repo.name}
                </a>

                {/* Description */}
                {repo.description && (
                    <p className="text-xs text-muted line-clamp-3 mb-auto leading-relaxed">
                        {repo.description}
                    </p>
                )}

                {/* Stats and Language */}
                <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted">
                            <div className="flex items-center gap-1 hover:text-accent transition-colors">
                                <Star className="w-3.5 h-3.5" />
                                <span className="font-medium">{repo.stargazers_count.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1 hover:text-accent transition-colors">
                                <GitFork className="w-3.5 h-3.5" />
                                <span className="font-medium">{repo.forks_count.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        {/* Language */}
                        {repo.language && (
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: languageColors[repo.language] || 'var(--muted)' }}
                                />
                                <span className="text-muted">{repo.language}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* View Link - shows on hover */}
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                              bg-accent text-white font-semibold text-xs
                              hover:bg-accent-hover
                              transition-all duration-200 shadow-sm
                              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
                >
                    View Repo
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    );
}
