// src/components/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // 'sm', 'md', 'lg'
  showClose = true
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Modal window'}
    >
      <div
        ref={modalRef}
        className={`modal-box ${size === 'lg' ? 'modal-lg' : ''}`}
      >
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
            {title}
          </h3>
          {showClose && (
            <button
              onClick={onClose}
              className="btn-icon btn-ghost"
              aria-label="Close modal"
              style={{ width: '32px', height: '32px' }}
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
