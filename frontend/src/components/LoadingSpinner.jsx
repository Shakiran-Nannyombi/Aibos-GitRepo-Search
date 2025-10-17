import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

export function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-light-accent dark:text-dark-accent" />
            <p className="mt-4 text-light-muted dark:text-dark-muted">{message}</p>
        </div>
    );
}

LoadingSpinner.propTypes = {
    message: PropTypes.string,
};
