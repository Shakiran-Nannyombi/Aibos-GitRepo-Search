import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

export function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div role="status" className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" aria-hidden="true" />
            <p className="mt-3 text-muted">{message}</p>
        </div>
    );
}

LoadingSpinner.propTypes = {
    message: PropTypes.string,
};
