import { Star, GitFork, ExternalLink, Plus, Check } from 'lucide-react';
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

export function RepoCard({ repo }) {
    const [isSaved, setIsSaved] = useState(() => {
        const savedRepos = JSON.parse(localStorage.getItem('saved_repos') || '[]');
        return savedRepos.some(r => r.id === repo.id);
    });

    const handleSave = (e) => {
        e.preventDefault();
        const savedRepos = JSON.parse(localStorage.getItem('saved_repos') || '[]');
        
        if (isSaved) {
            // Remove from saved
            const filtered = savedRepos.filter(r => r.id !== repo.id);
            localStorage.setItem('saved_repos', JSON.stringify(filtered));
            setIsSaved(false);
        } else {
            // Add to saved
            savedRepos.push(repo);
            localStorage.setItem('saved_repos', JSON.stringify(savedRepos));
            setIsSaved(true);
        }
        
        // Trigger custom event for SavedRepos component
        window.dispatchEvent(new Event('repoSaved'));
    };

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
        <div className="group relative p-6 rounded-xl border border-border bg-card hover:shadow-md
                      transition-all duration-200"
        >
            {/* Save Button */}
            <button
                onClick={handleSave}
                className={`absolute top-4 right-4 p-2 rounded-lg 
                          border transition-all duration-200 z-10
                          ${isSaved 
                            ? 'bg-green-600 border-green-600 text-white hover:bg-green-700' 
                            : 'bg-header border-border text-foreground hover:bg-border/50'
                          }`}
                title={isSaved ? 'Remove from saved' : 'Save repository'}
            >
                {isSaved ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                    <Plus className="w-4 h-4" strokeWidth={3} />
                )}
            </button>

            <div className="flex items-start justify-between gap-4 pr-12">
                <div className="flex-1 min-w-0">
                    {/* Repo Name */}
                    <div className="flex items-center gap-2 mb-2">
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-semibold text-accent 
                                     hover:underline truncate transition-colors"
                        >
                            {repo.full_name}
                        </a>
                        <ExternalLink className="w-4 h-4 flex-shrink-0 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Description */}
                    {repo.description && (
                        <p className="text-muted mb-4 line-clamp-2 text-sm leading-relaxed">
                            {repo.description}
                        </p>
                    )}

                    {/* Stats and Language */}
                    <div className="flex items-center gap-6 flex-wrap text-xs text-muted">
                        {repo.language && (
                            <div className="flex items-center gap-1.5 font-medium">
                                <span
                                    className="w-3 h-3 rounded-full border border-border/50"
                                    style={{ backgroundColor: languageColors[repo.language] || '#858585' }}
                                />
                                <span>{repo.language}</span>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 hover:text-accent transition-colors">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">{repo.stargazers_count.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 hover:text-accent transition-colors">
                            <GitFork className="w-4 h-4" />
                            <span className="font-medium">{repo.forks_count.toLocaleString()}</span>
                        </div>
                        
                        <span className="opacity-70">
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
                        className="w-12 h-12 rounded-lg border border-border shadow-sm
                                 hover:border-accent transition-all duration-200"
                    />
                </a>
            </div>
        </div>
    );
}
