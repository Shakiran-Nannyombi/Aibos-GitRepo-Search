import { AlertCircle, X } from 'lucide-react';
import PropTypes from 'prop-types';

export function ErrorAlert({ message, onClose }) {
    return (
        <div className="card p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-800/50 rounded transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
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
