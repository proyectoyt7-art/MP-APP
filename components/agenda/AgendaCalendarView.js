"use client"
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Clock, MapPin } from 'lucide-react';

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const ITEM_TYPE_ICONS = { task: '✓', appointment: '🩺', meeting: '👥', reminder: '🔔' };

function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function getPriorityDot(priority) {
  if (priority === 'urgent') return '#ef4444';
  if (priority === 'normal') return '#f59e0b';
  return '#22c55e';
}

export function AgendaCalendarView({ items, onToggleItem, onBack }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(1);
  };

  const getItemsForDate = (d) => {
    const dateStr = formatDate(year, month, d);
    return items.filter(i => i.dueDate === dateStr);
  };

  const selectedDateStr = formatDate(year, month, selectedDay);
  const selectedItems = items.filter(i => i.dueDate === selectedDateStr);
  const isToday = (d) => d === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  // Build calendar grid
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '2rem' }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem',
        display: 'flex', alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky', top: 0, backgroundColor: 'var(--bg-color)', zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 0 8px' }}>Calendario</h1>
      </header>

      {/* Month Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem 0' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
          <ChevronLeft size={22} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
          {MONTH_NAMES[month]} {year}
        </h2>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{ padding: '1rem 1.5rem' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', padding: '4px 0', letterSpacing: '0.3px' }}>{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {cells.map((d, idx) => {
            if (!d) return <div key={`empty-${idx}`} />;
            const dayItems = getItemsForDate(d);
            const hasItems = dayItems.length > 0;
            const isSelected = d === selectedDay;
            const today = isToday(d);

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '12px', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  paddingTop: '8px', paddingBottom: '8px', gap: '3px',
                  backgroundColor: isSelected ? '#22c55e' : today ? '#f0fdf4' : 'transparent',
                  fontWeight: isSelected || today ? '700' : '400',
                  fontSize: '14px',
                  color: isSelected ? 'white' : today ? '#16a34a' : 'var(--text-main)',
                  transition: 'all 0.15s',
                }}
              >
                {d}
                {hasItems && (
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {dayItems.slice(0, 3).map((item, i) => (
                      <div key={i} style={{
                        width: '4px', height: '4px', borderRadius: '50%',
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.8)' : getPriorityDot(item.priority),
                      }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Items */}
      <div style={{ padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', margin: 0, flex: 1 }}>
            {selectedDay} de {MONTH_NAMES[month]}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
            {selectedItems.length === 0 ? 'Sin eventos' : `${selectedItems.length} evento${selectedItems.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {selectedItems.length === 0 ? (
          <div style={{
            padding: '2rem', textAlign: 'center',
            backgroundColor: 'var(--card-bg)', borderRadius: '20px',
            border: '1px solid var(--border-color)',
          }}>
            <p style={{ fontSize: '32px', margin: '0 0 8px' }}>📅</p>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>Sin eventos para este día</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedItems.map(item => (
              <div key={item.id} style={{
                backgroundColor: 'var(--card-bg)', borderRadius: '16px',
                border: '1px solid var(--border-color)', padding: '1rem',
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                opacity: item.isCompleted ? 0.6 : 1, transition: 'opacity 0.2s',
              }}>
                <button
                  onClick={() => onToggleItem(item.id)}
                  style={{
                    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                    border: `2px solid ${item.isCompleted ? '#22c55e' : '#cbd5e1'}`,
                    backgroundColor: item.isCompleted ? '#22c55e' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {item.isCompleted && <Check size={14} color="white" strokeWidth={3} />}
                </button>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', margin: 0, textDecoration: item.isCompleted ? 'line-through' : 'none' }}>
                    {ITEM_TYPE_ICONS[item.itemType] || '✓'} {item.title}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                    {item.dueTime && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <Clock size={11} /> {item.dueTime}
                      </span>
                    )}
                    {item.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <MapPin size={11} /> {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
