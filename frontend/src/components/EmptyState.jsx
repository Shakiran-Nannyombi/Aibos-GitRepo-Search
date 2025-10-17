import { Search, Inbox } from 'lucide-react';
import PropTypes from 'prop-types';

export function EmptyState({ type, message }) {
    if (type === 'no-search') {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="w-16 h-16 text-light-muted dark:text-dark-muted mb-4" />
                <h3 className="text-xl font-semibold mb-2">Start Searching</h3>
                <p className="text-light-muted dark:text-dark-muted max-w-md">
                    Enter keywords above to search for GitHub repositories. Try searching for topics like 
                    "react", "machine learning", or "web development".
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="w-16 h-16 text-light-muted dark:text-dark-muted mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Repositories Found</h3>
            <p className="text-light-muted dark:text-dark-muted max-w-md">
                {message || "We couldn't find any repositories matching your search. Try different keywords or adjust your filters."}
            </p>
        </div>
    );
}

EmptyState.propTypes = {
    type: PropTypes.oneOf(['no-search', 'no-results']).isRequired,
    message: PropTypes.string,
};
