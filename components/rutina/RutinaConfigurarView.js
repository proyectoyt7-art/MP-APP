import { ChevronLeft, PlusCircle, PenSquare, CheckSquare, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function RutinaConfigurarView({ routines, onBack, onCreateClick, onEditClick, onSelectClick }) {
  const [showEditList, setShowEditList] = useState(false);

  return (
    <div style={{ padding: '0', backgroundColor: 'var(--bg-color)' }}>
      <header style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px' }}>
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 0 12px' }}>Configurar Rutina</h2>
      </header>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Crear Nueva */}
        <div 
          onClick={onCreateClick}
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
        >
          <div style={{ backgroundColor: '#f0f4ff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
            <PlusCircle size={24} color="#3b82f6" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 4px 0' }}>Crear nueva rutina</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Diseña una rutina desde cero con tus tiempos.</p>
          </div>
          <ChevronRight size={20} color="var(--text-muted)" />
        </div>

        {/* Editar Existente */}
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div 
            onClick={() => setShowEditList(!showEditList)}
            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <div style={{ backgroundColor: '#fff7ed', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
              <PenSquare size={24} color="#ea580c" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 4px 0' }}>Editar rutina existente</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Modifica actividades u objetivos de tus rutinas.</p>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" style={{ transform: showEditList ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
          </div>
          
          {showEditList && (
            <div style={{ borderTop: '1px solid var(--border-color)', backgroundColor: '#faf9f8' }}>
              {routines.map(r => (
                <div 
                  key={r.id} 
                  onClick={() => onEditClick(r.id)}
                  style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}>{r.name}</span>
                  <ChevronRight size={16} color="var(--primary-accent)" />
                </div>
              ))}
              {routines.length === 0 && (
                 <div style={{ padding: '1rem 1.5rem', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>No hay rutinas guardadas.</div>
              )}
            </div>
          )}
        </div>

        {/* Seleccionar Rutina */}
        <div 
          onClick={onSelectClick}
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
        >
          <div style={{ backgroundColor: '#f0fdf4', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
            <CheckSquare size={24} color="#16a34a" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 4px 0' }}>Seleccionar rutina</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Asigna tus rutinas guardadas a días específicos.</p>
          </div>
          <ChevronRight size={20} color="var(--text-muted)" />
        </div>

      </div>
    </div>
  );
}
