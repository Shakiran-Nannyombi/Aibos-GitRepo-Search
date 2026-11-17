import { AlertCircle, X } from 'lucide-react';
import PropTypes from 'prop-types';

export function ErrorAlert({ message, onClose }) {
    return (
        <div role="alert" className="flex items-start gap-3 p-4 rounded-[var(--radius-row)] border border-danger/30 bg-danger/10">
            <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" aria-hidden="true" />
            <p className="flex-1 min-w-0 text-[15px] text-foreground">{message}</p>
            {onClose && (
                <button
                    onClick={onClose}
                    aria-label="Dismiss"
                    className="p-1 -m-1 rounded-[var(--radius-control)] text-muted hover:text-foreground transition-colors shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

ErrorAlert.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func,
};
