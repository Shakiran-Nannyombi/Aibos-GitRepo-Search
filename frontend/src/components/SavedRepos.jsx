import { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { EmptyState } from './EmptyState';
import { SavedRepoCard } from './SavedRepoCard';
import { ConfirmModal } from './ConfirmModal';

export function SavedRepos() {
    usePageTitle('Saved');
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

    const selectClass =
        'px-3 py-2 rounded-[var(--radius-control)] bg-surface border border-border text-foreground text-sm font-medium cursor-pointer focus:outline-none focus:border-accent';

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Saved repositories</h1>
                    <p className="mt-1 text-muted">
                        {savedRepos.length === 0
                            ? 'Nothing saved yet.'
                            : `${savedRepos.length} saved${filteredRepos.length !== savedRepos.length ? `, ${filteredRepos.length} shown` : ''}`}
                    </p>
                </div>

                {savedRepos.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-control)] text-sm font-semibold text-danger border border-border hover:border-danger/50 hover:bg-danger/10 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Remove all
                    </button>
                )}
            </div>

            {savedRepos.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-border">
                    <label className="flex items-center gap-2 text-sm text-muted">
                        Language
                        <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className={selectClass}>
                            <option value="all">All ({savedRepos.length})</option>
                            {languages.map(lang => {
                                const count = savedRepos.filter(r => r.language === lang).length;
                                return <option key={lang} value={lang}>{lang} ({count})</option>;
                            })}
                        </select>
                    </label>

                    <label className="flex items-center gap-2 text-sm text-muted">
                        Sort by
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
                            <option value="recent">Recently updated</option>
                            <option value="stars-desc">Most stars</option>
                            <option value="stars-asc">Fewest stars</option>
                            <option value="forks-desc">Most forks</option>
                            <option value="forks-asc">Fewest forks</option>
                            <option value="name-asc">Name, A to Z</option>
                            <option value="name-desc">Name, Z to A</option>
                        </select>
                    </label>
                </div>
            )}

            {savedRepos.length === 0 ? (
                <div className="py-10 max-w-xl">
                    <p className="text-muted leading-relaxed">
                        Use the bookmark button on any search result to keep it here.
                    </p>
                    <Link
                        to="/dashboard"
                        className="mt-6 inline-flex px-4 py-2.5 rounded-[var(--radius-control)] bg-accent text-on-accent font-semibold hover:bg-accent-hover transition-colors"
                    >
                        Search repositories
                    </Link>
                </div>
            ) : filteredRepos.length === 0 ? (
                <EmptyState type="no-results" message="None of your saved repositories match this language." />
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredRepos.map((repo) => (
                        <li key={repo.id}>
                            <SavedRepoCard repo={repo} onRemove={loadSavedRepos} />
                        </li>
                    ))}
                </ul>
            )}

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmClear}
                title={`Remove all ${savedRepos.length} saved ${savedRepos.length === 1 ? 'repository' : 'repositories'}?`}
                message="They'll be cleared from this browser. This can't be undone."
                confirmText="Remove all"
                cancelText="Keep them"
            />
        </div>
    );
}
