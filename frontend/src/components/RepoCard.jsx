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
        <div className="group relative p-6 rounded-2xl border-2 hover:shadow-2xl hover:scale-[1.01]
                      transition-all duration-300"
             style={{backgroundColor: '#1a0f11', borderColor: '#3d2a2f'}}>
            {/* Save Button */}
            <button
                onClick={handleSave}
                className={`absolute top-4 right-4 p-2 rounded-full 
                          border-2 transition-all duration-300 z-10
                          ${isSaved 
                            ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' 
                            : 'bg-white dark:bg-black border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                title={isSaved ? 'Remove from saved' : 'Save repository'}
            >
                {isSaved ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                    <Plus className="w-5 h-5" strokeWidth={3} />
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
                            className="text-xl font-bold text-gray-900 dark:text-gray-100 
                                     hover:text-black dark:hover:text-white
                                     group-hover:underline truncate transition-colors"
                        >
                            {repo.full_name}
                        </a>
                        <ExternalLink className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400 
                                               group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
                    </div>

                    {/* Description */}
                    {repo.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 
                                    group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                            {repo.description}
                        </p>
                    )}

                    {/* Stats and Language */}
                    <div className="flex items-center gap-6 flex-wrap text-sm">
                        {repo.language && (
                            <div className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                                <span
                                    className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-black"
                                    style={{ backgroundColor: languageColors[repo.language] || '#858585' }}
                                />
                                <span>{repo.language}</span>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 
                                      group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">{repo.stargazers_count.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400
                                      group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                            <GitFork className="w-4 h-4" />
                            <span className="font-semibold">{repo.forks_count.toLocaleString()}</span>
                        </div>
                        
                        <span className="text-gray-500 dark:text-gray-500 text-xs">
                            Updated {formatDate(repo.updated_at)}
                        </span>
                    </div>
                </div>

                {/* Owner Avatar */}
                <a
                    href={`https://github.com/${repo.owner.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 group/avatar"
                >
                    <img
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-800
                                 group-hover/avatar:border-gray-800 dark:group-hover/avatar:border-gray-200
                                 group-hover/avatar:scale-110 transition-all duration-300 shadow-lg"
                    />
                </a>
            </div>
        </div>
    );
}
