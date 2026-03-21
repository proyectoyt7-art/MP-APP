import { ChevronLeft, PiggyBank, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function FinanzasSavingsView({
  savingsItems,
  categories,
  getCategoryTotal,
  totalSavings,
  onBack,
  onAddSavingsItem,
  onUpdateSavingsItem,
  onDeleteSavingsItem,
  formatCLP,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [amountInput, setAmountInput] = useState('');

  const handleSave = () => {
    if (nameInput.trim() && amountInput) {
      if (editingId) {
        onUpdateSavingsItem(editingId, { name: nameInput.trim(), amount: parseInt(amountInput) || 0 });
      } else {
        onAddSavingsItem(nameInput.trim(), parseInt(amountInput) || 0);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setNameInput('');
    setAmountInput('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setNameInput(item.name);
    setAmountInput(String(item.amount));
    setShowAddForm(true);
  };

  // Filter categories that are marked as 'saving'
  const savingCategories = categories.filter(c => c.effectType === 'saving' || c.name.toLowerCase().includes('ahorro'));

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* ─── Header ──────────────────────────────────────────── */}
      <header style={{
        padding: '1.5rem',
        display: 'flex', alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky', top: 0, backgroundColor: 'var(--bg-color)', zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 0 8px' }}>Ahorros</h1>
      </header>

      {/* ─── Total Savings Card ─────────────────────────────── */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: '24px',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <PiggyBank size={32} />
          </div>
          <p style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500', marginBottom: '4px' }}>Ahorro Total Acumulado</p>
          <h2 style={{ fontSize: '36px', fontWeight: '800', margin: 0 }}>{formatCLP(totalSavings)}</h2>
        </div>
      </div>

      {/* ─── Savings List ───────────────────────────────────── */}
      <div style={{ padding: '0 1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Tipos de Ahorro</h3>
          <button 
            onClick={() => { setShowAddForm(true); setEditingId(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600' }}
          >
            <Plus size={18} /> Añadir
          </button>
        </div>

        {showAddForm && (
          <div style={{ 
            backgroundColor: 'var(--card-bg)', padding: '1.25rem', borderRadius: '16px', 
            border: '1px solid var(--border-color)', marginBottom: '1.5rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
              {editingId ? 'Editar Ahorro' : 'Nuevo Registro de Ahorro'}
            </p>
            <input 
              type="text" placeholder="Nombre (Ej: Viaje, Fondo emergencia)" 
              value={nameInput} onChange={e => setNameInput(e.target.value)} 
              style={inputStyle} 
            />
            <input 
              type="number" placeholder="Monto base" 
              value={amountInput} onChange={e => setAmountInput(e.target.value)} 
              style={{ ...inputStyle, marginTop: '10px', marginBottom: '16px' }} 
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={resetForm} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
              <button onClick={handleSave} style={{ ...btnPrimary, flex: 1 }}>Guardar</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Direct Savings Items */}
          {savingsItems.map(item => (
            <div key={item.id} style={itemCardStyle}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{item.name}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Estático / Directo</p>
              </div>
              <div style={{ textAlign: 'right', marginRight: '12px' }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb', margin: 0 }}>{formatCLP(item.amount)}</p>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => startEdit(item)} style={iconBtnStyle}><Pencil size={16} color="#9ca3af" /></button>
                <button onClick={() => onDeleteSavingsItem(item.id)} style={iconBtnStyle}><Trash2 size={16} color="#9ca3af" /></button>
              </div>
            </div>
          ))}

          {/* Savings from Finance Categories */}
          {savingCategories.map(cat => {
            const total = getCategoryTotal(cat.id);
            if (total === 0) return null;
            return (
              <div key={cat.id} style={{ ...itemCardStyle, borderLeft: '4px solid #4ade80' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{cat.name}</p>
                  <p style={{ fontSize: '11px', color: '#22c55e', fontWeight: '700', margin: '2px 0 0', textTransform: 'uppercase' }}>Desde Finanzas</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb', margin: 0 }}>{formatCLP(total)}</p>
                </div>
              </div>
            );
          })}

          {savingsItems.length === 0 && savingCategories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.5 }}>
              <PiggyBank size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <p style={{ fontSize: '14px' }}>No tienes ahorros registrados aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '12px',
  border: '1px solid var(--border-color)', backgroundColor: 'var(--white)',
  fontSize: '14px', color: 'var(--text-main)', outline: 'none',
};

const itemCardStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  backgroundColor: 'var(--card-bg)', padding: '1rem 1.25rem', borderRadius: '16px',
  border: '1px solid var(--border-color)'
};

const iconBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex',
};

const btnPrimary = {
  backgroundColor: '#2563eb', color: 'white', border: 'none',
  borderRadius: '10px', padding: '12px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
};

const btnSecondary = {
  backgroundColor: 'transparent', color: 'var(--text-muted)',
  border: '1px solid var(--border-color)', borderRadius: '10px',
  padding: '12px 16px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
};
