import { useState } from 'react';
import { ChevronLeft, Check, CalendarDays } from 'lucide-react';

export function RutinaSeleccionarView({ routines, routineDays, onApply, onCancel }) {
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  
  const daysOfWeek = [
    { id: 1, label: 'L' }, { id: 2, label: 'M' }, { id: 3, label: 'Mi' },
    { id: 4, label: 'J' }, { id: 5, label: 'V' }, { id: 6, label: 'S' }, { id: 0, label: 'D' }
  ];

  const toggleDay = (dayId) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const handleApply = () => {
    if (selectedRoutine && selectedDays.length > 0) {
      onApply([{ routine_id: selectedRoutine, days: selectedDays }]);
    }
  };

  const handleRoutineClick = (rId) => {
    setSelectedRoutine(rId);
    // Auto populate existing days for UX
    const existingDays = routineDays.filter(rd => rd.routine_id === rId).map(rd => rd.day_of_week);
    setSelectedDays(existingDays);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px' }}>
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 0 12px' }}>Asignar Rutina</h2>
      </header>

      <div style={{ padding: '0 1.5rem' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '1rem' }}>Tus rutinas guardadas</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2.5rem' }}>
          {routines.map(r => {
            const isSelected = selectedRoutine === r.id;
            return (
              <div 
                key={r.id} 
                onClick={() => handleRoutineClick(r.id)}
                style={{
                  backgroundColor: isSelected ? 'var(--white)' : 'var(--card-bg)',
                  border: isSelected ? '2px solid var(--primary-accent)' : '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: isSelected ? '#f5f0e6' : 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                    <CalendarDays size={20} color={isSelected ? "var(--primary-accent)" : "var(--text-muted)"} />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: isSelected ? '600' : '500', color: 'var(--text-main)' }}>{r.name}</span>
                </div>
                {isSelected && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} color="var(--white)" />
                  </div>
                )}
              </div>
            );
          })}
          {routines.length === 0 && (
             <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>No tienes rutinas para asignar. Crea una primero.</p>
          )}
        </div>

        {selectedRoutine && (
          <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '1rem' }}>Aplicar a los días</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
              {daysOfWeek.map((day, index) => {
                const isActive = selectedDays.includes(day.id);
                return (
                  <button
                    key={`sd-${index}-${day.id}`}
                    onClick={() => toggleDay(day.id)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      border: isActive ? 'none' : '1px solid var(--border-color)',
                      backgroundColor: isActive ? 'var(--text-main)' : 'var(--white)',
                      color: isActive ? 'var(--white)' : 'var(--text-main)',
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={handleApply}
              disabled={selectedDays.length === 0}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: selectedDays.length > 0 ? 'var(--text-main)' : 'var(--border-color)',
                color: selectedDays.length > 0 ? 'var(--white)' : 'var(--text-muted)',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: selectedDays.length > 0 ? 'pointer' : 'not-allowed',
                boxShadow: selectedDays.length > 0 ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Aplicar rutina
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
