import { PlusCircle, FileText, BrainCircuit, Activity } from 'lucide-react';

export function JournalEmptyState({ onCreateEntry }) {
  return (
    <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
      <div style={{ width: '120px', height: '120px', backgroundColor: 'var(--border-color)', borderRadius: '50%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
        <FileText size={48} color="var(--text-muted)" />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>Aún no hay entrada para este día</h2>
      <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '2rem', maxWidth: '280px' }}>
        Es un buen momento para reflexionar y capturar tus pensamientos.
      </p>
      
      <button 
        onClick={onCreateEntry}
        style={{
          backgroundColor: 'var(--text-main)',
          color: 'var(--white)',
          border: 'none',
          padding: '14px 32px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <PlusCircle size={20} />
        Añadir escrito
      </button>
    </div>
  );
}

export function JournalEntryDetailView({ entry }) {
  if (!entry) return null;
  
  return (
    <div style={{ padding: '0 1.5rem', paddingBottom: '2rem' }}>

      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>Texto procesado de la entrada</h3>
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', marginBottom: '2rem', fontSize: '15px', lineHeight: '1.6', color: 'var(--text-main)', fontStyle: 'italic', position: 'relative', overflow: 'hidden' }}>
        {/* Placeholder indicating processing or origin */}
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 12px', backgroundColor: '#e5e7eb', color: '#6b7280', fontSize: '11px', fontWeight: '600', borderBottomLeftRadius: '12px' }}>
          {entry.input_method === 'camera' ? 'Vía Escaneo' : entry.input_method === 'voice' ? 'Vía Audio' : 'Texto'}
        </div>
        <p style={{ paddingTop: '16px', margin: 0 }}>
          "{entry.ocr_text || entry.note}"
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <BrainCircuit size={20} color="var(--primary-accent)" />
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>Reflexión del día</h3>
      </div>
      <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '1.25rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', margin: 0 }}>
          {entry.reflection_text}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Activity size={20} color="var(--primary-accent)" />
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>Esencia del día</h3>
      </div>
      <div style={{ backgroundColor: '#fcfaf8', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{entry.essence_title}</h4>
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary-accent)' }}>{entry.essence_score}%</span>
        </div>
        
        {/* Progress Bar Container */}
        <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e5e5', borderRadius: '4px', marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ width: `${entry.essence_score}%`, height: '100%', backgroundColor: 'var(--primary-accent)', borderRadius: '4px' }}></div>
        </div>

        <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--text-muted)' }}>
          {entry.essence_description}
        </p>
        
        <div style={{ marginTop: '16px', display: 'inline-block', backgroundColor: 'var(--white)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
          Emoción principal: {entry.emotion}
        </div>
      </div>
    </div>
  );
}
