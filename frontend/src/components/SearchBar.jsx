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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-primary" style={{color: '#9a8a8d'}} />
                
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search repositories..."
                    disabled={isLoading}
                    className="w-full pl-12 pr-32 py-4 text-lg rounded-full backdrop-blur-md focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl" style={{backgroundColor: '#1a0f11', borderWidth: '2px', borderColor: '#3d2a2f', color: '#f4e6e9'}}
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-2 rounded-full transition-colors" style={{':hover': {backgroundColor: '#2d1a1f'}}}
                        >
                            <X className="w-4 h-4" style={{color: '#c4b7ba'}} />
                        </button>
                    )}
                    
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" style={{backgroundColor: '#dd8c9e', color: '#0b0405'}}
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
        </form>
    );
}
