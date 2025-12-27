import { Search, Inbox } from 'lucide-react';
import PropTypes from 'prop-types';

export function EmptyState({ type, message }) {
    if (type === 'no-search') {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative">
                    <div className="absolute inset-0 blur-3xl opacity-10 bg-accent rounded-full"></div>
                    <Search className="relative w-16 h-16 text-muted mb-6 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                    Start Your Search
                </h3>
                <p className="text-muted max-w-lg leading-relaxed">
                    Enter keywords above to discover amazing GitHub repositories. Try searching for 
                    <span className="font-semibold text-foreground"> "react"</span>, 
                    <span className="font-semibold text-foreground"> "machine learning"</span>, or 
                    <span className="font-semibold text-foreground"> "web development"</span>.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-10 bg-muted rounded-full"></div>
                <Inbox className="relative w-16 h-16 text-muted mb-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">
                No Repositories Found
            </h3>
            <p className="text-muted max-w-lg">
                {message || "We couldn't find any repositories matching your search. Try different keywords or adjust your filters."}
            </p>
        </div>
    );
}

EmptyState.propTypes = {
    type: PropTypes.oneOf(['no-search', 'no-results']).isRequired,
    message: PropTypes.string,
};
