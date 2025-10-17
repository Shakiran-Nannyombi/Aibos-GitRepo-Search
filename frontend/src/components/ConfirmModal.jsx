import { AlertTriangle } from 'lucide-react';

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-black border-2 border-red-200 dark:border-red-800 
                          rounded-3xl shadow-2xl max-w-md w-full mx-4 p-6 
                          animate-in fade-in zoom-in duration-200">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 
                                  flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-gray-100">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl font-semibold
                                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                 border-2 border-gray-200 dark:border-gray-800
                                 hover:bg-gray-200 dark:hover:bg-gray-800
                                 transition-all duration-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-6 py-3 rounded-xl font-semibold
                                 bg-red-600 dark:bg-red-600 text-white
                                 hover:bg-red-700 dark:hover:bg-red-700
                                 transition-all duration-200 shadow-lg"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
