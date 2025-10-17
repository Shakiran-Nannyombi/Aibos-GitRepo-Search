import { useState } from 'react';
import { Navbar } from './navbar';
import { SearchBar } from './SearchBar';
import { SearchFilters } from './SearchFilter';
import { RepoCard } from './RepoCard';
import { EmptyState } from './EmptyState';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';
import { Pagination } from './Pagnition';

export function Dashboard() {
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

    const itemsPerPage = 30;
    const totalPages = Math.min(Math.ceil(totalCount / itemsPerPage), 34); // GitHub API limit

    const handleSearch = async (searchQuery, page = 1) => {
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

            if (filters.language) {
                params.set('language', filters.language);
            }
            if (filters.minStars) {
                params.set('min_stars', filters.minStars.toString());
            }
            if (filters.sort) {
                params.set('sort', filters.sort);
            }
            if (filters.order) {
                params.set('order', filters.order);
            }

            const response = await fetch(`${backendUrl}/api/search?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }

            const data = await response.json();
            setRepositories(data.items);
            setTotalCount(data.total_count);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while searching');
            setRepositories([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        if (query) {
            handleSearch(query, 1);
        }
    };

    const handlePageChange = (page) => {
        handleSearch(query, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1"></div>
                        <div className="flex-1">
                            <SearchBar onSearch={(q) => handleSearch(q, 1)} isLoading={isLoading} />
                        </div>
                        <SearchFilters
                            onFilterChange={handleFilterChange}
                            isOpen={isFilterOpen}
                            onToggle={() => setIsFilterOpen(!isFilterOpen)}
                        />
                    </div>

                    {/* Error Alert */}
                    {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                    {/* Results Info */}
                    {hasSearched && !isLoading && repositories.length > 0 && (
                        <div className="text-sm text-light-muted dark:text-dark-muted">
                            Found {totalCount.toLocaleString()} repositories
                            {query && ` for "${query}"`}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="mt-8">
                    {isLoading ? (
                        <LoadingSpinner message="Searching repositories..." />
                    ) : !hasSearched ? (
                        <EmptyState type="no-search" />
                    ) : repositories.length === 0 ? (
                        <EmptyState type="no-results" />
                    ) : (
                        <>
                            <div className="space-y-4">
                                {repositories.map((repo) => (
                                    <RepoCard key={repo.id} repo={repo} />
                                ))}
                            </div>

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
            </main>
        </div>
    );
}
