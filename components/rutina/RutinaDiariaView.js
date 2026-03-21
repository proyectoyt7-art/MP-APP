import { Calendar, Settings, CheckCircle2, Circle, Clock, CheckSquare, Square } from 'lucide-react';

const SOFT_COLORS = [
  { id: 'default', bg: '#f8fafc', border: '#e2e8f0', accent: '#94a3b8' },
  { id: 'blue', bg: '#eff6ff', border: '#bfdbfe', accent: '#3b82f6' },
  { id: 'green', bg: '#f0fdf4', border: '#bbf7d0', accent: '#22c55e' },
  { id: 'yellow', bg: '#fffbeb', border: '#fef3c7', accent: '#f59e0b' },
  { id: 'purple', bg: '#faf5ff', border: '#e9d5ff', accent: '#a855f7' },
  { id: 'pink', bg: '#fff1f2', border: '#fecdd3', accent: '#ec4899' },
];

export function RutinaDiariaView({
  routines, activities, goals, progressPercentage,
  completedActivityIds, completedGoalIds,
  onToggleActivity, onToggleGoal, onSettingsClick, onCalendarClick
}) {
  
  const hasRoutine = routines.length > 0;
  const is100Percent = progressPercentage === 100;
  
  return (
    <div style={{ padding: '0', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>Rutina Diaria</h1>
        <div style={{ display: 'flex', gap: '16px', position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
          <button onClick={onCalendarClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', transition: 'transform 0.2s' }}>
            <Calendar size={22} />
          </button>
          <button onClick={onSettingsClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', transition: 'transform 0.2s' }}>
            <Settings size={22} />
          </button>
        </div>
      </header>

      {!hasRoutine ? (
        // Empty State
        <div style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Calendar size={40} color="var(--text-muted)" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px' }}>Sin rutina asignada</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '2rem' }}>
            Hoy no tienes ninguna rutina planeada. Tómate el día libre, o configura tus rutinas recurrentes para mantener el ritmo.
          </p>
          <button onClick={onSettingsClick} style={{ backgroundColor: 'var(--text-main)', color: 'var(--white)', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            Configurar Rutina
          </button>
        </div>
      ) : (
        // Progress Circular Widget
        <div style={{ padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', backgroundColor: 'var(--card-bg)', borderRadius: '20px', border: '1px solid var(--border-color)', marginBottom: '2rem', boxShadow: is100Percent ? '0 10px 25px rgba(216, 194, 170, 0.2)' : 'none', transition: 'box-shadow 0.5s ease' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 45}`} 
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - (progressPercentage / 100))}`}
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className={is100Percent ? 'celebrate-text' : ''} style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>{progressPercentage}%</span>
              </div>
            </div>
            <div style={{ marginLeft: '1.5rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>
                {is100Percent ? "¡Buen trabajo hoy!" : "Progreso actual"}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                {is100Percent ? "Has completado todas tus metas. Disfruta tu racha de éxito." : "Casi lo logras, mantente consciente y enfocado."}
              </p>
            </div>
          </div>

          {/* Activities Timeline */}
          {activities.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Actividades</h3>
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '20px', width: '2px', backgroundColor: 'var(--border-color)' }}></div>
                
                {activities.map((act, index) => {
                  const isCompleted = completedActivityIds.includes(act.id);
                  const currentColor = SOFT_COLORS.find(c => c.id === (act.color_id || 'default')) || SOFT_COLORS[0];
                  return (
                    <div key={act.id} style={{ position: 'relative', marginBottom: '1.5rem', display: 'flex' }}>
                      {/* Timeline Dot */}
                      <div style={{ position: 'absolute', left: '-20px', top: '22px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isCompleted ? currentColor.accent : '#ccc', zIndex: 2 }}></div>
                      
                      <div style={{ width: '60px', flexShrink: 0, paddingTop: '16px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', display: 'block' }}>{act.start_time}</span>
                      </div>
                      
                      <div 
                        onClick={() => onToggleActivity(act.id)}
                        style={{ 
                          flex: 1, 
                          backgroundColor: isCompleted ? 'var(--card-bg)' : currentColor.bg, 
                          border: `1px solid ${isCompleted ? 'var(--border-color)' : currentColor.border}`, 
                          borderLeft: isCompleted ? `1px solid var(--border-color)` : `6px solid ${currentColor.accent}`,
                          borderRadius: '16px', 
                          padding: '16px', 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          opacity: isCompleted ? 0.75 : 1,
                          transform: isCompleted ? 'scale(0.98)' : 'scale(1)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: isCompleted ? 'none' : '0 2px 8px rgba(0,0,0,0.03)'
                        }}
                      >
                         <div>
                           <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 6px 0', textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.6 : 1, transition: 'all 0.3s' }}>{act.title}</h4>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', opacity: isCompleted ? 0.5 : 1 }}>
                             <Clock size={12} />
                             <span style={{ fontSize: '12px' }}>{act.duration} min</span>
                           </div>
                         </div>
                         <div style={{ color: isCompleted ? '#16a34a' : 'var(--border-color)', transform: isCompleted ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.3s ease' }}>
                           {isCompleted ? <CheckCircle2 size={24} fill="#16a34a" color="white" /> : <Circle size={24} />}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Goals Checklist */}
          {goals.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '1rem' }}>Objetivos del día</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {goals.map(goal => {
                  const isCompleted = completedGoalIds.includes(goal.id);
                  return (
                    <div 
                      key={goal.id} 
                      onClick={() => onToggleGoal(goal.id)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '12px', 
                        padding: '16px', 
                        backgroundColor: 'var(--card-bg)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '16px', 
                        cursor: 'pointer',
                        opacity: isCompleted ? 0.75 : 1,
                        transform: isCompleted ? 'scale(0.98)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        boxShadow: isCompleted ? 'none' : '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ color: isCompleted ? '#16a34a' : 'var(--text-muted)', marginTop: '2px', transition: 'all 0.3s' }}>
                         {isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                      <span style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.4', textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.6 : 1, transition: 'all 0.3s' }}>
                        {goal.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
