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
            className="group relative p-4 rounded-2xl border-2 hover:shadow-2xl hover:scale-[1.02]
                      transition-all duration-300 flex flex-col min-h-[280px]"
            style={{backgroundColor: '#2d1a1f', borderColor: '#4d3a3f'}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Remove Button */}
            <button
                onClick={handleRemove}
                className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300
                          ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{backgroundColor: '#dc2626', color: 'white'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                title="Remove from saved"
            >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Repo Info */}
            <div className="flex flex-col h-full">
                {/* Owner Avatar */}
                <div className="flex items-center gap-2 mb-2">
                    <img
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-800"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
                        {repo.owner.login}
                    </span>
                </div>

                {/* Repo Name */}
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-gray-900 dark:text-gray-100 
                             hover:text-gray-600 dark:hover:text-gray-400
                             transition-colors mb-2 line-clamp-1 text-base leading-tight"
                >
                    {repo.name}
                </a>

                {/* Description */}
                {repo.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 
                                line-clamp-3 mb-auto">
                        {repo.description}
                    </p>
                )}

                {/* Stats and Language */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="font-semibold">{repo.stargazers_count.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <GitFork className="w-3.5 h-3.5" />
                                <span className="font-semibold">{repo.forks_count.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        {/* Language */}
                        {repo.language && (
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: languageColors[repo.language] || '#858585' }}
                                />
                                <span className="text-gray-700 dark:text-gray-300">{repo.language}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* View Link - shows on hover */}
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl
                              bg-blue-600 text-white font-semibold text-xs
                              hover:bg-blue-700
                              transition-all duration-300
                              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                >
                    View on GitHub
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    );
}
