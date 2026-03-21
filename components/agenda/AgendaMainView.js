import { useState } from 'react';
import { Calendar, Plus, Check, Clock, MapPin, Pencil, Trash2, Target, ChevronRight, ChevronDown, ChevronUp, Image, X, ArrowLeft } from 'lucide-react';

const COVER_GRADIENTS = {
  Personal: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  Profesional: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  Salud: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  Finanzas: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  Educación: 'linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)',
  Relaciones: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
  Otros: 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
};

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgente', dot: '#ef4444', textColor: '#dc2626', bg: '#fef2f2' },
  normal: { label: 'Normal', dot: '#f59e0b', textColor: '#d97706', bg: '#fffbeb' },
  no_rush: { label: 'Sin apuro', dot: '#22c55e', textColor: '#16a34a', bg: '#f0fdf4' },
  annotation: { label: 'Anotaciones', dot: '#94a3b8', textColor: '#64748b', bg: '#f1f5f9' },
};

const STATUS_CONFIG = {
  iniciado: { label: 'Iniciado', color: '#6366f1' },
  en_progreso: { label: 'En progreso', color: '#f59e0b' },
  completado: { label: 'Completado', color: '#22c55e' },
  pausado: { label: 'Pausado', color: '#94a3b8' },
};

const ITEM_TYPE_ICONS = { task: null, appointment: '🩺', meeting: '👥', reminder: '🔔' };

function CollapsibleSection({ priorityKey, isOpen, onToggleSection, items, onToggle, onEdit, onDelete }) {
  const cfg = PRIORITY_CONFIG[priorityKey];

  if (items.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button 
        onClick={() => onToggleSection(priorityKey)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', 
          width: '100%', padding: '4px 0', border: 'none', background: 'none',
          cursor: 'pointer', marginBottom: '10px'
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cfg.dot }} />
        <span style={{ fontSize: '12px', fontWeight: '700', color: cfg.textColor, letterSpacing: '0.5px', flex: 1, textAlign: 'left' }}>
          {cfg.label.toUpperCase()} · {items.length}
        </span>
        {isOpen ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
      </button>

      {isOpen && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map(item => (
            <AgendaItemRow key={item.id} item={item} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function PendientesTab({ items, onToggle, onEdit, onDelete, expandedSections, onToggleSection }) {
  const priorityOrder = ['urgent', 'normal', 'no_rush', 'annotation'];

  if (items.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '48px', margin: '0 0 12px' }}>📋</p>
        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 8px' }}>Sin pendientes</p>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>Toca el botón "+" para agregar una tarea, cita o recordatorio.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 1.5rem 0' }}>
      {priorityOrder.map(pkg => (
        <CollapsibleSection 
          key={pkg} 
          priorityKey={pkg} 
          isOpen={expandedSections[pkg]}
          onToggleSection={onToggleSection}
          items={items.filter(i => i.priority === pkg)} 
          onToggle={onToggle} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}

function AgendaItemRow({ item, onToggle, onEdit, onDelete }) {
  const [showImage, setShowImage] = useState(false);
  const typeIcon = ITEM_TYPE_ICONS[item.itemType];

  return (
    <>
      <div style={{
      backgroundColor: 'var(--card-bg)', borderRadius: '16px',
      border: '1px solid var(--border-color)',
      padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '12px',
      opacity: item.isCompleted ? 0.55 : 1,
      transition: 'opacity 0.3s',
    }}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        style={{
          width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
          border: `2px solid ${item.isCompleted ? '#22c55e' : '#cbd5e1'}`,
          backgroundColor: item.isCompleted ? '#22c55e' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        {item.isCompleted && <Check size={13} color="white" strokeWidth={3} />}
      </button>

        {/* Content */}
        <div style={{ flex: 1, cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            {typeIcon && <span style={{ fontSize: '13px' }}>{typeIcon}</span>}
            <span style={{
              fontSize: '15px', fontWeight: '600', color: 'var(--text-main)',
              textDecoration: item.isCompleted ? 'line-through' : 'none',
            }}>{item.title}</span>
          </div>
          {/* Meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
            {item.dueDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Clock size={10} />
                {item.dueDate}{item.dueTime ? ` · ${item.dueTime}` : ''}
              </span>
            )}
            {item.imageUrl && (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowImage(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Image size={10} /> Foto
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button onClick={() => onEdit(item)} style={iconBtn}><Pencil size={14} color="#94a3b8" /></button>
          <button onClick={() => onDelete(item.id)} style={iconBtn}><Trash2 size={14} color="#94a3b8" /></button>
        </div>
      </div>

      {/* Image Modal */}
      {showImage && item.imageUrl && (
        <ImageModal url={item.imageUrl} onClose={() => setShowImage(false)} />
      )}
    </>
  );
}

function ImageModal({ url, onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none',
        color: 'white', padding: '10px', cursor: 'pointer'
      }}>
        <X size={28} />
      </button>
      <img src={url} alt="Visor" style={{ 
        maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)', objectFit: 'contain'
      }} />
    </div>
  );
}

function MetasTab({ goals, goalCheckpoints, onAddGoal, onEditGoal, onDeleteGoal, onViewGoalProgress }) {
  if (goals.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '48px', margin: '0 0 12px' }}>🎯</p>
        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 8px' }}>Sin metas aún</p>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>Define tus metas personales y profesionales.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {goals.map(goal => {
        const checks = goalCheckpoints.filter(c => c.goalId === goal.id);
        const completedChecks = checks.filter(c => c.isCompleted).length;
        const statusCfg = STATUS_CONFIG[goal.status] || STATUS_CONFIG.iniciado;
        const gradient = goal.coverGradient || COVER_GRADIENTS[goal.category] || COVER_GRADIENTS.Otros;

          return (
          <div key={goal.id} style={{
            backgroundColor: 'var(--card-bg)', borderRadius: '24px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          }}>
            {/* Cover */}
            <div style={{ 
              height: '140px', 
              background: goal.coverImage ? `url(${goal.coverImage}) center/cover no-repeat` : gradient, 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'flex-end', 
              padding: '16px' 
            }}>
              {!goal.coverImage && <Target size={32} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '16px', left: '16px' }} />}
              <div style={{
                backgroundColor: statusCfg.color,
                color: 'white', fontSize: '10px', fontWeight: '800',
                padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px',
              }}>
                {statusCfg.label.toUpperCase()}
              </div>
              {/* Horizon */}
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                color: 'white', fontSize: '10px', fontWeight: '700',
                padding: '4px 10px', borderRadius: '20px',
              }}>
                {goal.timeHorizon === 'short' ? 'Corto plazo' : 'Largo plazo'}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-main)', margin: 0, flex: 1 }}>{goal.title}</h3>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginLeft: '8px' }}>
                  <button onClick={() => onEditGoal(goal)} style={iconBtn}><Pencil size={14} color="#94a3b8" /></button>
                  <button onClick={() => onDeleteGoal(goal.id)} style={iconBtn}><Trash2 size={14} color="#94a3b8" /></button>
                </div>
              </div>

              {goal.description ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {goal.description}
                </p>
              ) : null}

              <button onClick={() => onViewGoalProgress(goal.id)} style={{
                width: '100%', padding: '12px', borderRadius: '16px',
                border: 'none', backgroundColor: '#f0fdf4',
                color: '#16a34a', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                transition: 'all 0.2s',
              }}>
                Ver progreso <ChevronRight size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GoalProgressView({ goal, checkpoints, onToggleCheckpoint, onBack, onEdit }) {
  const completed = checkpoints.filter(c => c.isCompleted).length;
  const total = checkpoints.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const statusCfg = STATUS_CONFIG[goal.status] || STATUS_CONFIG.iniciado;

  return (
    <div className="fade-in" style={{ paddingBottom: '100px', backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem',
        display: 'flex', alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-color)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 0 8px', flex: 1, color: 'var(--text-main)' }}>Progreso de meta</h2>
        <button onClick={() => onEdit(goal)} style={{ ...iconBtn, color: '#6366f1', fontSize: '13px', fontWeight: '600' }}>
          <Pencil size={16} />
        </button>
      </header>

      {/* Hero card */}
      <div style={{ margin: '0 1.5rem', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
        <div style={{ 
          height: '160px', 
          background: goal.coverImage ? `url(${goal.coverImage}) center/cover no-repeat` : (goal.coverGradient || COVER_GRADIENTS[goal.category] || COVER_GRADIENTS.Otros),
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: statusCfg.color, color: 'white', fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px' }}>
            {statusCfg.label.toUpperCase()}
          </div>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 8px' }}>{goal.title}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{goal.description}</p>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '12px', borderRadius: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', margin: '0 0 4px', letterSpacing: '0.5px' }}>HORIZONTE</p>
              <p style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>{goal.timeHorizon === 'short' ? 'Corto plazo' : 'Largo plazo'}</p>
            </div>
            <div style={{ flex: 1, backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700', margin: '0 0 4px', letterSpacing: '0.5px' }}>PROGRESO</p>
              <p style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>{Math.round(progress)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Large */}
      <div style={{ padding: '2rem 1.5rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Mini objetivos</span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>{completed} completados de {total}</span>
        </div>
        <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', width: `${progress}%`, backgroundColor: '#22c55e', 
            borderRadius: '10px', transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' 
          }} />
        </div>
      </div>

      {/* Checkpoints List */}
      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {checkpoints.length > 0 ? checkpoints.map(cp => (
          <div key={cp.id} 
               onClick={() => onToggleCheckpoint(cp.id)}
               style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '16px',
            backgroundColor: cp.isCompleted ? '#f0fdf4' : 'var(--card-bg)',
            border: `1.5px solid ${cp.isCompleted ? '#bcf0ce' : 'var(--border-color)'}`,
            cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '6px',
              border: `2px solid ${cp.isCompleted ? '#22c55e' : '#cbd5e1'}`,
              backgroundColor: cp.isCompleted ? '#22c55e' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {cp.isCompleted && <Check size={12} color="white" strokeWidth={3} />}
            </div>
            <span style={{ 
              fontSize: '14px', fontWeight: '600', 
              color: cp.isCompleted ? '#16a34a' : 'var(--text-main)',
              textDecoration: cp.isCompleted ? 'line-through' : 'none'
            }}>{cp.title}</span>
          </div>
        )) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', padding: '20px' }}>No hay mini objetivos definidos.</p>
        )}
      </div>
    </div>
  );
}

export function AgendaMainView({
  items, goals, goalCheckpoints, activeTab, onTabChange,
  onAddItem, onAddGoal, onToggleItem, onEditItem, onDeleteItem,
  onEditGoal, onDeleteGoal, onCalendarClick,
  viewingGoalId, isViewingProgress, onToggleCheckpoint, onBack, onViewGoalProgress,
  expandedSections, onToggleSection
}) {
  const pendingCount = items.filter(i => !i.isCompleted).length;

  if (isViewingProgress && viewingGoalId) {
    const goal = goals.find(g => g.id === viewingGoalId);
    const checks = goalCheckpoints.filter(c => c.goalId === viewingGoalId);
    if (goal) {
      return (
        <GoalProgressView 
          goal={goal} 
          checkpoints={checks} 
          onToggleCheckpoint={onToggleCheckpoint} 
          onBack={onBack}
          onEdit={onEditGoal}
        />
      );
    }
  }

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>Agenda</h1>
        <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
          <button
            onClick={onCalendarClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '6px', display: 'flex' }}
          >
            <Calendar size={22} />
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div style={{ padding: '0 1.5rem 0', marginBottom: '0' }}>
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--card-bg)', borderRadius: '16px',
          border: '1px solid var(--border-color)', padding: '4px',
        }}>
          {[
            { key: 'pendientes', label: 'Pendientes', count: pendingCount },
            { key: 'metas', label: 'Metas', count: goals.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === tab.key ? '#22c55e' : 'transparent',
                color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
                fontSize: '14px', fontWeight: '700', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '20px',
                  backgroundColor: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ paddingBottom: '100px' }}>
        {activeTab === 'pendientes' ? (
          <PendientesTab 
            items={items} 
            onToggle={onToggleItem} 
            onEdit={onEditItem} 
            onDelete={onDeleteItem} 
            expandedSections={expandedSections} 
            onToggleSection={onToggleSection} 
          />
        ) : (
          <MetasTab goals={goals} goalCheckpoints={goalCheckpoints} onAddGoal={onAddGoal} onEditGoal={onEditGoal} onDeleteGoal={onDeleteGoal} onViewGoalProgress={onViewGoalProgress} />
        )}
      </div>

      {/* FAB */}
      <button
        onClick={activeTab === 'pendientes' ? onAddItem : onAddGoal}
        style={{
          position: 'fixed', bottom: '86px', right: '1.5rem',
          width: '56px', height: '56px', borderRadius: '18px',
          backgroundColor: '#22c55e', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        <Plus size={26} color="white" />
      </button>
    </div>
  );
}

const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' };
