import { useState, useRef, useEffect } from 'react';
import { Navbar } from './navbar';
import { SearchBar } from './SearchBar';
import { SearchFilters } from './SearchFilter';
import { RepoCard } from './RepoCard';
import { EmptyState } from './EmptyState';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';
import { Pagination } from './Pagnition';
import { QuickActions } from './QuickActions';

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
    const [quickSort, setQuickSort] = useState('stars-desc');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Mouse tracking for interactive effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            return () => container.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

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

    const handleQuickSort = (sortValue) => {
        setQuickSort(sortValue);
        const [sortField, order] = sortValue.split('-');
        const newFilters = { ...filters, sort: sortField, order };
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
        <div ref={containerRef} className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    color: 'currentColor'
                }} />
            </div>

            {/* Mouse glow effect */}
            <div
                className="absolute pointer-events-none w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-500"
                style={{
                    background: 'radial-gradient(circle, rgba(96, 165, 250, 0.5) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 70%)',
                    left: mousePosition.x - 192,
                    top: mousePosition.y - 192,
                }}
            />

            <div className="relative z-10">
                <Navbar noBorder={true} />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
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

                    {/* Results Info and Quick Sort */}
                    {hasSearched && !isLoading && repositories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-full 
                                          bg-blue-50/30 dark:bg-purple-950/20 backdrop-blur-md 
                                          border-2 border-blue-200/30 dark:border-purple-800/30">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {totalCount.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    repositories found
                                    {query && <span className="font-medium text-gray-800 dark:text-gray-200"> for "{query}"</span>}
                                </span>
                            </div>

                            {/* Quick Sort */}
                            <select
                                value={quickSort}
                                onChange={(e) => handleQuickSort(e.target.value)}
                                className="px-4 py-2 rounded-xl bg-white dark:bg-black 
                                         border-2 border-blue-200/30 dark:border-purple-800/30
                                         text-gray-900 dark:text-gray-100 font-medium text-sm
                                         focus:outline-none focus:border-blue-400 dark:focus:border-purple-400
                                         transition-all cursor-pointer"
                            >
                                <option value="stars-desc">Stars (High to Low)</option>
                                <option value="stars-asc">Stars (Low to High)</option>
                                <option value="forks-desc">Forks (High to Low)</option>
                                <option value="forks-asc">Forks (Low to High)</option>
                                <option value="updated-desc">Recently Updated</option>
                            </select>
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
        </div>
    );
}
