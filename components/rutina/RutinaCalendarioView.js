import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function RutinaCalendarioView({ dailySummaries, onBack }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Ajustar para que lunes sea el primer día de la semana (0=Sun original -> 6=Sun)
  const firstDayIndex = (startDayOfMonth(currentMonth) + 6) % 7; 

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayLabels = ["L", "M", "Mi", "J", "V", "S", "D"];

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const totalDays = daysInMonth(currentMonth);
  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) calendarDays.push(null);
  for (let d = 1; d <= totalDays; d++) calendarDays.push(d);

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 0 12px' }}>Historial de Rutina</h1>
      </header>

      <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: 'var(--white)', padding: '12px 1rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex' }}><ChevronLeft size={20} /></button>
          <span style={{ fontWeight: '600', fontSize: '16px' }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex' }}><ChevronRight size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
          {dayLabels.map(l => (
            <span key={l} style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', paddingBottom: '8px' }}>{l}</span>
          ))}
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            
            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const summary = dailySummaries.find(s => s.date === dateStr);
            
            let bgColor = 'var(--white)';
            let textColor = 'var(--text-main)';
            let border = '1px solid var(--border-color)';
            
            if (summary) {
              if (summary.isFull) {
                bgColor = '#16a34a'; // Verde fuerte
                textColor = 'white';
                border = 'none';
              } else if (summary.percentage > 0) {
                bgColor = '#dcfce7'; // Verde suave
                border = '1px solid #bbf7d0';
              } else {
                bgColor = '#f3f4f6'; // Gris neutro (día intentado pero 0% o sin ítems marcados)
              }
            }

            return (
              <div 
                key={idx} 
                style={{ 
                  height: '45px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  backgroundColor: bgColor,
                  color: textColor,
                  border: border,
                  boxShadow: summary?.isFull ? '0 4px 6px rgba(22, 163, 74, 0.2)' : 'none'
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '12px', padding: '1.5rem', backgroundColor: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
           <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>Indicadores</h3>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#16a34a' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Completado (100%)</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>En progreso (&lt;100%)</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'var(--white)', border: '1px solid var(--border-color)' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sin actividad registrada</span>
           </div>
        </div>
      </div>
    </div>
  );
}
