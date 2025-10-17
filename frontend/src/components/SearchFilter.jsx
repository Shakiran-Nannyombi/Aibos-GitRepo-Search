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
                className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-blue-50/30 dark:bg-purple-950/20 backdrop-blur-md
                         border-2 border-blue-200/30 dark:border-purple-800/30
                         hover:border-blue-400 dark:hover:border-purple-400
                         hover:bg-blue-50/60 dark:hover:bg-purple-950/40
                         text-gray-900 dark:text-gray-100 font-semibold
                         transition-all duration-300 shadow-lg"
            >
                <Filter className="w-4 h-4" />
                Filters
            </button>

            {/* Sidebar */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onToggle}
                    />
                    <div className="fixed right-0 top-0 h-full w-96 
                                  bg-white dark:bg-black 
                                  border-l-2 border-gray-200 dark:border-gray-800 
                                  z-50 shadow-2xl overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200 dark:border-gray-800">
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <Filter className="w-6 h-6" />
                                    Filters
                                </h2>
                                <button
                                    onClick={onToggle}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Language Filter */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                                    Language
                                </label>
                                <select
                                    value={filters.language}
                                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                                    className="w-full px-4 py-3 
                                             border-2 border-gray-200 dark:border-gray-800 
                                             rounded-xl bg-white dark:bg-black 
                                             text-gray-900 dark:text-gray-100
                                             focus:outline-none focus:border-gray-800 dark:focus:border-gray-200
                                             transition-all cursor-pointer"
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
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                                    Minimum Stars
                                </label>
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
                                    className="w-full px-4 py-3 
                                             border-2 border-gray-200 dark:border-gray-800 
                                             rounded-xl bg-white dark:bg-black 
                                             text-gray-900 dark:text-gray-100
                                             placeholder-gray-400
                                             focus:outline-none focus:border-gray-800 dark:focus:border-gray-200
                                             transition-all"
                                />
                            </div>

                            {/* Sort By */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                                    Sort By
                                </label>
                                <select
                                    value={filters.sort}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            sort: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 
                                             border-2 border-gray-200 dark:border-gray-800 
                                             rounded-xl bg-white dark:bg-black 
                                             text-gray-900 dark:text-gray-100
                                             focus:outline-none focus:border-gray-800 dark:focus:border-gray-200
                                             transition-all cursor-pointer"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Order */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                                    Order
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setFilters({ ...filters, order: 'desc' })}
                                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                                            filters.order === 'desc'
                                                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black border-2 border-gray-900 dark:border-gray-100'
                                                : 'bg-white dark:bg-black text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-800 dark:hover:border-gray-200'
                                        }`}
                                    >
                                        Descending
                                    </button>
                                    <button
                                        onClick={() => setFilters({ ...filters, order: 'asc' })}
                                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                                            filters.order === 'asc'
                                                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black border-2 border-gray-900 dark:border-gray-100'
                                                : 'bg-white dark:bg-black text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-800 dark:hover:border-gray-200'
                                        }`}
                                    >
                                        Ascending
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-6 border-t-2 border-gray-200 dark:border-gray-800">
                                <button 
                                    onClick={handleReset} 
                                    className="flex-1 py-3 px-4 rounded-xl font-semibold
                                             bg-white dark:bg-black text-gray-900 dark:text-gray-100
                                             border-2 border-gray-200 dark:border-gray-800
                                             hover:border-gray-800 dark:hover:border-gray-200
                                             transition-all"
                                >
                                    Reset
                                </button>
                                <button 
                                    onClick={handleApply} 
                                    className="flex-1 py-3 px-4 rounded-xl font-semibold
                                             bg-gray-900 dark:bg-gray-100 text-white dark:text-black
                                             hover:bg-black dark:hover:bg-white
                                             transition-all shadow-lg"
                                >
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
