import React from 'react';

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Sí', cancelText = 'No' }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div className="fade-in" style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '320px',
        padding: '1.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: '#ef4444',
              fontSize: '15px',
              fontWeight: '700',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
