import React, { useEffect } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    isDestructive = false
}) => {
    // Fechar modal com ESC
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevenir scroll do body
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button
                        className="modal-close"
                        onClick={onCancel}
                        aria-label="Fechar"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path
                                d="M15 5L5 15M5 5l10 10"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className="modal-content">
                    <p className="modal-message">{message}</p>
                </div>

                <div className="modal-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
                        onClick={onConfirm}
                        autoFocus
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
