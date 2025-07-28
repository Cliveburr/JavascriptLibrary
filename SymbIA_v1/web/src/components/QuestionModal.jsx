import React from 'react';

const QuestionModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    label,
    placeholder,
    value,
    onChange,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false,
    onKeyPress
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading && onKeyPress) {
            onKeyPress(e);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{title}</p>
                    <button 
                        className="delete" 
                        aria-label="close"
                        onClick={onClose}
                    ></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label">{label}</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="text" 
                                placeholder={placeholder}
                                value={value}
                                onChange={onChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button 
                        className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {confirmText}
                    </button>
                    <button 
                        className="button" 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default QuestionModal;
