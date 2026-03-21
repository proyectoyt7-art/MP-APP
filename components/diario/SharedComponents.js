import { ChevronLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export function JournalHeader({ title, onBack, rightIcon = 'calendar', onSelectDate }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1.5rem 1.5rem 0' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px' }}>
        <ChevronLeft size={24} />
      </button>
      <h1 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
        {title}
      </h1>
      <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
        {rightIcon === 'calendar' && (
          <div style={{ position: 'relative', width: '24px', height: '24px' }}>
            <Calendar size={22} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', color: 'var(--text-main)' }} />
            <input 
              type="date"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              onChange={(e) => {
                if(e.target.value && onSelectDate) {
                  const [y, m, d] = e.target.value.split('-');
                  onSelectDate(new Date(y, m - 1, d));
                }
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}

export function JournalDateStrip({ selectedDate, onSelectDate }) {
  // Generate 7 days centered around selectedDate
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - (3 - i));
    return d;
  });

  const isSameDay = (d1, d2) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  return (
    <div style={{ display: 'flex', overflowX: 'auto', padding: '0 1.5rem 1.5rem', gap: '12px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
      {days.map((date, i) => {
        const isSelected = isSameDay(date, selectedDate);
        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' }).charAt(0).toUpperCase();
        const dayNumber = date.getDate();

        return (
          <button
            key={i}
            onClick={() => onSelectDate(date)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '48px',
              height: '64px',
              borderRadius: '24px',
              border: 'none',
              backgroundColor: isSelected ? 'var(--text-main)' : 'var(--white)',
              color: isSelected ? 'var(--white)' : 'var(--text-main)',
              boxShadow: isSelected ? '0 4px 10px rgba(0,0,0,0.1)' : '0 2px 5px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: isSelected ? 'none' : '1px solid var(--border-color)'
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '500', opacity: isSelected ? 0.9 : 0.6, marginBottom: '4px' }}>{dayName}</span>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>{dayNumber}</span>
          </button>
        );
      })}
    </div>
  );
}
