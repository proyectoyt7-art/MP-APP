import { Sparkles, TrendingUp, CalendarDays } from 'lucide-react';

export function JournalProgressView() {
  return (
    <div style={{ padding: '0 1.5rem' }}>
      {/* Principal Insight Card */}
      <div style={{
        backgroundColor: 'var(--primary-accent)',
        borderRadius: '20px',
        padding: '1.5rem',
        color: 'var(--text-main)',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 12px rgba(216, 194, 170, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={20} color="var(--white)" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--white)' }}>Insight Principal</span>
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', lineHeight: '1.3' }}>
          Equilibrio y Calma
        </h3>
        <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: 0.9 }}>
          Esta semana has logrado mantener niveles altos de tranquilidad. Tus escritos reflejan una mejora significativa en tu manejo del estrés.
        </p>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-main)' }}>Resúmenes</h2>

      {/* Weekly Summary */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ padding: '6px', backgroundColor: '#f0f4f8', borderRadius: '8px', color: '#5b82a1' }}>
            <TrendingUp size={18} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: '600' }}>Resumen Semanal</span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Has explorado temas relacionados con tu crecimiento personal. La "ansiedad" disminuyó un 20% respecto a la semana pasada.
        </p>
      </div>

      {/* Monthly Summary */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ padding: '6px', backgroundColor: '#fdf6e3', borderRadius: '8px', color: '#b58900' }}>
            <CalendarDays size={18} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: '600' }}>Resumen Mensual</span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Marzo ha sido un mes de grandes revelaciones. Descubriste nuevos patrones de pensamiento positivo en tus rutinas matutinas.
        </p>
      </div>

      {/* Suggestion Card */}
      <div style={{
        backgroundColor: '#f6f7f9',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px dashed #d1d5db',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          "Sugerencia: Intenta escribir sobre lo que te inspira hoy."
        </p>
      </div>
    </div>
  );
}
