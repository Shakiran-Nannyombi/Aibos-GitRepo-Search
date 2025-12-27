import { AlertCircle, X } from 'lucide-react';
import PropTypes from 'prop-types';

export function ErrorAlert({ message, onClose }) {
    return (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 shadow-sm">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4 text-red-500" />
                    </button>
                )}
            </div>
        </div>
    );
}

ErrorAlert.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func,
};
