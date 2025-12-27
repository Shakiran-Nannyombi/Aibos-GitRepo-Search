import { Search, X } from 'lucide-react';
import { useState } from 'react';

export function SearchBar({ onSearch, isLoading }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-muted group-focus-within:text-accent" />
                
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search repositories..."
                    disabled={isLoading}
                    className="w-full pl-12 pr-32 py-4 text-lg rounded-full focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-border bg-header text-foreground focus:border-accent hover:border-muted"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-2 rounded-full transition-colors hover:bg-border/30"
                        >
                            <X className="w-4 h-4 text-muted" />
                        </button>
                    )}
                    
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="px-6 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-accent text-white hover:bg-accent-hover"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
        </form>
    );
}
