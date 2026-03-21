import { useState, useRef } from 'react';
import { ChevronLeft, Settings, Plus, Pencil, Trash2, GripVertical, PlusCircle, ChevronUp, ChevronDown } from 'lucide-react';

const ICON_OPTIONS = ['🍽️', '🚗', '🩺', '🎬', '🏠', '📚', '👕', '💡', '💰', '🎁', '✈️', '🎮', '🛒', '📁'];

export function FinanzasConfigView({
  categories,
  getSortedSubcategories,
  incomeSources,
  onBack,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
  onReorderSubcategories,
  onAddIncomeSource,
  onUpdateIncomeSource,
  onDeleteIncomeSource,
  formatCLP,
}) {
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatBudget, setEditCatBudget] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('📁');
  const [editCatEffect, setEditCatEffect] = useState('expense');

  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubName, setEditSubName] = useState('');

  const [addingSubForCat, setAddingSubForCat] = useState(null);
  const [newSubName, setNewSubName] = useState('');

  const [showNewCatForm, setShowNewCatForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📁');
  const [newCatEffect, setNewCatEffect] = useState('expense');

  // Income Sources State
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [newIncName, setNewIncName] = useState('');
  const [newIncAmount, setNewIncAmount] = useState('');
  const [editingIncId, setEditingIncId] = useState(null);

  // Drag state
  const dragCat = useRef(null);
  const dragOverCat = useRef(null);

  // ─── Category drag & drop ─────────────────────────────────
  const handleDragStart = (catId) => { dragCat.current = catId; };
  const handleDragEnter = (catId) => { dragOverCat.current = catId; };
  const handleDragEnd = () => {
    if (dragCat.current && dragOverCat.current && dragCat.current !== dragOverCat.current) {
      const currentOrder = categories.map(c => c.id);
      const fromIdx = currentOrder.indexOf(dragCat.current);
      const toIdx = currentOrder.indexOf(dragOverCat.current);
      const newOrder = [...currentOrder];
      newOrder.splice(fromIdx, 1);
      newOrder.splice(toIdx, 0, dragCat.current);
      onReorderCategories(newOrder);
    }
    dragCat.current = null;
    dragOverCat.current = null;
  };

  // ─── Category edit ────────────────────────────────────────
  const startEditCat = (cat) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatBudget(String(cat.budget));
    setEditCatIcon(cat.icon);
    setEditCatEffect(cat.effectType || 'expense');
  };

  const saveEditCat = () => {
    if (editCatName.trim()) {
      onUpdateCategory(editingCatId, { 
        name: editCatName.trim(), 
        budget: parseInt(editCatBudget) || 0, 
        icon: editCatIcon,
        effectType: editCatEffect
      });
    }
    setEditingCatId(null);
  };

  const handleDeleteCat = (id, name) => {
    if (window.confirm(`¿Eliminar la categoría "${name}" y todas sus subcategorías?`)) {
      onDeleteCategory(id);
    }
  };

  // ─── Subcategory edit ─────────────────────────────────────
  const [editSubAmount, setEditSubAmount] = useState('');

  const startEditSub = (sub) => {
    setEditingSubId(sub.id);
    setEditSubName(sub.name);
    setEditSubAmount(String(sub.monthlyAmount || ''));
  };

  const saveEditSub = () => {
    if (editSubName.trim()) {
      onUpdateSubcategory(editingSubId, { 
        name: editSubName.trim(),
        monthlyAmount: parseInt(editSubAmount) || 0
      });
    }
    setEditingSubId(null);
  };

  const handleDeleteSub = (id, name) => {
    if (window.confirm(`¿Eliminar "${name}"?`)) {
      onDeleteSubcategory(id);
    }
  };

  // ─── Add subcategory ──────────────────────────────────────
  const [newSubAmount, setNewSubAmount] = useState('');

  const handleAddSub = (catId) => {
    if (newSubName.trim()) {
      onAddSubcategory(catId, newSubName.trim(), parseInt(newSubAmount) || 0);
      setNewSubName('');
      setNewSubAmount('');
      setAddingSubForCat(null);
    }
  };

  // ─── Add category ─────────────────────────────────────────
  const handleAddCat = () => {
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim(), parseInt(newCatBudget) || 0, newCatIcon, newCatEffect);
      setNewCatName('');
      setNewCatBudget('');
      setNewCatIcon('📁');
      setNewCatEffect('expense');
      setShowNewCatForm(false);
    }
  };

  // ─── Income Handlers ──────────────────────────────────────
  const handleSaveIncome = () => {
    if (newIncName.trim() && newIncAmount) {
      if (editingIncId) {
        onUpdateIncomeSource(editingIncId, { name: newIncName.trim(), amount: parseInt(newIncAmount) || 0 });
      } else {
        onAddIncomeSource(newIncName.trim(), parseInt(newIncAmount) || 0);
      }
      setNewIncName('');
      setNewIncAmount('');
      setEditingIncId(null);
      setShowIncomeForm(false);
    }
  };

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-color)', paddingBottom: '2rem' }}>
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
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 0 8px' }}>Finanzas</h1>
        <div style={{ flex: 1 }} />
        <Settings size={20} color="var(--text-muted)" />
      </header>

      {/* ─── Income Section ──────────────────────────────────── */}
      <div style={{ padding: '1.5rem 1.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '4px' }}>PRESUPUESTO</p>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Gestionar Ingresos</h2>
          </div>
          <button
            onClick={() => { setShowIncomeForm(true); setEditingIncId(null); setNewIncName(''); setNewIncAmount(''); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e' }}
          >
            <PlusCircle size={28} />
          </button>
        </div>

        {showIncomeForm && (
          <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '1rem', animation: 'fadeIn 0.3s ease-out' }}>
            <input type="text" placeholder="Nombre (Sueldo, Extra...)" value={newIncName} onChange={e => setNewIncName(e.target.value)} style={{ ...inputStyle, marginBottom: '8px' }} />
            <input type="number" placeholder="Monto" value={newIncAmount} onChange={e => setNewIncAmount(e.target.value)} style={{ ...inputStyle, marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowIncomeForm(false)} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
              <button onClick={handleSaveIncome} style={{ ...btnPrimary, flex: 1 }}>Guardar</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
          {incomeSources.map(inc => (
            <div key={inc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--card-bg)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{inc.name}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{formatCLP(inc.amount)}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => { setShowIncomeForm(true); setEditingIncId(inc.id); setNewIncName(inc.name); setNewIncAmount(inc.amount); }} style={iconBtnStyle}><Pencil size={16} color="#9ca3af" /></button>
                <button onClick={() => onDeleteIncomeSource(inc.id)} style={iconBtnStyle}><Trash2 size={16} color="#9ca3af" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Category Section ────────────────────────────────── */}
      <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: '4px' }}>GASTOS</p>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Gestionar Categorías</h2>
        </div>
        <button
          onClick={() => { setShowNewCatForm(!showNewCatForm); setNewCatEffect('expense'); }}
          style={{
            width: '44px', height: '44px', borderRadius: '50%',
            backgroundColor: '#22c55e', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
            transition: 'transform 0.2s',
          }}
        >
          <Plus size={24} color="white" />
        </button>
      </div>

      {/* ─── New Category Form ───────────────────────────────── */}
      {showNewCatForm && (
        <div style={{
          margin: '1rem 1.5rem', padding: '1.25rem',
          backgroundColor: 'var(--card-bg)', borderRadius: '16px',
          border: '1px solid var(--border-color)',
          animation: 'fadeIn 0.3s ease-out',
        }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>NUEVA CATEGORÍA</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {ICON_OPTIONS.map(ico => (
              <button key={ico} onClick={() => setNewCatIcon(ico)} style={{
                width: '36px', height: '36px', borderRadius: '8px', fontSize: '18px',
                border: newCatIcon === ico ? '2px solid #22c55e' : '1px solid var(--border-color)',
                backgroundColor: newCatIcon === ico ? '#f0fdf4' : 'var(--white)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{ico}</button>
            ))}
          </div>
          <input type="text" placeholder="Nombre de categoría" value={newCatName} onChange={e => setNewCatName(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Referencia mensual" value={newCatBudget} onChange={e => setNewCatBudget(e.target.value)} style={{ ...inputStyle, marginTop: '8px' }} />
          
          <div style={{ marginTop: '12px', marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>TIPO DE LÓGICA</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { type: 'expense', label: 'Suma Gasto' },
                { type: 'credit', label: 'Resta Gasto' },
                { type: 'saving', label: 'Ahorro' },
                { type: 'fixed_expense', label: 'Gasto Fijo' }
              ].map(item => (
                <button
                  key={item.type}
                  onClick={() => setNewCatEffect(item.type)}
                  style={{
                    padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                    border: '1px solid var(--border-color)',
                    backgroundColor: newCatEffect === item.type ? '#22c55e' : 'white',
                    color: newCatEffect === item.type ? 'white' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={() => setShowNewCatForm(false)} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
            <button onClick={handleAddCat} style={{ ...btnPrimary, flex: 1 }}>Guardar</button>
          </div>
        </div>
      )}

      {/* ─── Category List ───────────────────────────────────── */}
      <div style={{ padding: '1rem 1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {categories.map(cat => {
          const subs = getSortedSubcategories(cat.id);
          const isEditing = editingCatId === cat.id;

          return (
            <div
              key={cat.id}
              draggable
              onDragStart={() => handleDragStart(cat.id)}
              onDragEnter={() => handleDragEnter(cat.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{
                padding: '1rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: '10px',
                borderBottom: (subs.length > 0 || addingSubForCat === cat.id) ? '1px solid var(--border-color)' : 'none',
              }}>
                <div style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'flex', touchAction: 'none' }}>
                  <GripVertical size={18} />
                </div>

                {isEditing ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {ICON_OPTIONS.map(ico => (
                        <button key={ico} onClick={() => setEditCatIcon(ico)} style={{
                          width: '30px', height: '30px', borderRadius: '6px', fontSize: '16px',
                          border: editCatIcon === ico ? '2px solid #22c55e' : '1px solid var(--border-color)',
                          backgroundColor: editCatIcon === ico ? '#f0fdf4' : 'transparent',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{ico}</button>
                      ))}
                    </div>
                    <input type="text" value={editCatName} onChange={e => setEditCatName(e.target.value)} style={inputStyle} />
                    <input type="number" placeholder="Presupuesto" value={editCatBudget} onChange={e => setEditCatBudget(e.target.value)} style={inputStyle} />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      {[
                        { type: 'expense', label: 'SUMA' },
                        { type: 'credit', label: 'RESTA' },
                        { type: 'saving', label: 'AHORRO' },
                        { type: 'fixed_expense', label: 'FIJO' }
                      ].map(item => (
                        <button
                          key={item.type}
                          onClick={() => setEditCatEffect(item.type)}
                          style={{
                            padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700',
                            border: '1px solid var(--border-color)',
                            backgroundColor: editCatEffect === item.type ? '#22c55e' : 'white',
                            color: editCatEffect === item.type ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setEditingCatId(null)} style={{ ...btnSecondary, flex: 1, padding: '8px' }}>Cancelar</button>
                      <button onClick={saveEditCat} style={{ ...btnPrimary, flex: 1, padding: '8px' }}>Guardar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      backgroundColor: '#e8f5e9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', flexShrink: 0,
                    }}>
                      {cat.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>{cat.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                        {cat.effectType === 'credit' ? 'RESTA GASTO' : 
                         cat.effectType === 'saving' ? 'AHORRO' : 
                         cat.effectType === 'fixed_expense' ? 'GASTO FIJO' : 'SUMA GASTO'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px' }}>
                      <button 
                        onClick={() => {
                          const idx = categories.findIndex(c => c.id === cat.id);
                          if (idx > 0) {
                            const newOrder = [...categories.map(c => c.id)];
                            [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                            onReorderCategories(newOrder);
                          }
                        }}
                        style={{ ...iconBtnSmall, opacity: categories.findIndex(c => c.id === cat.id) === 0 ? 0.3 : 1 }}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          const idx = categories.findIndex(c => c.id === cat.id);
                          if (idx < categories.length - 1) {
                            const newOrder = [...categories.map(c => c.id)];
                            [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
                            onReorderCategories(newOrder);
                          }
                        }}
                        style={{ ...iconBtnSmall, opacity: categories.findIndex(c => c.id === cat.id) === categories.length - 1 ? 0.3 : 1 }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <button onClick={() => startEditCat(cat)} style={iconBtnStyle}><Pencil size={18} color="#9ca3af" /></button>
                    <button onClick={() => handleDeleteCat(cat.id, cat.name)} style={iconBtnStyle}><Trash2 size={18} color="#9ca3af" /></button>
                  </>
                )}
              </div>

              {!isEditing && subs.map(sub => (
                <div key={sub.id} style={{
                  padding: '0.85rem 1.25rem 0.85rem 3.5rem',
                  display: 'flex', alignItems: 'center',
                  borderBottom: '1px solid #f5f5f5',
                }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginRight: '8px' }}>↳</span>
                  {editingSubId === sub.id ? (
                    <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                      <input type="text" value={editSubName} onChange={e => setEditSubName(e.target.value)}
                        style={{ ...inputStyle, flex: 2, padding: '8px 12px', margin: 0 }} autoFocus />
                      {cat.effectType === 'fixed_expense' && (
                        <input type="number" placeholder="Monto fijo" value={editSubAmount} onChange={e => setEditSubAmount(e.target.value)}
                          style={{ ...inputStyle, flex: 1, padding: '8px 12px', margin: 0 }} />
                      )}
                      <button onClick={saveEditSub} style={{ ...btnPrimary, padding: '8px 12px', fontSize: '13px' }}>OK</button>
                    </div>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}>{sub.name}</span>
                      <button onClick={() => startEditSub(sub)} style={iconBtnStyle}><Pencil size={16} color="#9ca3af" /></button>
                      <button onClick={() => handleDeleteSub(sub.id, sub.name)} style={iconBtnStyle}><Trash2 size={16} color="#9ca3af" /></button>
                    </>
                  )}
                </div>
              ))}

              {!isEditing && (
                addingSubForCat === cat.id ? (
                  <div style={{ padding: '0.75rem 1.25rem 0.75rem 3.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="text" placeholder="Nombre subcategoría" value={newSubName} onChange={e => setNewSubName(e.target.value)}
                        style={{ ...inputStyle, flex: 1, padding: '8px 12px', margin: 0 }} autoFocus />
                      {cat.effectType === 'fixed_expense' && (
                        <input type="number" placeholder="Monto fijo" value={newSubAmount} onChange={e => setNewSubAmount(e.target.value)}
                          style={{ ...inputStyle, width: '100px', padding: '8px 12px', margin: 0 }} />
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleAddSub(cat.id)} style={{ ...btnPrimary, flex: 1, padding: '8px 12px', fontSize: '13px' }}>Guardar Subcategoría</button>
                      <button onClick={() => { setAddingSubForCat(null); setNewSubName(''); setNewSubAmount(''); }} style={{ ...btnSecondary, padding: '8px 12px', fontSize: '13px' }}>✕</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAddingSubForCat(cat.id); setNewSubName(''); }}
                    style={{
                      margin: '0.75rem 1.25rem 0.75rem 3.5rem',
                      padding: '10px', width: 'calc(100% - 4.75rem)',
                      backgroundColor: 'transparent', border: '1px dashed var(--border-color)',
                      borderRadius: '10px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <Plus size={14} /> Añadir Subcategoría
                  </button>
                )
              )}
            </div>
          );
        })}

        <button
          onClick={() => setShowNewCatForm(true)}
          style={{
            width: '100%', padding: '16px',
            backgroundColor: '#22c55e', color: 'white',
            border: 'none', borderRadius: '14px',
            fontSize: '16px', fontWeight: '600',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 12px rgba(34,197,94,0.25)',
            transition: 'transform 0.2s',
            marginTop: '0.5rem',
          }}
        >
          <Plus size={20} /> Añadir Categoría
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '10px',
  border: '1px solid var(--border-color)', backgroundColor: 'var(--white)',
  fontSize: '14px', color: 'var(--text-main)', outline: 'none',
};

const iconBtnSmall = {
  background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', color: 'var(--text-muted)'
};

const iconBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex',
};

const btnPrimary = {
  backgroundColor: '#22c55e', color: 'white', border: 'none',
  borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
};

const btnSecondary = {
  backgroundColor: 'transparent', color: 'var(--text-muted)',
  border: '1px solid var(--border-color)', borderRadius: '8px',
  padding: '10px 16px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
};
