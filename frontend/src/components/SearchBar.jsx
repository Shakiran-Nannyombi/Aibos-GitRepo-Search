import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SearchBar({ onSearch, isLoading, value }) {
    const [query, setQuery] = useState(value ?? '');

    // Lets the parent fill the field, e.g. from an example query.
    useEffect(() => {
        if (value !== undefined) setQuery(value);
    }, [value]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} role="search" className="w-full">
            <div className="relative flex items-center h-14 rounded-[var(--radius-row)] border-2 border-border bg-surface focus-within:border-accent transition-colors">
                <Search className="absolute left-4 w-5 h-5 text-muted pointer-events-none" aria-hidden="true" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search repositories..."
                    aria-label="Search repositories"
                    disabled={isLoading}
                    className="w-full h-full pl-12 pr-36 bg-transparent font-mono text-[15px] text-foreground placeholder:text-muted placeholder:font-sans focus:outline-none disabled:opacity-60"
                />

                <div className="absolute right-2 flex items-center gap-1">
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            aria-label="Clear search"
                            className="p-2 rounded-[var(--radius-control)] text-muted hover:text-foreground hover:bg-background transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="px-4 py-2 rounded-[var(--radius-control)] font-semibold bg-accent text-on-accent hover:bg-accent-hover disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
        </form>
    );
}
