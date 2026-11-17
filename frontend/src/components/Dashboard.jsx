import { useState } from 'react';
import { Github } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { SearchFilters } from './SearchFilter';
import { RepoCard } from './RepoCard';
import { EmptyState } from './EmptyState';
import { ErrorAlert } from './ErrorAlert';
import { Pagination } from './Pagination';
import { usePageTitle } from '../hooks/usePageTitle';

import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
    usePageTitle('Search');
    const { user, connectGithub } = useAuth();
    const [query, setQuery] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        sort: 'stars',
        order: 'desc',
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [quickSort, setQuickSort] = useState('stars-desc');
    const [inputValue, setInputValue] = useState(undefined);

    const itemsPerPage = 30;
    const totalPages = Math.min(Math.ceil(totalCount / itemsPerPage), 34); // GitHub API limit

    const handleSearch = async (searchQuery, page = 1, activeFilters = filters) => {
        setIsLoading(true);
        setError(null);
        setQuery(searchQuery);
        setHasSearched(true);
        setCurrentPage(page);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
            const token = localStorage.getItem('github_token');

            // Build query params
            const params = new URLSearchParams({
                q: searchQuery,
                page: page.toString(),
                per_page: itemsPerPage.toString(),
            });

            if (activeFilters.language) {
                params.set('language', activeFilters.language);
            }
            if (activeFilters.minStars) {
                params.set('min_stars', activeFilters.minStars.toString());
            }
            if (activeFilters.sort) {
                params.set('sort', activeFilters.sort);
            }
            if (activeFilters.order) {
                params.set('order', activeFilters.order);
            }

            const response = await fetch(`${backendUrl}/api/search?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(
                    response.status === 403 || response.status === 429
                        ? 'GitHub’s search rate limit was reached. Wait a minute, then search again.'
                        : `Search failed (error ${response.status}). Try again, or simplify the query.`
                );
            }

            const data = await response.json();
            setRepositories(data.items);
            setTotalCount(data.total_count);
        } catch (err) {
            setError(
                err instanceof TypeError
                    ? 'Couldn’t reach the search server. Check your connection and try again.'
                    : err.message
            );
            setRepositories([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        if (query) {
            handleSearch(query, 1, newFilters);
        }
    };

    const handleQuickSort = (sortValue) => {
        setQuickSort(sortValue);
        const [sortField, order] = sortValue.split('-');
        const newFilters = { ...filters, sort: sortField, order };
        setFilters(newFilters);
        if (query) {
            handleSearch(query, 1, newFilters);
        }
    };

    const handlePageChange = (page) => {
        handleSearch(query, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const runExample = (q) => {
        setInputValue(q);
        handleSearch(q, 1);
    };

    return (
        <div className="space-y-6">
            {/* Connection banner for email accounts */}
            {user && !user.github_connected && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-[var(--radius-row)] border border-border bg-surface">
                    <Github className="w-6 h-6 text-foreground shrink-0" aria-hidden="true" />
                    <div className="flex-1">
                        <p className="font-semibold text-foreground">Connect your GitHub account</p>
                        <p className="text-sm text-muted">Connected accounts get higher search rate limits and personal analytics.</p>
                    </div>
                    <button
                        onClick={connectGithub}
                        className="px-4 py-2 rounded-[var(--radius-control)] bg-accent text-on-accent font-semibold hover:bg-accent-hover transition-colors"
                    >
                        Connect GitHub
                    </button>
                </div>
            )}

            <div>
                <h1 className="sr-only">Search repositories</h1>
                <div className="flex items-stretch gap-2">
                    <div className="flex-1 min-w-0">
                        <SearchBar onSearch={(q) => handleSearch(q, 1)} isLoading={isLoading} value={inputValue} />
                    </div>
                    <SearchFilters
                        onFilterChange={handleFilterChange}
                        isOpen={isFilterOpen}
                        onToggle={() => setIsFilterOpen(!isFilterOpen)}
                    />
                </div>
            </div>

            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

            {hasSearched && !isLoading && repositories.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                    <p className="text-muted">
                        <span className="font-semibold text-foreground tabular-nums">{totalCount.toLocaleString()}</span>
                        {' '}repositories for{' '}
                        <code className="font-mono text-[0.92em] text-foreground">{query}</code>
                    </p>

                    <label className="flex items-center gap-2 text-sm text-muted">
                        Sort by
                        <select
                            value={quickSort}
                            onChange={(e) => handleQuickSort(e.target.value)}
                            className="px-3 py-1.5 rounded-[var(--radius-control)] text-sm font-medium cursor-pointer bg-surface border border-border text-foreground focus:outline-none focus:border-accent"
                        >
                            <option value="stars-desc">Most stars</option>
                            <option value="stars-asc">Fewest stars</option>
                            <option value="forks-desc">Most forks</option>
                            <option value="forks-asc">Fewest forks</option>
                            <option value="updated-desc">Recently updated</option>
                        </select>
                    </label>
                </div>
            )}

            <div>
                {isLoading ? (
                    <ResultsSkeleton />
                ) : !hasSearched ? (
                    <EmptyState type="no-search" onExample={runExample} />
                ) : repositories.length === 0 ? (
                    error ? null : <EmptyState type="no-results" onExample={runExample} />
                ) : (
                    <>
                        <ul className="space-y-2">
                            {repositories.map((repo) => (
                                <li key={repo.id}>
                                    <RepoCard repo={repo} />
                                </li>
                            ))}
                        </ul>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function ResultsSkeleton() {
    return (
        <ul className="space-y-2" aria-busy="true" aria-label="Searching repositories">
            {[0, 1, 2, 3].map((i) => (
                <li key={i} className="p-5 rounded-[var(--radius-row)] border border-border bg-surface">
                    <div className="flex items-center gap-3">
                        <div className="skeleton w-6 h-6 rounded-full" />
                        <div className="skeleton h-4 w-56" />
                    </div>
                    <div className="skeleton h-3 w-full max-w-xl mt-4" />
                    <div className="skeleton h-3 w-40 mt-4" />
                </li>
            ))}
        </ul>
    );
}
