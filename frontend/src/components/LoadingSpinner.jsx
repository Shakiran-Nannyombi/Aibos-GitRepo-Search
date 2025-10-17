import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

export function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-gray-800 dark:text-gray-200" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
        </div>
    );
}

LoadingSpinner.propTypes = {
    message: PropTypes.string,
};
