import { Filter, X } from 'lucide-react';
import { useState } from 'react';

const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'Ruby', 
    'PHP', 'C', 'C++', 'C#', 'Swift', 'Kotlin', 'Dart', 'Shell', 'HTML', 'CSS'
];

const sortOptions = [
    { value: 'stars', label: 'Most Stars' },
    { value: 'forks', label: 'Most Forks' },
    { value: 'updated', label: 'Recently Updated' },
];

export function SearchFilters({ onFilterChange, isOpen, onToggle }) {
    const [filters, setFilters] = useState({
        language: '',
        minStars: undefined,
        sort: 'stars',
        order: 'desc',
    });

    const handleApply = () => {
        onFilterChange(filters);
        onToggle();
    };

    const handleReset = () => {
        const resetFilters = {
            language: '',
            minStars: undefined,
            sort: 'stars',
            order: 'desc',
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="btn-secondary flex items-center gap-2"
            >
                <Filter className="w-4 h-4" />
                Filters
            </button>

            {/* Sidebar */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={onToggle}
                    />
                    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-dark-bg border-l border-light-border dark:border-dark-border z-50 shadow-xl overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filters
                                </h2>
                                <button
                                    onClick={onToggle}
                                    className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Language Filter */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold">Language</label>
                                <select
                                    value={filters.language}
                                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md 
                                                     bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 
                                                     focus:ring-light-accent dark:focus:ring-dark-accent"
                                >
                                    <option value="">All Languages</option>
                                    {languages.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Min Stars Filter */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold">Minimum Stars</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={filters.minStars || ''}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            minStars: e.target.value ? parseInt(e.target.value, 10) : undefined,
                                        })
                                    }
                                    placeholder="e.g., 100"
                                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md 
                                                     bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 
                                                     focus:ring-light-accent dark:focus:ring-dark-accent"
                                />
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold">Sort By</label>
                                <select
                                    value={filters.sort}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            sort: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md 
                                                     bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 
                                                     focus:ring-light-accent dark:focus:ring-dark-accent"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Order */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold">Order</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilters({ ...filters, order: 'desc' })}
                                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                                            filters.order === 'desc'
                                                ? 'bg-light-accent dark:bg-dark-accent text-white'
                                                : 'btn-secondary'
                                        }`}
                                    >
                                        Descending
                                    </button>
                                    <button
                                        onClick={() => setFilters({ ...filters, order: 'asc' })}
                                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                                            filters.order === 'asc'
                                                ? 'bg-light-accent dark:bg-dark-accent text-white'
                                                : 'btn-secondary'
                                        }`}
                                    >
                                        Ascending
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-light-border dark:border-dark-border">
                                <button onClick={handleReset} className="flex-1 btn-secondary">
                                    Reset
                                </button>
                                <button onClick={handleApply} className="flex-1 btn-primary">
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
