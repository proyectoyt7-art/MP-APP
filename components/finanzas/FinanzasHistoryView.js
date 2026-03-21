import { ChevronLeft, Calendar, Edit3, Save, X, ChevronRight, BarChart3, PieChart } from 'lucide-react';
import { useState, useMemo } from 'react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function FinanzasHistoryView({
  historyData,
  monthlyNotes,
  currentYear,
  onBack,
  onSaveNote,
  onSaveAdjustment,
  formatCLP,
}) {
  const [editingMonth, setEditingMonth] = useState(null);
  const [noteText, setNoteText] = useState('');
  
  const [adjustingMonth, setAdjustingMonth] = useState(null);
  const [adjValue, setAdjValue] = useState('');

  const [viewingAnalysis, setViewingAnalysis] = useState(null);

  const startEdit = (monthIdx, currentNote) => {
    setEditingMonth(monthIdx);
    setNoteText(currentNote || '');
  };

  const handleSave = () => {
    onSaveNote(editingMonth, currentYear, noteText);
    setEditingMonth(null);
  };

  const handleSaveAdj = () => {
    onSaveAdjustment(adjustingMonth, currentYear, adjValue === '' ? null : parseInt(adjValue));
    setAdjustingMonth(null);
    setAdjValue('');
  };

  const currentMonthIdx = new Date().getMonth();
  const currentYearNow = new Date().getFullYear();

  const currentMonthRef = useState(null)[0]; // Actually I'll use a callback ref or simple useEffect
  
  useState(() => {
    // Small trick to scroll after render
    setTimeout(() => {
       const el = document.getElementById('current-month-card');
       if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  });

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '3rem' }}>
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
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 0 8px' }}>Historial {currentYear}</h1>
      </header>

      {/* ─── Months Grid ─────────────────────────────────────── */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MONTH_NAMES.map((name, idx) => {
          const data = historyData[idx] || { budget: 0, spent: 0, surplus: 0, hasInfo: false, isAdjusted: false };
          const noteObj = monthlyNotes.find(n => n.month === idx && n.year === currentYear);
          const isCurrent = idx === currentMonthIdx && currentYear === currentYearNow;
          const isEditing = editingMonth === idx;
          const isAdjusting = adjustingMonth === idx;

          // Only show details if isCurrent OR hasInfo is true
          const showDetails = isCurrent || data.hasInfo;

          return (
            <div key={idx} 
              id={isCurrent ? 'current-month-card' : undefined}
              style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              border: isCurrent ? '2px solid #22c55e' : '1px solid var(--border-color)',
              padding: '1.25rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
              opacity: showDetails ? 1 : 0.7
            }}>
              {isCurrent && (
                <div style={{
                  position: 'absolute', top: '12px', right: '-30px',
                  backgroundColor: '#22c55e', color: 'white',
                  fontSize: '10px', fontWeight: '800', padding: '4px 35px',
                  transform: 'rotate(45deg)', letterSpacing: '0.5px'
                }}>ACTUAL</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: showDetails ? '1rem' : '0' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{name}</h3>
                  {!showDetails && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', margin: '4px 0 0' }}>
                      Sin información
                    </p>
                  )}
                  {showDetails && (
                    <button 
                      onClick={() => setViewingAnalysis(idx)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', 
                        background: '#f0fdf4', border: '1px solid #bcf0ce', 
                        borderRadius: '6px', padding: '4px 8px', cursor: 'pointer',
                        color: '#16a34a', fontSize: '11px', fontWeight: '700'
                      }}
                    >
                      <BarChart3 size={12} /> ANÁLISIS
                    </button>
                  )}
                </div>
                
                {showDetails && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px', letterSpacing: '0.5px' }}>
                      EXCEDENTE {data.isAdjusted && '(ADJUSTADO)'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <p style={{ fontSize: '16px', fontWeight: '800', color: data.surplus >= 0 ? '#22c55e' : '#ef4444', margin: 0 }}>
                        {formatCLP(data.surplus)}
                      </p>
                      <button 
                        onClick={() => { setAdjustingMonth(idx); setAdjValue(data.isAdjusted ? String(data.surplus) : ''); }}
                        style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '4px' }}
                      >
                        <Edit3 size={12} color="#64748b" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isAdjusting && (
                <div style={{ marginBottom: '1rem', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                   <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Corregir excedente manualmente:</p>
                   <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        value={adjValue} 
                        onChange={e => setAdjValue(e.target.value)}
                        placeholder="Monto..."
                        style={{ ...inputStyle, flex: 1, padding: '8px' }}
                      />
                      <button onClick={handleSaveAdj} style={{ ...btnPrimary, padding: '8px 12px' }}>OK</button>
                      <button onClick={() => setAdjustingMonth(null)} style={{ ...btnSecondary, padding: '8px 12px' }}>✕</button>
                   </div>
                   <p style={{ fontSize: '10px', color: '#16a34a', marginTop: '6px' }}>* Este valor se usará para el presupuesto del mes siguiente.</p>
                </div>
              )}

              {showDetails && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>PRESUPUESTO</p>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{formatCLP(data.budget)}</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>GASTADO</p>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{formatCLP(data.spent)}</p>
                    </div>
                  </div>

                  {/* Note Section */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <textarea
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          placeholder="Escribe una observación para este mes..."
                          style={{
                            width: '100%', padding: '10px', borderRadius: '10px',
                            border: '1px solid #e2e8f0', minHeight: '80px', fontSize: '13px',
                            outline: 'none', resize: 'none'
                          }}
                          autoFocus
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setEditingMonth(null)} style={{ ...iconBtnStyle, flex: 1, backgroundColor: '#f1f5f9' }}><X size={16} /> Cancelar</button>
                          <button onClick={handleSave} style={{ ...iconBtnStyle, flex: 1, backgroundColor: '#22c55e', color: 'white' }}><Save size={16} /> Guardar</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <p style={{ 
                          fontSize: '13px', color: noteObj?.note ? 'var(--text-main)' : 'var(--text-muted)',
                          margin: 0, fontStyle: noteObj?.note ? 'normal' : 'italic', flex: 1,
                          lineHeight: '1.4'
                        }}>
                          {noteObj?.note || 'Sin observaciones este mes.'}
                        </p>
                        <button onClick={() => startEdit(idx, noteObj?.note)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                          <Edit3 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {viewingAnalysis !== null && (
        <AnalysisReport 
          monthName={MONTH_NAMES[viewingAnalysis]} 
          data={historyData[viewingAnalysis]} 
          onClose={() => setViewingAnalysis(null)} 
          formatCLP={formatCLP}
        />
      )}
    </div>
  );
}

function AnalysisReport({ monthName, data, onClose, formatCLP }) {
  if (!data || !data.categoryBreakdown) return null;

  const totalSpent = data.spent;
  const breakdown = [...data.categoryBreakdown]
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const highest = breakdown[0];
  const second = breakdown[1];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
    }}>
      <div className="fade-in" style={{
        backgroundColor: 'var(--card-bg)', borderRadius: '24px', width: '100%', maxWidth: '400px',
        maxHeight: '80vh', overflowY: 'auto', padding: '2rem', position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <PieChart size={24} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Análisis de {monthName}</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Distribución de gastos reales</p>
        </div>

        {breakdown.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
              {breakdown.map(cat => {
                const pct = totalSpent > 0 ? Math.round((cat.amount / totalSpent) * 100) : 0;
                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-main)' }}>{cat.name}</span>
                      <span style={{ color: 'var(--text-main)' }}>{formatCLP(cat.amount)} ({pct}%)</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#22c55e', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px' }}>Resumen mensual</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0 0 4px', lineHeight: '1.5' }}>
                • Este mes el mayor porcentaje de gasto fue en <strong>{highest.name}</strong>.
              </p>
              {second && (
                <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0 0 4px', lineHeight: '1.5' }}>
                  • <strong>{second.name}</strong> fue la segunda categoría más utilizada.
                </p>
              )}
              <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '12px 0 0', lineHeight: '1.5' }}>
                Has consumido el <strong>{data.budget > 0 ? Math.round((totalSpent / data.budget) * 100) : 0}%</strong> de tu presupuesto total disponible este mes.
              </p>
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: '2rem 0' }}>No hay gastos registrados este mes.</p>
        )}

        <button onClick={onClose} style={{ 
          width: '100%', padding: '14px', borderRadius: '14px', border: 'none', 
          backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '14px', 
          fontWeight: '700', marginTop: '1.5rem', cursor: 'pointer' 
        }}>Cerrar análisis</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '10px',
  border: '1px solid var(--border-color)', backgroundColor: 'var(--white)',
  fontSize: '14px', color: 'var(--text-main)', outline: 'none',
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

const iconBtnStyle = {
  border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: '600',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
};
