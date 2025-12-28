import { useState, useRef, useEffect } from 'react';
import { Navbar } from './navbar';
import { SearchBar } from './SearchBar';
import { SearchFilters } from './SearchFilter';
import { RepoCard } from './RepoCard';
import { EmptyState } from './EmptyState';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';
import { Pagination } from './Pagination';
import { usePageTitle } from '../hooks/usePageTitle';

import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
    usePageTitle('Dashboard');
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
        <div ref={containerRef} className="flex-grow relative overflow-hidden bg-background text-foreground">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    color: 'currentColor'
                }} />
            </div>

            {/* Mouse glow effect - more subtle for GitHub theme */}
            <div
                className="absolute pointer-events-none w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-500"
                style={{
                    background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                    left: mousePosition.x - 192,
                    top: mousePosition.y - 192,
                }}
            />

            <div className="relative z-10">
                <Navbar isHidden={isFilterOpen} />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
                
                {/* Connection Banner for Local Users */}
                {user && !user.github_connected && (
                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-foreground">Connect your GitHub profile</h3>
                                <p className="text-muted text-sm">Unlock personalized searches and higher rate limits by linking your account.</p>
                            </div>
                        </div>
                        <button 
                            onClick={connectGithub}
                            className="px-6 py-2.5 rounded-full bg-accent text-white font-bold hover:bg-accent-hover transition-all shadow-lg active:scale-95"
                        >
                            Connect Now
                        </button>
                    </div>
                )}

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
                            <div className="flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-md border border-border bg-header shadow-sm">
                                <span className="text-sm font-semibold text-foreground">
                                    {totalCount.toLocaleString()}
                                </span>
                                <span className="text-sm text-muted">
                                    repositories found
                                    {query && <span className="font-medium text-foreground"> for "{query}"</span>}
                                </span>
                            </div>

                            {/* Quick Sort */}
                            <select
                                value={quickSort}
                                onChange={(e) => handleQuickSort(e.target.value)}
                                className="px-4 py-2 rounded-xl font-medium text-sm focus:outline-none transition-all cursor-pointer bg-header border border-border text-foreground hover:bg-border/50"
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
