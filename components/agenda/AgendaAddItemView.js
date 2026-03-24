"use client"
import { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Clock, Calendar, FileText } from 'lucide-react';

const PRIORITIES = [
  { value: 'urgent', label: 'Urgente' },
  { value: 'normal', label: 'Normal' },
  { value: 'no_rush', label: 'Sin apuro' },
  { value: 'annotation', label: 'Anotación' },
];
const ITEM_TYPES = [
  { value: 'task', label: 'Tarea', icon: '✓' },
  { value: 'appointment', label: 'Cita', icon: '🩺' },
  { value: 'meeting', label: 'Reunión', icon: '👥' },
  { value: 'reminder', label: 'Recordatorio', icon: '🔔' },
];

export function AgendaAddItemView({ editItem, onSave, onCancel }) {
  const isEditing = !!editItem;

  const [title, setTitle] = useState('');
  const [itemType, setItemType] = useState('task');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('normal');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title || '');
      setItemType(editItem.itemType || 'task');
      setCategory(editItem.category || 'Personal');
      setPriority(editItem.priority || 'normal');
      setDueDate(editItem.dueDate || '');
      setDueTime(editItem.dueTime || '');
      setLocation(editItem.location || '');
      setNotes(editItem.notes || '');
      setImageUrl(editItem.imageUrl || null);
    }
  }, [editItem]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      ...(editItem || {}),
      title: title.trim(),
      itemType,
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      location: location.trim() || null,
      notes: notes.trim() || null,
      imageUrl: imageUrl,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compressing to 0.7 to significantly reduce size for localStorage
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImageUrl(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

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
          {isEditing ? 'Editar pendiente' : 'Añadir pendiente'}
        </h1>
      </header>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '8rem' }}>

        {/* Title */}
        <div>
          <label style={labelStyle}>¿Qué tienes pendiente?</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ej: Sacar hora al médico, Comprar regalos..."
            style={{ ...inputStyle, fontSize: '16px', padding: '14px 16px' }}
            autoFocus
          />
        </div>

        {/* Item Type */}
        <div>
          <label style={labelStyle}>Tipo</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {ITEM_TYPES.map(t => (
              <button key={t.value} onClick={() => setItemType(t.value)} style={{
                padding: '10px 6px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                border: '1.5px solid',
                borderColor: itemType === t.value ? '#22c55e' : 'var(--border-color)',
                backgroundColor: itemType === t.value ? '#f0fdf4' : 'var(--card-bg)',
                color: itemType === t.value ? '#16a34a' : 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: '16px' }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category: Removed as requested */}

        {/* Priority */}
        <div>
          <label style={labelStyle}>Prioridad</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {PRIORITIES.map(p => {
              const active = priority === p.value;
              const colors = {
                urgent: { border: '#f87171', bg: '#fef2f2', text: '#dc2626' },
                normal: { border: '#fbbf24', bg: '#fffbeb', text: '#d97706' },
                no_rush: { border: '#86efac', bg: '#f0fdf4', text: '#16a34a' },
                annotation: { border: '#94a3b8', bg: '#f8fafc', text: '#64748b' },
              };
              const c = colors[p.value];
              return (
                <button key={p.value} onClick={() => setPriority(p.value)} style={{
                  flex: 1, padding: '10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                  border: `1.5px solid ${active ? c.border : 'var(--border-color)'}`,
                  backgroundColor: active ? c.bg : 'var(--card-bg)',
                  color: active ? c.text : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{p.label}</button>
              );
            })}
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <label style={labelStyle}><Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Fecha (opcional)</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} />
          {dueDate && (
            <div style={{ marginTop: '8px' }}>
              <label style={{ ...labelStyle, marginBottom: '6px' }}><Clock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Hora (opcional)</label>
              <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} style={inputStyle} />
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label style={labelStyle}><MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Lugar (opcional)</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Ej: Clínica, Mall, Casa, Centro..."
            style={inputStyle}
          />
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
            Útil para que el Agente IA te recuerde pendientes según donde estés.
          </p>
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}><FileText size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Detalles adicionales..."
            rows={2}
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>

        {/* Photo Attachment */}
        <div>
          <label style={labelStyle}>Adjuntar foto</label>
          {imageUrl ? (
            <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img src={imageUrl} alt="Adjunto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => setImageUrl(null)}
                style={{
                  position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px',
                  borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white',
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '14px', borderRadius: '12px', border: '1.5px dashed var(--border-color)',
              backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)', fontSize: '14px',
              fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s'
            }}>
              Subir imagen
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      </div>

      {/* Footer buttons */}
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
          {isEditing ? 'Guardar cambios' : 'Guardar tarea'}
        </button>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', letterSpacing: '0.3px' };
const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--card-bg)', fontSize: '14px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit' };
const btnPrimary = { backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' };
const btnSecondary = { backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1.5px solid var(--border-color)', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' };
