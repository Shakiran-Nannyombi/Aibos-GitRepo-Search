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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 transition-colors group-focus-within:text-gray-800 dark:group-focus-within:text-gray-200" />
                
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search repositories..."
                    disabled={isLoading}
                    className="w-full pl-12 pr-32 py-4 text-lg 
                             border-2 border-blue-200/30 dark:border-purple-800/30 
                             rounded-full bg-blue-50/30 dark:bg-purple-950/20 backdrop-blur-md
                             text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                             focus:outline-none focus:border-blue-400 dark:focus:border-purple-400
                             focus:bg-blue-50/60 dark:focus:bg-purple-950/40
                             transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-lg hover:shadow-xl"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    )}
                    
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="px-6 py-2 rounded-full bg-gray-900 dark:bg-gray-100 
                                 text-white dark:text-black font-semibold
                                 hover:bg-black dark:hover:bg-white 
                                 transition-all duration-300 shadow-lg
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 disabled:hover:bg-gray-900 dark:disabled:hover:bg-gray-100"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
        </form>
    );
}
