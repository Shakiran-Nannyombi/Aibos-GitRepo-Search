import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

export function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
            <p className="mt-4 text-muted font-medium">{message}</p>
        </div>
    );
}

LoadingSpinner.propTypes = {
    message: PropTypes.string,
};
