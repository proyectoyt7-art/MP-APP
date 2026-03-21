import { Settings, ChevronLeft, ChevronRight, PiggyBank, Calendar, Check, Edit3, ChevronDown, ChevronUp } from 'lucide-react';

// ─── Icon map ─────────────────────────────────────────────────
const CATEGORY_ICONS = {
  '🍽️': { bg: '#e8f5e9', icon: '🍽️' },
  '🚗': { bg: '#e3f2fd', icon: '🚗' },
  '🩺': { bg: '#fce4ec', icon: '🩺' },
  '🎬': { bg: '#f3e5f5', icon: '🎬' },
  '📁': { bg: '#f5f5f5', icon: '📁' },
  '🏠': { bg: '#fff3e0', icon: '🏠' },
  '📚': { bg: '#e8eaf6', icon: '📚' },
  '👕': { bg: '#fbe9e7', icon: '👕' },
  '💡': { bg: '#fffde7', icon: '💡' },
  '💰': { bg: '#e8f5e9', icon: '💰' },
  '🎁': { bg: '#fce4ec', icon: '🎁' },
  '✈️': { bg: '#e3f2fd', icon: '✈️' },
  '🎮': { bg: '#f3e5f5', icon: '🎮' },
  '🛒': { bg: '#fff3e0', icon: '🛒' },
};

function getProgressColor(percentage) {
  if (percentage >= 100) return '#ef4444';
  if (percentage >= 80) return '#f59e0b';
  return '#22c55e';
}

export function FinanzasMainView({
  categories,
  getSortedSubcategories,
  getCategoryTotal,
  getCategoryPercentage,
  getSubcategoryTotal,
  totalBudget,
  totalSpent,
  totalPercentage,
  incomeSources,
  onSettingsClick,
  onSavingsClick,
  onHistoryClick,
  onSubcategoryClick,
  onToggleFixedPayment,
  onSaveAnotacion,
  activeAnotacion,
  fixedPayments,
  formatCLP,
  expandedCategories,
  onToggleCategory
}) {
  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* ─── Header ──────────────────────────────────────────── */}
      <header style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
          Finanzas
        </h1>
        <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '12px' }}>
          <button
            onClick={onHistoryClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            <Calendar size={22} />
          </button>
          <button
            onClick={onSavingsClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            <PiggyBank size={22} />
          </button>
          <button
            onClick={onSettingsClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* ─── Budget Summary Card ─────────────────────────────── */}
      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
          borderRadius: '20px',
          padding: '1.75rem',
          color: 'white',
          boxShadow: '0 8px 24px rgba(34, 197, 94, 0.25)',
        }}>
          <p style={{ fontSize: '13px', opacity: 0.85, marginBottom: '4px', fontWeight: '500' }}>Presupuesto Mensual Total</p>
          <h2 style={{ fontSize: '30px', fontWeight: '700', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
            {formatCLP(totalBudget)}
          </h2>
          
          {/* Income breakdown */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', opacity: 0.8 }}>
            {incomeSources.map(source => (
              <span key={source.id} style={{ fontSize: '11px', fontWeight: '500', backgroundColor: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                {source.name}: {formatCLP(source.amount)}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', opacity: 0.9 }}>Gastado real: {formatCLP(totalSpent)}</span>
            <span style={{
              fontSize: '13px', fontWeight: '600',
              backgroundColor: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: '20px',
            }}>
              {totalPercentage}% utilizado
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(totalPercentage, 100)}%`,
              backgroundColor: 'white',
              borderRadius: '4px',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </div>
        </div>
      </div>

      {/* ─── Category Cards ──────────────────────────────────── */}
      <div style={{ padding: '0 1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {categories.map(cat => {
          const spent = getCategoryTotal(cat.id);
          const pct = getCategoryPercentage(cat.id);
          const color = getProgressColor(pct);
          const subs = getSortedSubcategories(cat.id);
          const iconData = CATEGORY_ICONS[cat.icon] || CATEGORY_ICONS['📁'];
          const isExpanded = expandedCategories[cat.id] !== false; // Default true if not found? 
          // But user wants "se guarde tal como el usuario lo dejó".
          // In page.js, I initialized expandedCategories to {}.
          // Let's make it so that if it's undefined, it's expanded (true).
          return (
            <div key={cat.id} style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              {/* Category header row */}
              <div 
                onClick={() => onToggleCategory(cat.id)}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', cursor: 'pointer' }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  backgroundColor: iconData.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', marginRight: '12px', flexShrink: 0,
                }}>
                  {iconData.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{cat.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    REF.: {formatCLP(cat.budget)}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginRight: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: color }}>
                    {cat.effectType === 'credit' ? '-' : ''}{formatCLP(spent)}
                  </span>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: color, margin: '1px 0 0' }}>{pct}%</p>
                </div>
                {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
              </div>

              {/* Progress bar */}
              <div style={{
                height: '5px', backgroundColor: '#f0f0f0', borderRadius: '3px',
                margin: '12px 0 16px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(pct, 100)}%`,
                  backgroundColor: color,
                  borderRadius: '3px',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </div>

              {isExpanded && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                  {subs.map((sub, idx) => {
                    const isFixed = cat.effectType === 'fixed_expense';
                    const isPaid = isFixed && fixedPayments.some(p => p.subId === sub.id);
                    
                    return (
                      <div key={sub.id}>
                        {idx > 0 && <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0' }} />}
                        <div
                          onClick={() => isFixed ? onToggleFixedPayment(sub.id) : onSubcategoryClick(cat.id, sub.id, sub.name)}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '12px 0', cursor: 'pointer',
                            transition: 'opacity 0.2s',
                            opacity: isPaid ? 0.6 : 1
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isFixed && (
                              <div style={{
                                width: '20px', height: '20px', borderRadius: '6px',
                                border: `2px solid ${isPaid ? '#22c55e' : '#cbd5e1'}`,
                                backgroundColor: isPaid ? '#22c55e' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}>
                                {isPaid && <Check size={14} color="white" strokeWidth={3} />}
                              </div>
                            )}
                            <span style={{ 
                              fontSize: '14px', fontWeight: '500', color: 'var(--text-main)',
                              textDecoration: isPaid ? 'line-through' : 'none'
                            }}>{sub.name}</span>
                            {!isFixed && <ChevronRight size={14} color="#cbd5e1" />}
                          </div>
                          <span style={{ 
                            fontSize: '14px', fontWeight: '600', color: 'var(--text-main)',
                            textDecoration: isPaid ? 'line-through' : 'none'
                          }}>
                            {formatCLP(isFixed ? (sub.monthlyAmount || 0) : getSubcategoryTotal(sub.id))}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Annotations Section ─────────────────────────────── */}
      <div style={{ padding: '0 1.5rem 3rem' }}>
        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Edit3 size={18} color="var(--text-muted)" />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
              Anotaciones del mes
            </h3>
          </div>
          <textarea
            value={activeAnotacion}
            onChange={(e) => onSaveAnotacion(e.target.value)}
            placeholder="Escribe recordatorios o notas libres aquí..."
            style={{
              width: '100%',
              minHeight: '100px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '14px',
              color: 'var(--text-main)',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>
    </div>
  );
}
