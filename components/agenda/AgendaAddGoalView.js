"use client"
import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, X, Target } from 'lucide-react';

const GOAL_CATEGORIES = ['Personal', 'Profesional', 'Salud', 'Finanzas', 'Educación', 'Relaciones', 'Otros'];
const HORIZONS = [
  { value: 'short', label: 'Corto plazo', sub: 'semanas · meses' },
  { value: 'long', label: 'Largo plazo', sub: 'meses · años' },
];
const STATUSES = [
  { value: 'iniciado', label: 'Iniciado', color: '#6366f1' },
  { value: 'en_progreso', label: 'En progreso', color: '#f59e0b' },
  { value: 'completado', label: 'Completado', color: '#22c55e' },
  { value: 'pausado', label: 'Pausado', color: '#94a3b8' },
];

const COVER_GRADIENTS = {
  Personal: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  Profesional: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  Salud: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  Finanzas: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  Educación: 'linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)',
  Relaciones: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
  Otros: 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
};

export function AgendaAddGoalView({ editGoal, onSave, onCancel }) {
  const isEditing = !!editGoal;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [horizon, setHorizon] = useState('short');
  const [status, setStatus] = useState('iniciado');
  const [checkpoints, setCheckpoints] = useState([]);
  const [newCheckpoint, setNewCheckpoint] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    if (editGoal) {
      setTitle(editGoal.title || '');
      setDescription(editGoal.description || '');
      setCategory(editGoal.category || 'Personal');
      setHorizon(editGoal.timeHorizon || 'short');
      setStatus(editGoal.status || 'iniciado');
      setCheckpoints(editGoal.checkpoints || []);
      setCoverImage(editGoal.coverImage || null);
    }
  }, [editGoal]);

  const addCheckpoint = () => {
    if (!newCheckpoint.trim()) return;
    setCheckpoints(prev => [...prev, { id: `cp_${Date.now()}`, title: newCheckpoint.trim(), isCompleted: false }]);
    setNewCheckpoint('');
  };

  const removeCheckpoint = (id) => setCheckpoints(prev => prev.filter(c => c.id !== id));

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      ...(editGoal || {}),
      title: title.trim(),
      description: description.trim(),
      category,
      timeHorizon: horizon,
      status,
      coverGradient: COVER_GRADIENTS[category],
      coverImage,
      checkpoints,
      routineActivityId: null,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const coverGradient = COVER_GRADIENTS[category];

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        padding: '1.5rem',
        display: 'flex', alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky', top: 0,
        backgroundColor: 'var(--bg-color)', zIndex: 10,
      }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 0 8px' }}>
          {isEditing ? 'Editar meta' : 'Nueva meta'}
        </h1>
      </header>

      {/* Cover Preview */}
      <div style={{ 
        height: '160px', 
        background: coverImage ? `url(${coverImage}) center/cover no-repeat` : coverGradient, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {!coverImage && <Target size={48} color="rgba(255,255,255,0.7)" />}
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '8rem' }}>

        {/* Title */}
        <div>
          <label style={labelStyle}>Título de la meta</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ej: Aprender marketing digital, Correr 10km..."
            style={{ ...inputStyle, fontSize: '16px', fontWeight: '500' }}
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Descripción y propósito</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="¿Por qué es importante esta meta para ti? ¿Qué quieres lograr exactamente?"
            rows={4}
            style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label style={labelStyle}>Imagen de portada (opcional)</label>
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '14px', borderRadius: '12px', border: '1.5px dashed var(--border-color)',
            backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)', fontSize: '14px',
            fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s'
          }}>
            {coverImage ? 'Cambiar imagen' : 'Subir imagen de portada'}
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          {coverImage && (
            <button 
              onClick={() => setCoverImage(null)}
              style={{
                marginTop: '8px', background: 'none', border: 'none', color: '#ef4444',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Eliminar imagen personalizada
            </button>
          )}
        </div>

        {/* Horizon */}
        <div>
          <label style={labelStyle}>Horizonte temporal</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {HORIZONS.map(h => (
              <button key={h.value} onClick={() => setHorizon(h.value)} style={{
                padding: '14px', borderRadius: '16px', textAlign: 'left',
                border: `1.5px solid ${horizon === h.value ? '#22c55e' : 'var(--border-color)'}`,
                backgroundColor: horizon === h.value ? '#f0fdf4' : 'var(--card-bg)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: horizon === h.value ? '#16a34a' : 'var(--text-main)', margin: 0 }}>{h.label}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0', fontStyle: 'italic' }}>{h.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Status (only in edit mode) */}
        {isEditing && (
          <div>
            <label style={labelStyle}>Estado actual</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {STATUSES.map(s => (
                <button key={s.value} onClick={() => setStatus(s.value)} style={{
                  padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                  border: `1.5px solid ${status === s.value ? s.color : 'var(--border-color)'}`,
                  backgroundColor: status === s.value ? `${s.color}18` : 'var(--card-bg)',
                  color: status === s.value ? s.color : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.3px',
                }}>{s.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Mini-objectives / Checkpoints */}
        <div>
          <label style={labelStyle}>Mini objetivos / Pasos intermedios</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            {checkpoints.map(cp => (
              <div key={cp.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                borderRadius: '12px', padding: '10px 14px',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '14px', color: 'var(--text-main)' }}>{cp.title}</span>
                <button onClick={() => removeCheckpoint(cp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newCheckpoint}
              onChange={e => setNewCheckpoint(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCheckpoint()}
              placeholder="Añadir paso intermedio..."
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={addCheckpoint} style={{
              width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#22c55e',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Plus size={20} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed', bottom: '70px', left: 0, right: 0,
        padding: '1rem 1.5rem', backgroundColor: 'var(--bg-color)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex', gap: '12px',
      }}>
        <button onClick={onCancel} style={{ ...btnSecondary, flex: 1 }}>Cancelar</button>
        <button onClick={handleSave} disabled={!title.trim()} style={{
          ...btnPrimary, flex: 2,
          opacity: title.trim() ? 1 : 0.5,
          cursor: title.trim() ? 'pointer' : 'not-allowed',
        }}>
          {isEditing ? 'Guardar cambios' : 'Guardar meta'}
        </button>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' };
const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', fontSize: '14px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit' };
const btnPrimary = { backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' };
const btnSecondary = { backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1.5px solid var(--border-color)', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' };
