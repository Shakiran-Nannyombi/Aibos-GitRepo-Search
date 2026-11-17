import { SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'Ruby',
    'PHP', 'C', 'C++', 'C#', 'Swift', 'Kotlin', 'Dart', 'Shell', 'HTML', 'CSS'
];

const sortOptions = [
    { value: 'stars', label: 'Stars' },
    { value: 'forks', label: 'Forks' },
    { value: 'updated', label: 'Last updated' },
];

const DEFAULTS = { language: '', minStars: undefined, sort: 'stars', order: 'desc' };

const fieldClass =
    'w-full px-3 py-2.5 rounded-[var(--radius-control)] border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors';

export function SearchFilters({ onFilterChange, isOpen, onToggle }) {
    const [filters, setFilters] = useState(DEFAULTS);
    const [applied, setApplied] = useState(DEFAULTS);

    const activeCount = (applied.language ? 1 : 0) + (applied.minStars ? 1 : 0);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === 'Escape' && onToggle();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onToggle]);

    const handleApply = () => {
        setApplied(filters);
        onFilterChange(filters);
        onToggle();
    };

    const handleReset = () => {
        setFilters(DEFAULTS);
        setApplied(DEFAULTS);
        onFilterChange(DEFAULTS);
    };

    return (
        <>
            <button
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls="search-filters"
                className="flex items-center gap-2 px-4 rounded-[var(--radius-row)] border-2 border-border bg-surface font-semibold text-foreground hover:border-muted transition-colors"
            >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeCount > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-accent text-on-accent text-xs grid place-items-center tabular-nums">
                        {activeCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onToggle} />
                    <aside
                        id="search-filters"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="filters-title"
                        className="fixed right-0 top-0 h-full w-full sm:w-96 z-[61] overflow-y-auto bg-background border-l border-border shadow-[var(--shadow-float)] flex flex-col"
                    >
                        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
                            <h2 id="filters-title" className="text-lg font-bold">Filters</h2>
                            <button
                                onClick={onToggle}
                                aria-label="Close filters"
                                className="p-2 -mr-2 rounded-[var(--radius-control)] text-muted hover:text-foreground hover:bg-surface transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 flex-1">
                            <div>
                                <label htmlFor="filter-language" className="block text-sm font-medium mb-1.5">Language</label>
                                <select
                                    id="filter-language"
                                    value={filters.language}
                                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                                    className={`${fieldClass} cursor-pointer`}
                                >
                                    <option value="">Any language</option>
                                    {languages.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="filter-stars" className="block text-sm font-medium mb-1.5">Minimum stars</label>
                                <input
                                    id="filter-stars"
                                    type="number"
                                    min="0"
                                    inputMode="numeric"
                                    value={filters.minStars || ''}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            minStars: e.target.value ? parseInt(e.target.value, 10) : undefined,
                                        })
                                    }
                                    placeholder="e.g. 100"
                                    className={`${fieldClass} tabular-nums`}
                                />
                            </div>

                            <div>
                                <label htmlFor="filter-sort" className="block text-sm font-medium mb-1.5">Sort by</label>
                                <select
                                    id="filter-sort"
                                    value={filters.sort}
                                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                    className={`${fieldClass} cursor-pointer`}
                                >
                                    {sortOptions.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>

                            <fieldset>
                                <legend className="block text-sm font-medium mb-1.5">Order</legend>
                                <div className="grid grid-cols-2 p-1 rounded-[var(--radius-control)] border border-border bg-surface">
                                    {[
                                        { value: 'desc', label: 'High to low' },
                                        { value: 'asc', label: 'Low to high' },
                                    ].map((o) => (
                                        <button
                                            key={o.value}
                                            type="button"
                                            aria-pressed={filters.order === o.value}
                                            onClick={() => setFilters({ ...filters, order: o.value })}
                                            className={`py-2 rounded-[4px] text-sm font-medium transition-colors ${
                                                filters.order === o.value
                                                    ? 'bg-foreground text-background'
                                                    : 'text-muted hover:text-foreground'
                                            }`}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-border">
                            <button
                                onClick={handleReset}
                                className="flex-1 py-2.5 rounded-[var(--radius-control)] font-semibold border border-border text-foreground hover:bg-surface transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 py-2.5 rounded-[var(--radius-control)] font-semibold bg-accent text-on-accent hover:bg-accent-hover transition-colors"
                            >
                                Apply filters
                            </button>
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}
