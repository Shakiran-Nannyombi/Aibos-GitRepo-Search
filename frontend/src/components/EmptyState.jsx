import { Search, Inbox } from 'lucide-react';
import PropTypes from 'prop-types';

export function EmptyState({ type, message }) {
    if (type === 'no-search') {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative">
                    <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
                    <Search className="relative w-20 h-20 text-gray-800 dark:text-gray-200 mb-6 animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                    Start Your Search
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-lg text-lg leading-relaxed">
                    Enter keywords above to discover amazing GitHub repositories. Try searching for 
                    <span className="font-semibold text-gray-800 dark:text-gray-200"> "react"</span>, 
                    <span className="font-semibold text-gray-800 dark:text-gray-200"> "machine learning"</span>, or 
                    <span className="font-semibold text-gray-800 dark:text-gray-200"> "web development"</span>.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                <Inbox className="relative w-20 h-20 text-gray-800 dark:text-gray-200 mb-6" />
            </div>
            <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                No Repositories Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg text-lg">
                {message || "We couldn't find any repositories matching your search. Try different keywords or adjust your filters."}
            </p>
        </div>
    );
}

EmptyState.propTypes = {
    type: PropTypes.oneOf(['no-search', 'no-results']).isRequired,
    message: PropTypes.string,
};
