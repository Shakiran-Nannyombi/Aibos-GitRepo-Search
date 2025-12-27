import { useState, useEffect, useCallback } from 'react';
import { Bookmark, Trash2, Filter as FilterIcon } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { SavedRepoCard } from './SavedRepoCard';
import { ConfirmModal } from './ConfirmModal';

export function SavedRepos() {
    const [savedRepos, setSavedRepos] = useState([]);
    const [filteredRepos, setFilteredRepos] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const loadSavedRepos = useCallback(() => {
        const repos = JSON.parse(localStorage.getItem('saved_repos') || '[]');
        setSavedRepos(repos);
    }, []);

    useEffect(() => {
        loadSavedRepos();
        
        // Listen for storage changes
        const handleStorageChange = () => {
            loadSavedRepos();
        };
        
        window.addEventListener('storage', handleStorageChange);
        // Also listen for custom event when repos are saved
        window.addEventListener('repoSaved', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('repoSaved', handleStorageChange);
        };
    }, [loadSavedRepos]);

    const applyFilters = useCallback(() => {
        let filtered = [...savedRepos];

        // Filter by language
        if (selectedLanguage !== 'all') {
            filtered = filtered.filter(repo => repo.language === selectedLanguage);
        }

        // Sort
        if (sortBy === 'stars-desc') {
            filtered.sort((a, b) => b.stargazers_count - a.stargazers_count);
        } else if (sortBy === 'stars-asc') {
            filtered.sort((a, b) => a.stargazers_count - b.stargazers_count);
        } else if (sortBy === 'forks-desc') {
            filtered.sort((a, b) => b.forks_count - a.forks_count);
        } else if (sortBy === 'forks-asc') {
            filtered.sort((a, b) => a.forks_count - b.forks_count);
        } else if (sortBy === 'name-asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'name-desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        }

        setFilteredRepos(filtered);
    }, [savedRepos, selectedLanguage, sortBy]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    // Get unique languages from saved repos
    const languages = Array.from(new Set(savedRepos.map(repo => repo.language).filter(Boolean))).sort();

    const clearAll = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmClear = () => {
        localStorage.setItem('saved_repos', '[]');
        setSavedRepos([]);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Bookmark className="w-6 h-6 text-foreground" />
                    <h2 className="text-2xl font-bold text-foreground">
                        Saved Repositories
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-header border border-border text-foreground text-sm font-semibold">
                        {filteredRepos.length}
                    </span>
                </div>
                
                {savedRepos.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg
                                 bg-red-600 text-white font-semibold
                                 hover:bg-red-700 transition-all shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Filters */}
            {savedRepos.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl 
                              bg-header border border-border shadow-sm">
                    <FilterIcon className="w-5 h-5 text-muted" />
                    
                    {/* Language Filter */}
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-background 
                                 border border-border
                                 text-foreground font-medium text-sm
                                 focus:outline-none focus:border-muted
                                 transition-all cursor-pointer"
                    >
                        <option value="all">All Languages ({savedRepos.length})</option>
                        {languages.map(lang => {
                            const count = savedRepos.filter(r => r.language === lang).length;
                            return <option key={lang} value={lang}>{lang} ({count})</option>;
                        })}
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-background 
                                 border border-border
                                 text-foreground font-medium text-sm
                                 focus:outline-none focus:border-muted
                                 transition-all cursor-pointer"
                    >
                        <option value="recent">Recently Updated</option>
                        <option value="stars-desc">Stars (High to Low)</option>
                        <option value="stars-asc">Stars (Low to High)</option>
                        <option value="forks-desc">Forks (High to Low)</option>
                        <option value="forks-asc">Forks (Low to High)</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                    </select>
                </div>
            )}

            {/* Repos Grid */}
            {savedRepos.length === 0 ? (
                <div className="py-12">
                    <EmptyState 
                        type="no-results" 
                        message="You haven't saved any repositories yet. Click the + button on any repository card to save it here!"
                    />
                </div>
            ) : filteredRepos.length === 0 ? (
                <div className="py-12">
                    <EmptyState 
                        type="no-results" 
                        message="No repositories match the selected filters."
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredRepos.map((repo) => (
                        <SavedRepoCard key={repo.id} repo={repo} onRemove={loadSavedRepos} />
                    ))}
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmClear}
                title="Clear All Repositories?"
                message={`Are you sure you want to remove all ${savedRepos.length} saved ${savedRepos.length === 1 ? 'repository' : 'repositories'}? This action cannot be undone.`}
                confirmText="Clear All"
                cancelText="Cancel"
            />
        </div>
    );
}
