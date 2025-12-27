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
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border font-semibold
                         transition-all duration-200 shadow-sm bg-header text-foreground hover:bg-border/30"
            >
                <Filter className="w-4 h-4" />
                Filters
            </button>

            {/* Sidebar */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
                        onClick={onToggle}
                    />
                    <div className="fixed right-0 top-0 h-full w-96 border-l z-50 shadow-2xl overflow-y-auto bg-background border-border">
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-border">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                    <Filter className="w-5 h-5 text-muted" />
                                    Search Filters
                                </h2>
                                <button
                                    onClick={onToggle}
                                    className="p-2 hover:bg-header rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted hover:text-foreground" />
                                </button>
                            </div>

                            {/* Language Filter */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-foreground">
                                    Language
                                </label>
                                <select
                                    value={filters.language}
                                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-header text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer"
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
                                <label className="block text-sm font-semibold text-foreground">
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
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-header text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                />
                            </div>

                            {/* Sort By */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-foreground">
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
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-header text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all cursor-pointer"
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
                                <label className="block text-sm font-semibold text-foreground">
                                    Order
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setFilters({ ...filters, order: 'desc' })}
                                        className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all border ${
                                            filters.order === 'desc'
                                                ? 'bg-foreground text-background border-foreground'
                                                : 'bg-header text-foreground border-border hover:border-muted'
                                        }`}
                                    >
                                        Descending
                                    </button>
                                    <button
                                        onClick={() => setFilters({ ...filters, order: 'asc' })}
                                        className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all border ${
                                            filters.order === 'asc'
                                                ? 'bg-foreground text-background border-foreground'
                                                : 'bg-header text-foreground border-border hover:border-muted'
                                        }`}
                                    >
                                        Ascending
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-6 border-t border-border">
                                <button 
                                    onClick={handleReset} 
                                    className="flex-1 py-2 px-4 rounded-lg font-semibold text-sm bg-header text-foreground border border-border hover:bg-border/30 transition-all"
                                >
                                    Reset
                                </button>
                                <button 
                                    onClick={handleApply} 
                                    className="flex-1 py-2 px-4 rounded-lg font-semibold text-sm bg-accent text-white hover:bg-accent-hover transition-all shadow-sm"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
