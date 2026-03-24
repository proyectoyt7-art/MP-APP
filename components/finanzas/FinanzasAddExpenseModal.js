import { useState, useRef, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';

export function FinanzasAddExpenseModal({ subcategoryName, onSubmit, onClose, currentSubTotal = 999999999 }) {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('add'); // 'add' | 'subtract'
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
      const finalAmount = mode === 'add' ? parsedAmount : -parsedAmount;
      
      // Safety check for subtraction
      if (mode === 'subtract' && parsedAmount > currentSubTotal) {
        alert(`No puedes restar más de lo acumulado (${currentSubTotal})`);
        return;
      }
      
      onSubmit(finalAmount, ''); // No notes as requested
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') handleClose();
  };

  const isValid = amount && parseInt(amount) > 0;

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 100,
        animation: isClosing ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.25s ease-out',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '500px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '24px 24px 0 0',
          padding: '1.5rem 1.5rem 2.5rem',
          animation: isClosing ? 'slideDown 0.2s ease-out' : 'slideUp 0.3s ease-out',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        }}
      >
        {/* Handle bar */}
        <div style={{ width: '40px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', margin: '0 auto 1.5rem' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {mode === 'add' ? 'Registrar Gasto' : 'Corregir Gasto'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{subcategoryName}</p>
          </div>
          <button onClick={handleClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: '#f1f5f9', 
          borderRadius: '16px', 
          padding: '4px',
          marginBottom: '1.5rem'
        }}>
          <button 
            onClick={() => setMode('add')}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px', borderRadius: '12px', border: 'none',
              backgroundColor: mode === 'add' ? 'white' : 'transparent',
              color: mode === 'add' ? '#22c55e' : 'var(--text-muted)',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              boxShadow: mode === 'add' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={16} /> Sumar
          </button>
          <button 
            onClick={() => setMode('subtract')}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px', borderRadius: '12px', border: 'none',
              backgroundColor: mode === 'subtract' ? 'white' : 'transparent',
              color: mode === 'subtract' ? '#ef4444' : 'var(--text-muted)',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              boxShadow: mode === 'subtract' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Minus size={16} /> Restar
          </button>
        </div>

        {/* Amount input */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', marginLeft: '4px' }}>MONTO A {mode === 'add' ? 'SUMAR' : 'RESTAR'}</label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              fontSize: '20px', fontWeight: '700', color: mode === 'add' ? '#22c55e' : '#ef4444'
            }}>
              {mode === 'add' ? '+' : '-'}
            </span>
            <input
              ref={inputRef}
              type="number"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%', padding: '16px 16px 16px 40px',
                borderRadius: '16px', border: '2px solid #f1f5f9',
                backgroundColor: '#f8fafc', fontSize: '24px', fontWeight: '800',
                color: 'var(--text-main)', outline: 'none',
                transition: 'all 0.2s focus:border-color 0.2s',
              }}
            />
          </div>
          {mode === 'subtract' && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', marginLeft: '4px' }}>
              Acumulado actual: <strong>${currentSubTotal.toLocaleString('es-CL')}</strong>
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          style={{
            width: '100%', padding: '18px',
            backgroundColor: !isValid ? '#f1f5f9' : (mode === 'add' ? '#22c55e' : '#ef4444'),
            color: !isValid ? '#cbd5e1' : 'white',
            border: 'none', borderRadius: '18px',
            fontSize: '16px', fontWeight: '700',
            cursor: !isValid ? 'not-allowed' : 'pointer',
            boxShadow: !isValid ? 'none' : (mode === 'add' ? '0 10px 20px rgba(34,197,94,0.2)' : '0 10px 20px rgba(239,68,68,0.2)'),
            transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}
        >
          {mode === 'add' ? <Plus size={18} /> : <Minus size={18} />}
          {mode === 'add' ? 'Confirmar Suma' : 'Confirmar Resta'}
        </button>
      </div>
    </div>
  );
}

