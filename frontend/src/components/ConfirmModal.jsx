import { useEffect, useRef } from 'react';

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
    const cancelRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        cancelRef.current?.focus();
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
                className="relative w-full max-w-md p-6 rounded-[var(--radius-panel)] border border-border bg-surface shadow-[var(--shadow-float)]"
            >
                <h2 id="confirm-title" className="text-xl font-bold">{title}</h2>
                <p id="confirm-message" className="mt-2 text-muted leading-relaxed">{message}</p>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        ref={cancelRef}
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-[var(--radius-control)] font-semibold border border-border text-foreground hover:bg-background transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2.5 rounded-[var(--radius-control)] font-semibold bg-danger text-on-accent hover:opacity-90 transition-opacity"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
