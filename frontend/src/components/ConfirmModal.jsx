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
            <div className="relative bg-background border border-border 
                          rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 
                          animate-in fade-in zoom-in duration-200">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 
                                  flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500" strokeWidth={2} />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-center mb-2 text-foreground">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-center text-muted mb-8 leading-relaxed text-sm">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm
                                 bg-header text-foreground border border-border
                                 hover:bg-border/30 transition-all duration-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm
                                 bg-red-500 text-white hover:bg-red-600
                                 transition-all duration-200 shadow-sm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
