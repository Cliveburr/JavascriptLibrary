import React from 'react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Ação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmClass = "is-danger"
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active">
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
          <p>{message}</p>
        </section>
        <footer className="modal-card-foot">
          <button 
            className={`button ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button className="button" onClick={onClose}>
            {cancelText}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmModal;
