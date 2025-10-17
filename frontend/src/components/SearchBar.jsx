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
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-muted dark:text-dark-muted" />
                
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search repositories..."
                    disabled={isLoading}
                    className="w-full pl-12 pr-24 py-4 text-lg border border-light-border dark:border-dark-border 
                                     rounded-lg bg-white dark:bg-dark-bg
                                     focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent 
                                     focus:border-transparent transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-md transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
        </form>
    );
}
