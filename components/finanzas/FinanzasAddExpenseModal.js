import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export function FinanzasAddExpenseModal({ subcategoryName, onSubmit, onClose }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus the amount input
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleSubmit = () => {
    const parsedAmount = parseInt(amount);
    if (parsedAmount > 0) {
      onSubmit(parsedAmount, note.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') handleClose();
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 100,
        animation: isClosing ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.25s ease-out',
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '500px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '24px 24px 0 0',
          padding: '1.75rem 1.5rem 2rem',
          animation: isClosing ? 'slideDown 0.2s ease-out' : 'slideUp 0.3s ease-out',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        }}
      >
        {/* Handle bar */}
        <div style={{ width: '40px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', margin: '0 auto 1.25rem' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
            Sumar Gasto
          </h3>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Subcategory name badge */}
        <div style={{
          display: 'inline-block',
          padding: '6px 14px', borderRadius: '20px',
          backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
          fontSize: '13px', fontWeight: '600', color: '#16a34a',
          marginBottom: '1.25rem',
        }}>
          {subcategoryName}
        </div>

        {/* Amount input */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>MONTO (CLP)</label>
          <input
            ref={inputRef}
            type="number"
            placeholder="Ej: 25000"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%', padding: '14px 16px',
              borderRadius: '12px', border: '1px solid var(--border-color)',
              backgroundColor: 'var(--white)', fontSize: '18px', fontWeight: '600',
              color: 'var(--text-main)', outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Note input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>NOTA (opcional)</label>
          <input
            type="text"
            placeholder="Ej: Almuerzo con amigos"
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%', padding: '12px 16px',
              borderRadius: '12px', border: '1px solid var(--border-color)',
              backgroundColor: 'var(--white)', fontSize: '14px',
              color: 'var(--text-main)', outline: 'none',
            }}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!amount || parseInt(amount) <= 0}
          style={{
            width: '100%', padding: '16px',
            backgroundColor: (!amount || parseInt(amount) <= 0) ? '#e5e5e5' : '#22c55e',
            color: (!amount || parseInt(amount) <= 0) ? '#9ca3af' : 'white',
            border: 'none', borderRadius: '14px',
            fontSize: '16px', fontWeight: '600',
            cursor: (!amount || parseInt(amount) <= 0) ? 'not-allowed' : 'pointer',
            boxShadow: (!amount || parseInt(amount) <= 0) ? 'none' : '0 4px 12px rgba(34,197,94,0.25)',
            transition: 'all 0.2s',
          }}
        >
          Sumar Gasto
        </button>
      </div>
    </div>
  );
}
