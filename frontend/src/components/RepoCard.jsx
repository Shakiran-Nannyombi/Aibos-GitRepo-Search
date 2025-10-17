import { Star, GitFork, ExternalLink } from 'lucide-react';

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

export function RepoCard({ repo }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <div className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Repo Name */}
                    <div className="flex items-center gap-2 mb-2">
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-semibold text-light-accent dark:text-dark-accent hover:underline truncate"
                        >
                            {repo.full_name}
                        </a>
                        <ExternalLink className="w-4 h-4 flex-shrink-0 text-light-muted dark:text-dark-muted" />
                    </div>

                    {/* Description */}
                    {repo.description && (
                        <p className="text-light-muted dark:text-dark-muted mb-4 line-clamp-2">
                            {repo.description}
                        </p>
                    )}

                    {/* Stats and Language */}
                    <div className="flex items-center gap-6 flex-wrap text-sm">
                        {repo.language && (
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: languageColors[repo.language] || '#858585' }}
                                />
                                <span>{repo.language}</span>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 text-light-muted dark:text-dark-muted">
                            <Star className="w-4 h-4" />
                            <span>{repo.stargazers_count.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-light-muted dark:text-dark-muted">
                            <GitFork className="w-4 h-4" />
                            <span>{repo.forks_count.toLocaleString()}</span>
                        </div>
                        
                        <span className="text-light-muted dark:text-dark-muted">
                            Updated {formatDate(repo.updated_at)}
                        </span>
                    </div>
                </div>

                {/* Owner Avatar */}
                <a
                    href={`https://github.com/${repo.owner.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                >
                    <img
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        className="w-12 h-12 rounded-full hover:opacity-80 transition-opacity"
                    />
                </a>
            </div>
        </div>
    );
}
